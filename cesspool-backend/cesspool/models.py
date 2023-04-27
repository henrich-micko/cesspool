from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.timezone import datetime
from django.utils.translation import gettext as _

from cesspool.validators import validate_machine_code
from cesspool.utils import generate_cesspool_code
from cesspool.managers import RecordQuerySet
from utils.models import ModelWithDeleteField, Notification
from utils.utils import to_percent


class Cesspool(ModelWithDeleteField):
    code = models.CharField(max_length = 10, 
                            unique = True, 
                            blank = False, 
                            null = False, 
                            validators = [validate_machine_code],
                            default = generate_cesspool_code,
    )

    about = models.CharField(max_length = 255, blank = True, null = True)
    
    city = models.ForeignKey("location.City", on_delete = models.SET_NULL, null = True)
    address = models.CharField(max_length = 30, default = None, null = True)

    subscription = models.ForeignKey("subscription.Subscription", on_delete = models.SET_NULL, null = True, blank = True)
    subscription_expiration_date = models.DateField(null = True, blank = True)
    debug_mode = models.BooleanField(default = False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.SET_NULL, null = True)

    class Meta:
        permissions = [
            ["related_to_cesspool", "Can be related to the cesspool"],
            ["manage_cesspool", "Can manage cesspools"]
        ]

    def __str__(self):
        return self.code

    def get_record(self, field = None):
        """Get last record or field of last record"""

        last_record = self.record_set.last()
        if last_record == None: return None
        if field == None: return last_record
        return getattr(last_record, field, None)
    
    @property
    def is_subscription_valid(self):
        return self.subscription != None and timezone.now() <= self.expiration_date
    
    # run quick scan and find problems
    def doctor(self):
        record: Record = self.get_record()
        if not record:
            return []

        output = []
        is_not_responding = record.date < timezone.now() - timezone.timedelta(days = 2)
        is_battery_low = record.battery < 3 and not is_not_responding
        is_battery_dead = is_not_responding and record.battery < 3

        # get || create instances of problems
        if is_not_responding:
            output.append(
                CesspoolNotRespondingProblem.objects.get_or_create(cesspool = self)[0]
            )
        if is_battery_low:
            output.append(
                CesspoolLowBatteryProblem.objects.get_or_create(cesspool = self)[0]
            )
        if is_battery_dead:
            output.append(
                CesspoolDeadBatteryProblem.objects.get_or_create(cesspool = self)[0]
            )
        
        return output

    def get_owner(self):
        try: return CesspoolToUser.objects.get(cesspool = self, is_super_owner = True).user
        except CesspoolToUser.DoesNotExist: return None

    def generate_debug_records(self, days: int, freq_h: int, max_level_m: int = 25, increase: int = 0.25):
        if not self.debug_mode:
            self.debug_mode = True
            self.save()

        # some values
        record = self.get_record()
        level_m = record.level_m if record != None else 0
        battery_v = record.battery_voltage if record != None else 0
        created_at = record.date if record != None else timezone.now()

        # go through n days and create record every freq_h
        for i in range(days):
            for j in range(24 // freq_h):
                record = self.record_set.create(
                    level_m = round(level_m, 2),
                    level_percent = to_percent(level_m, max_level_m),
                    battery_voltage = round(battery_v, 2),
                    battery = to_percent(battery_v, 6),
                    created_on_debug_mode = True
                )

                record.date = created_at
                record.save()

                level_m = level_m + increase if level_m <= max_level_m else 5
                battery_v = battery_v - 0.25 if battery_v >= 6.0 else 6.0
                created_at += timezone.timedelta(hours = freq_h)


class CesspoolToUser(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    cesspool = models.ForeignKey(Cesspool, on_delete = models.CASCADE)

    title = models.CharField(max_length = 25, default = None, null = True, blank = None)
    contact_at_level = models.FloatField(default = 80.0)

    is_super_owner = models.BooleanField(default = False)

    class Meta:
        unique_together = ["user", "cesspool"]

    def __str__(self):
        return f"{self.cesspool} to {self.user}"

    # def delete(self, *args, **kwargs):        
    #     if self.is_owner:
    #         new_owner = CesspoolToUser.objects.filter(user = self.user, cesspool = self.cesspool, is_owner = False).first()
    #         if new_owner != None:
    #             new_owner.is_owner = True
    #             new_owner.save()
    #     return super().delete(*args, **kwargs)
        
    def doctor(self):
        level = self.cesspool.get_record("level")

        if level != None and level > self.contact_at_level:
            return [CesspoolHightLevelNotif.objects.get_or_create(ctu = self)]
        return []


class Record(models.Model):
    objects = RecordQuerySet.as_manager()

    cesspool = models.ForeignKey(Cesspool, on_delete = models.CASCADE)
    date = models.DateTimeField(auto_now_add = True)
    level_m = models.FloatField()
    level_percent = models.FloatField()
    battery = models.FloatField() # percent
    battery_voltage = models.FloatField()

    created_on_debug_mode = models.BooleanField(default = False)
    mqtt_message = models.CharField(max_length = 255, blank = True, null = True, default = None)

    def __str__(self):
        return f"{self.cesspool} at {self.date}"
    

# notif for user ( based on ctu )
class CesspoolHightLevelNotif(Notification):
    ctu = models.ForeignKey(CesspoolToUser, on_delete = models.CASCADE)
    detail = _("Hight level of trash.")

    def __str__(self):
        f"{self.ctu}"


"""
-------------------------
This problem down here 
are sand only all admins
-------------------------
"""


class CesspoolDeadBatteryProblem(models.Model):
    cesspool = models.ForeignKey(Cesspool, on_delete = models.CASCADE)
    is_sand = models.BooleanField(default = False)
    detail = _("Battery is dead.")

    def __str__(self):
        return f"{self.cesspool}"


class CesspoolLowBatteryProblem(models.Model):
    cesspool = models.ForeignKey(Cesspool, on_delete = models.CASCADE)
    is_sand = models.BooleanField(default = False)
    detail = _("Battery is low.")

    def __str__(self):
        return f"{self.cesspool}"


class CesspoolNotRespondingProblem(models.Model):
    cesspool = models.ForeignKey(Cesspool, on_delete = models.CASCADE)
    is_sand = models.BooleanField(default = False)

    @property
    def detail(self):
        last_record_date = self.cesspool.get_record("date")
        return _(f"Cesspool is not responding since {last_record_date.day}. {last_record_date.month}. {last_record_date.year}")

    def __str__(self):
        return f"{self.cesspool}"