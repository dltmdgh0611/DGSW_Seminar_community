from django.db import models

from django.conf import settings
from seminar.models import PostRecruitSeminar


class Comment(models.Model):
    post = models.ForeignKey(PostRecruitSeminar, on_delete=models.CASCADE, null=True, related_name='comments')
    comment_date = models.DateTimeField(auto_now_add=True)
    comment_content = models.CharField(max_length=200)
    comment_writer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name='comments')
