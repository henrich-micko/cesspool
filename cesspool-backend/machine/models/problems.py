from django.db import models
from django.utils import timezone

from datetime import timedelta

from . import machine as machine_models


WARNING = 0
ERROR = 1


class MachineBaseProblem(models.Model):
    machine = models.OneToOneField(machine_models.Machine, on_delete = models.CASCADE)

    importance = None
    detail = None

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.machine}"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return False


class MachineBaseWarning(MachineBaseProblem):
    importance = WARNING

    class Meta:
        abstract = True

class MachineBaseError(MachineBaseProblem):
    is_sand = models.BooleanField(default = False)
    importance = ERROR

    class Meta:
        abstract = True

class MachineNoRecordProblem(MachineBaseWarning):
    detail = "Nenašli sa zatial záznamy"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return len(machine.record_set.all()) == 0


class MachineNoTitleProblem(MachineBaseWarning):
    detail = "Není natavený názov: nastavenia > názov"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.title == None


class MachineHightLevelProblem(MachineBaseError):
    
    @property
    def detail(self):
        return f"Vysoka hladina: nad {self.machine.hight_level}%"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.level_percent != None and machine.level_percent > machine.hight_level


class MachineLowBatteryProblem(MachineBaseError):
    
    @property
    def detail(self):
        return f"Takmer vybita bateria: {self.machine.battery}%"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.battery != None and machine.battery < 2


class MachineDeathBatteryProblem(MachineBaseError):
    detail = "Dlahšie sa neozíva: vybitá bateria"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
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
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.battery != None and machine.battery > 2 and machine.last_update <= timezone.now() - timedelta(days = 2)


def scan_problems(machine: machine_models.Machine):
    problems = [
        MachineNoTitleProblem,
        MachineNoRecordProblem,
        MachineHightLevelProblem,
        MachineLowBatteryProblem,
        MachineOldRecordProblem,
        MachineDeathBatteryProblem
    ]
    
    output = []

    for problem in problems:
        if problem.scan_for_machine(machine):
            output.append(problem.objects.get_or_create(machine = machine)[0])

        elif machine.one_to_one(problem, False):
            machine.one_to_one(problem).delete()

    return sorted(output, key = lambda item: item.importance, reverse = True)