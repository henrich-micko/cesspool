from django.utils import timezone

from . import models


def scan_machine_actions(save = True):
    actions_models = [models.MachineDeleteAction, models.MachineDeleteRecordsAction]
    actions = [am.objects.all() for am in actions_models]

    now = timezone.now()

    for action in actions:
        if action.date == now:
            try:
                action.run()
            except BaseException as error:
                if save:
                    raise error