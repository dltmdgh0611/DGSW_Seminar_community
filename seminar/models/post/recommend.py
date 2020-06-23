from django.conf import settings
from django.db import models

from .link import Link


class Recommend(models.Model):
    link = models.ForeignKey(Link, on_delete=models.CASCADE, null=True, related_name='recommends')
    comment_date = models.DateTimeField(auto_now_add=True)
