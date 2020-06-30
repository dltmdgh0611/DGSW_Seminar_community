from django.contrib import admin

from seminar.models.manage_seminar.room_for_seminar import RoomForSeminar


@admin.register(RoomForSeminar)
class AdminRoomForSeminar(admin.ModelAdmin):
    fields = ('name', 'min_people_count', 'max_people_count')
