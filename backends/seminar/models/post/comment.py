from django.conf import settings
from django.db import models

from .link import Link


class Comment(models.Model):
    uuid = models.UUIDField(primary_key=True, default=0)
    ref_link = models.ForeignKey(Link, on_delete=models.CASCADE, null=True, related_name='comments')
    comment_date = models.DateTimeField(auto_now_add=True)
    comment_content = models.CharField(max_length=200)
    comment_writer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True,
                                       related_name='comments')

    class Meta:
        ordering = ['-comment_date']
