from .machine import Machine, Record
from .actions import MachineBaseAction, MachineDeleteAction, MachineDeleteRecordsAction
from .problems import (
    MachineBaseProblem,
    MachineNoTitleProblem,
    MachineNoRecordProblem,
    MachineHightLevelProblem,
    MachineLowBatteryProblem,
    MachineOldRecordProblem,
    MachineDeathBatteryProblem,
    scan_problems
)

__all__ = [
    Machine, 
    Record,
    MachineBaseAction,
    MachineDeleteAction,
    MachineDeleteRecordsAction,
    MachineBaseProblem,
    MachineNoTitleProblem,
    MachineNoRecordProblem,
    MachineHightLevelProblem,
    MachineLowBatteryProblem,
    MachineOldRecordProblem,
    MachineDeathBatteryProblem,
    scan_problems
]