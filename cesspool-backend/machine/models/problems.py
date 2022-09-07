from django.db import models
from django.utils import timezone

from datetime import timedelta

from . import machine as machine_models


class MachineProblemImportance(models.IntegerChoices):
    WARNING = 0, ("warning")
    ERROR = 1, ("error")

    @classmethod
    def get_by_name(cls, name: str, default = None):
        for item in cls.choices:
            if item[1] == name: return item[0]
        return default


class MachineBaseProblem(models.Model):
    machine = models.OneToOneField(machine_models.Machine, on_delete = models.CASCADE)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.importance}: {self.detail}"

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return False


class MachineBaseWarning(MachineBaseProblem):
    importance = models.IntegerField(choices = MachineProblemImportance.choices, default = MachineProblemImportance.get_by_name("warning"))

    class Meta:
        abstract = True


class MachineBaseError(MachineBaseProblem):
    importance = models.IntegerField(choices = MachineProblemImportance.choices, default = MachineProblemImportance.get_by_name("error"))
    is_sand = models.BooleanField(default = False)

    class Meta:
        abstract = True


class MachineNoRecordProblem(MachineBaseWarning):
    detail = models.CharField(max_length = 20, default = "Nenašli sa záznmy")

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return len(machine.record_set.all()) == 0


class MachineNoTitleProblem(MachineBaseWarning):
    detail = models.CharField(max_length = 20, default = "Není natavený názov")

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.title == None


class MachineHightLevelProblem(MachineBaseError):
    detail = models.CharField(max_length = 20, default = "Vysoká hladina")

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.level != None and machine.level > machine.hight_level


class MachineLowBatteryProblem(MachineBaseError):
    detail = models.CharField(max_length = 20, default = "Slabá bateria")

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.battery != None and machine.battery < 5


class MachineDeathBatteryProblem(MachineBaseError):
    detail = models.CharField(max_length = 20, default = "Vybitá bateria")

    @classmethod
    def scan_for_machine(cls, machine: machine_models.Machine) -> bool:
        return machine.battery != None and machine.battery < 2 and machine.last_update <= timezone.now() - timedelta(days = 2)


class MachineOldRecordProblem(MachineBaseError):
    detail = models.CharField(max_length = 20, default = "Dlhšiu dobu sa neozíva")

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

    return output