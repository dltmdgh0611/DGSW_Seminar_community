from django.conf import settings
from django.db import models

from seminar.models import Post


class Recommend(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, related_name='recommends')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recommends')

    class Meta:
        unique_together = ['post', 'user']
