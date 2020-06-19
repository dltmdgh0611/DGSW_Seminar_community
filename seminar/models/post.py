from django.conf import settings
from django.db import models


class Post(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    writer = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT, 'writen_posts')
    title = models.CharField(blank=False, max_length=60)
    content = models.TextField(blank=False)
    vote_count = models.PositiveIntegerField(default=0)

    def update_vote_count(self):
        self.vote_count = len(self.recommends.all())

    def __str__(self):
        return f'{self.title} - {self.writer.username}'

