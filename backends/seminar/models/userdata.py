from django.contrib.auth.models import User
from django.db import models


class UserData(models.Model):
    user_id = models.ForeignKey(User, models.deletion.PROTECT, related_name='data')
    uuid = models.UUIDField(primary_key=True)
    profile_url = models.URLField()
