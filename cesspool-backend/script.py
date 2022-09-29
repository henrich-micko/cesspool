from machine import models

print(
    models.Machine.objects.get_machine_code()
)
