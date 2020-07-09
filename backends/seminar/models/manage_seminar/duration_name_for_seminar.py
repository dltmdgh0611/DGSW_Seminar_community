from django.db import models


class DurationNameForSeminar(models.Model):
    objects = None
    name = models.CharField(blank=False, max_length=20)

    def __str__(self):
        return f'{self.name}'
