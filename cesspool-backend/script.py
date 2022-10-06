from account import tasks, models

user = models.UserAccount.objects.get(email = "heno.micko@gmail.com")
print(tasks.send_welcome_email.delay(user_pk = user.pk))