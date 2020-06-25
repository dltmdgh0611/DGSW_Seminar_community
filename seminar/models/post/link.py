from django.conf import settings
from django.db import models


class Link(models.Model):
    uuid = models.UUIDField(primary_key=True)
    writer = models.ForeignKey(settings.AUTH_USER_MODEL, models.PROTECT, 'wrote_post')

    namespace = models.CharField(blank=False, max_length=60)

    def __str__(self):
        return f'Link({self.uuid})'

    @property
    def get_uuid(self):
        return str(self.uuid)
