from account import tasks, models

user = models.UserAccount.objects.get(email = "heno.micko@gmail.com")
print(tasks.send_welcome_email.delay(user_pk = user.pk))

class Item:
    def __init__(self):
        self.name = "hello"

print(x)
