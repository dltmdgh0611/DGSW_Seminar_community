
from django.contrib.auth.models import AbstractUser
from django.db import models


class Member(AbstractUser):
    uuid = models.UUIDField(primary_key=True)
    profile_url = models.URLField(default="/static/img/default_profile.png")

    class Meta:
        app_label = 'backend_setting'
