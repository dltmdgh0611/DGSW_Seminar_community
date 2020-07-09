from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import models


class Member(models.Model):
    user_id = models.OneToOneField(get_user_model(), models.deletion.PROTECT, related_name='data')
    uuid = models.UUIDField(primary_key=True)
    profile_url = models.URLField()

    Schema = None
