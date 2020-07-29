from django.db import models

class Calendar(models.Model):
    plan_id = models.UUIDField(null=True)
    title = models.CharField(blank=False, max_length=60)
    PlanStart = models.CharField(blank=False, max_length=60)
    PlanEnd = models.CharField(blank=False, max_length=60)

    class Meta:
        ordering = ['-PlanStart']