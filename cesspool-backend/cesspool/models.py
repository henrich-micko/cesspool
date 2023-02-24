from django.db import models
from django.conf import settings
from django.utils import timezone

from cesspool.validators import validate_machine_code
from cesspool.utils import generate_cesspool_code
from utils.models import ModelWithDeleteField


class Cesspool(ModelWithDeleteField):
    
    code = models.CharField(max_length = 10, 
                            unique = True, 
                            blank = False, 
                            null = False, 
                            validators = [validate_machine_code],
                            default = generate_cesspool_code,
    )
    about = models.CharField(max_length = 255, blank = True, null = True)

    city = models.ForeignKey("location.City", on_delete = models.CASCADE, null = True)
    subscription = models.ForeignKey("subscription.Subscription", on_delete = models.CASCADE, null = True, blank = True)
    subscription_expiration_date = models.DateField(null = True, blank = True)

    class Meta:
        permissions = [
            ["related_to_cesspool", "Can be related to the cesspool"]
        ]

    def __str__(self):
        return self.code

    def get_record(self, field = None):
        """Get last record or field of last record"""

        last_record = self.recorc_set.last(default = None)
        if last_record == None: return None
        if field == None: return last_record
        return getattr(last_record, field, None)
    
    @property
    def is_subscription_valid(self):
        return self.subscription != None and timezone.now() <= self.expiration_date
    

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

    def delete(self, *args, **kwargs):        
        if self.is_owner:
            new_owner = CesspoolToUser.objects.filter(user = self.user, cesspool = self.cesspool, is_owner = False).first()
            if new_owner != None:
                new_owner.is_owner = True
                new_owner.save()
        return super().delete(*args, **kwargs)
        

class Record(models.Model):
    cesspool = models.ForeignKey(Cesspool, on_delete = models.CASCADE)
    
    date = models.DateTimeField(auto_now_add = True)
    level_m = models.FloatField()
    level_percent = models.FloatField()
    battery = models.FloatField()

    def __str__(self):
        return f"{self.cesspool} at {self.date}"