from django.db import models

from seminar.models.category import PostOfRecruitSeminar


class PlannedSeminar(models.Model):
    objects = None
    post = models.OneToOneField(PostOfRecruitSeminar, models.deletion.PROTECT, related_name='data')
    title = models.CharField(blank=False, max_length=20, unique=True)
    tag_string = models.CharField(blank=False, max_length=80)
