from django.db import models
from django.utils import timezone
from datetime import datetime, date, timedelta
from . import managers, validators


class Machine(models.Model):
    objects = managers.MachineManager()

    code = models.CharField(max_length = 10, unique = True, blank = False, null = False, validators = [validators.validate_machine_code])
    mqtt = models.BooleanField(default = True)
    notification = models.BooleanField(default = True)

    class Meta:
        permissions = [
            ("own_machine", "Can own machine"),
        ]

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

    def action_at(self, action: models.Model, date: datetime):
        action = action.objects.update_or_create(machine = self, defaults = {"date": date})
        return action

    def one_to_one(self, table: models.Model, default = None):
        output = table.objects.filter(machine = self).first()
        if output != None:
            return output
        return default

    def assign_to_users(self, users, remove_not_included = False):
        for user in users: 
            MachineToUser.objects.get_or_create(user = user, machine = self)
        
        if remove_not_included:
            for mtu in self.machinetouser_set.all():
                if mtu.user not in users: mtu.delete()

class MachineToUser(models.Model):
    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)
    user = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE)

    title = models.CharField(max_length = 14, null = True, blank = True)
    hight_level = models.IntegerField(default = 85)

    def __str__(self):
        return f"{self.machine} : {self.user}"

class Record(models.Model):
    objects = managers.RecordQuerySet.as_manager()

    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)
    date = models.DateTimeField(auto_now_add = True)
    level = models.FloatField(default = 0.0)
    level_percent = models.FloatField(default = 0.0)
    battery = models.FloatField(default = 0.0)

    def __str__(self) -> str:
        return f"{str(self.machine)} -> {self.date}: {self.level_percent}"

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
        return False


class MachineHightLevelProblem(MachineBaseError):
    
    @property
    def detail(self):
        return f"Vysoka hladina: nad {self.machine.hight_level}%"

    @classmethod
    def scan_for_machine(cls, machine: Machine) -> bool:
        # return machine.level_percent != None and machine.level_percent > machine.hight_level
        return False


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