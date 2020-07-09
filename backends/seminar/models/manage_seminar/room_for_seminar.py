from django.db import models


class RoomForSeminar(models.Model):
    objects = None
    name = models.CharField(blank=False, max_length=20)
    min_people_count = models.SmallIntegerField()
    max_people_count = models.SmallIntegerField()

    def __str__(self):
        return f'{self.name}(수용인원: {self.min_people_count} - {self.max_people_count})'
