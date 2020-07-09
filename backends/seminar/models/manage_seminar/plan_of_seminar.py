from django.db import models

from seminar.models.manage_seminar.planed_seminar import PlannedSeminar
from seminar.models.manage_seminar.room_for_seminar import RoomForSeminar


class PlanOfSeminar(models.Model):
    objects = None
    seminar = models.ForeignKey(PlannedSeminar, models.deletion.PROTECT, related_name='plans')
    room = models.ForeignKey(RoomForSeminar, models.deletion.PROTECT, related_name='plans')
    sub_title = models.CharField(blank=False, max_length=20)
    starts_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField(auto_now=True)
