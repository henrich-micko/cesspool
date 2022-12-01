from django.db import models
from django.conf import settings
from django.utils import timezone

from datetime import datetime, date, timedelta

from . import managers, validators


class Machine(models.Model):
    objects = managers.MachineManager()

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, null = True)
    code = models.CharField(max_length = 10, unique = True, blank = False, null = False, validators = [validators.validate_machine_code])

    title = models.CharField(max_length = 14, null = True, blank = True)
    hight_level = models.IntegerField(default = 85)
    
    mqtt = models.BooleanField(default = True)
    notification = models.BooleanField(default = True)

    def __str__(self) -> str:
        return self.code

    def get_record(self):
        return self.record_set.last()
    
    @property
    def level(self) -> int|None:
        records = self.record_set.last_n(5)
        if not records:
            return None
        
        return records.get_level_average()

    @property
    def level_percent(self) -> int|None:
        records = self.record_set.last_n(5)
        if not records:
            return None
        
        return records.get_level_percent_average()

    @property
    def battery(self) -> int|None:
        record = self.get_record()
        return record.battery if record != None else None
    
    @property
    def last_update(self) -> datetime|None:
        record = self.get_record()
        return record.date if record != None else None 

    def release_date(self):
        records = self.record_set.all().time_period(days = 1)
        if len(records) < 2: return

        first_record, last_record = records.first(), records.last()
        percent_rise = last_record.rise_percent(first_record)
        
        if percent_rise <= 0:
            new_records = []
            for record in records:
                if record.rise() <= 0: break
                new_records.append(record)
            if len(new_records) < 2: return

            first_record, last_record = new_records[0], new_records[-1]
            percent_rise = last_record.rise_percent(first_record)

        time = last_record.date - first_record.date
        level_percent = last_record.level
        output = last_record.date

        while level_percent < 85:
            level_percent += percent_rise
            try: output += time
            except OverflowError: break

        return date(year = output.year, month = output.month, day = output.day)

    def action_at(self, action: models.Model, date: datetime):
        action = action.objects.update_or_create(machine = self, defaults = {"date": date})
        return action

    def one_to_one(self, table: models.Model, default = None):
        output = table.objects.filter(machine = self).first()
        if output != None:
            return output
        return default


class Record(models.Model):
    objects = managers.RecordQuerySet.as_manager()

    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)
    date = models.DateTimeField(auto_now_add = True)
    level = models.FloatField(default = 0.0)
    level_percent = models.FloatField(default = 0.0)
    battery = models.FloatField(default = 0.0)

    def __str__(self) -> str:
        return f"{str(self.machine)} -> {self.date}: {self.level_percent}"

    def index(self, index: int, default: any = None):
        records_list = list(self.machine.record_set.all()) 
        center_index = records_list.index(self)
        index = center_index + index

        if len(records_list) - 1 >= index: 
            return records_list[index]
        return default

    def rise(self, record = None) -> int|None:
        before_record = record if record != None else self.index(-1)
        return self.level - before_record.level if before_record != None else None

    def rise_percent(self, record = None):
        before_record = record if record != None else self.index(-1)
        return self.level_percent - before_record.level_percent if before_record != None else None

    def is_valid(self, minimal_rise: int = 40) -> None|bool:
        record_after = self.index(1)
        record_after_rise_percent = record_after.rise_percent() if record_after != None else None
        if record_after_rise_percent == None:
            return None

        rise_percent = self.rise_percent()
        if rise_percent == None:
            return None

        return not (rise_percent >= minimal_rise and record_after_rise_percent <= -minimal_rise + 10)


"""
Actions for machine
    - table with datetime field
    - on this time run method will be executed

"""

class MachineBaseAction(models.Model):
    machine = models.OneToOneField(Machine, on_delete = models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        abstract = True
        
    def __str__(self):
        return f"{self.machine} at {self.date}"

    def run(self):
        pass

class MachineDeleteAction(MachineBaseAction):
    def run(self):
        self.machine.delete()

class MachineDeleteRecordsAction(MachineBaseAction):
    def run(self):
        self.machine.records.all().delete()

"""
Machine Problems tables
    - each of the problem has own table
    - if problem ocured it will create instance of problem table
    - it has only one field is_sand (is sand to user)
    - importance and detail are only par
"""

PROBLEM_WARNING = 0
PROBLEM_ERROR = 1


class MachineBaseProblem(models.Model):
    machine = models.OneToOneField(Machine, on_delete = models.CASCADE)

    importance = None
    detail = None

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.machine}"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return False


class MachineBaseWarning(MachineBaseProblem):
    importance = PROBLEM_WARNING

    class Meta:
        abstract = True

class MachineBaseError(MachineBaseProblem):
    is_sand = models.BooleanField(default = False)
    importance = PROBLEM_ERROR

    class Meta:
        abstract = True

class MachineNoRecordProblem(MachineBaseWarning):
    detail = "Nenašli sa zatial záznamy"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return len(machine.record_set.all()) == 0


class MachineNoTitleProblem(MachineBaseWarning):
    detail = "Není natavený názov: nastavenia > názov"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return machine.title == None


class MachineHightLevelProblem(MachineBaseError):
    
    @property
    def detail(self):
        return f"Vysoka hladina: nad {self.machine.hight_level}%"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return machine.level_percent != None and machine.level_percent > machine.hight_level


class MachineLowBatteryProblem(MachineBaseError):
    
    @property
    def detail(self):
        return f"Takmer vybita bateria: {self.machine.battery}%"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return machine.battery != None and machine.battery < 2


class MachineDeathBatteryProblem(MachineBaseError):
    detail = "Dlahšie sa neozíva: vybitá bateria"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return machine.battery != None and machine.battery < 1 and machine.last_update <= timezone.now() - timedelta(days = 2)


class MachineOldRecordProblem(MachineBaseError):
    @property
    def detail(self):
        respond_time = timezone.now() - self.machine.last_update
        
        if respond_time.days != None:
            return f"Dlhšiu dobu sa neoziva: viac ako {respond_time.days} dní"
        
        else:
            return "Dlhšiu dobu sa neoziva: menej ako deň"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        return machine.battery != None and machine.battery > 2 and machine.last_update <= timezone.now() - timedelta(days = 2)


PROBLEMS  = [
    MachineNoTitleProblem,
    MachineNoRecordProblem,
    MachineHightLevelProblem,
    MachineLowBatteryProblem,
    MachineOldRecordProblem,
    MachineDeathBatteryProblem
]

def scan_problems(machine: Machine):
    output = []

    for problem in PROBLEMS:
        if problem.scan_for_machine(machine):
            output.append(problem.objects.get_or_create(machine = machine)[0])

        elif machine.one_to_one(problem, False):
            machine.one_to_one(problem).delete()

    return sorted(output, key = lambda item: item.importance, reverse = True)