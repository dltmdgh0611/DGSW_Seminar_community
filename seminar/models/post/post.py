from django.db import models

from .link import Link


class Post(models.Model):
    link = models.ForeignKey(Link, models.PROTECT, blank=False)
    title = models.CharField(blank=False, max_length=60)
    content = models.TextField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)

    vote_count = models.PositiveIntegerField(default=0)

    __slots__ = 'recommends'

    category = None

    def update_vote_count(self):
        self.vote_count = len(self.recommends.all())

    class Meta:
        abstract = True
        ordering = ['-created_at']
