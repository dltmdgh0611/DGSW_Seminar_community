from django.db import models

from .post import Post


class PostWithTags(Post):
    tag_kind = models.TextField(null=True)

    @property
    def get_tags(self):
        if self.tag_kind is None:
            return []
        return [{'id': k, 'name': tag}for k, tag in enumerate(str(self.tag_kind).split(','))]

    class Meta:
        abstract = True
        ordering = ['-created_at']
