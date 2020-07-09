from django.db import models

from ..member import Member


class Link(models.Model):
    uuid = models.UUIDField(primary_key=True)
    writer = models.ForeignKey(Member, models.PROTECT, 'wrote_post')

    namespace = models.CharField(blank=False, max_length=60)
    Schema = None
    objects = None

    def __str__(self):
        return f'Link({self.uuid})'

    @property
    def get_uuid(self):
        return str(self.uuid)


'''
class LinkSchema(DjangoObjectType):
    class Meta:
        model = Link


Link.Schema = LinkSchema
'''
