from django.conf import settings
from django.db import models


class Link(models.Model):
    uuid = models.UUIDField(primary_key=True)
    writer = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT, 'wrote_post')

    title = models.CharField(blank=False, max_length=60)
