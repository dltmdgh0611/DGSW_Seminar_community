from django.conf import settings
from django.db import models

from .link import Link


class Recommend(models.Model):
    objects = None
    ref_link = models.ForeignKey(Link, on_delete=models.CASCADE, related_name='recommends')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT, 'recommends')

    class Meta:
        unique_together = ['ref_link', 'user']
