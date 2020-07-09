import datetime
import json

from django.shortcuts import render
from django.utils.safestring import SafeString

from seminar.models.manage_seminar.room_for_seminar import RoomForSeminar
from . import manage_seminar_required
from ...models.manage_seminar.duration_name_for_seminar import DurationNameForSeminar
from ...models.manage_seminar.planed_seminar import PlannedSeminar

name_of_weekdays = ['월', '화', '수', '목', '금', '토', '일']


@manage_seminar_required
def manage(req, *args, **kwargs):
    binding_dates = []
    now = datetime.datetime.now().date()
    date = now
    seminars = []
    rooms = []
    durations = [duration.name for duration in DurationNameForSeminar.objects.all()]
    while len(binding_dates) < 100:
        if date.weekday() not in [6]:
            if now.year == date.year:
                key = '%2d월 %2d일(%s)' % (date.month, date.day, name_of_weekdays[date.weekday()])
            else:
                key = '%d년 %2d월 %2d일(%s)' % (date.year, date.month, date.day, name_of_weekdays[date.weekday()])
            binding_dates.append([key, '·', date.year, date.month, date.day, date.weekday()])
        date += datetime.timedelta(days=1)

    for planned_seminar in PlannedSeminar.objects.all():
        seminars.append({'name': planned_seminar.title,
                         'id': planned_seminar.id,
                         'tags': name_of_weekdays + durations,
                         'available_weekday_codes': [0, 1, 2, 3, 4],
                         'available_duration_codes': [1, 3],
                         'people_count': len(planned_seminar.post.link.recommends.all()),
                         'times_of_class': planned_seminar.post.times_of_class})

    for room in RoomForSeminar.objects.all():
        rooms.append(
            {'name': room.name, 'min_people_count': room.min_people_count, 'max_people_count': room.max_people_count}
        )

    return render(req, 'manage.html', {
        'rooms': SafeString(json.dumps(rooms)),
        'binding_date': SafeString(json.dumps(binding_dates)),
        'seminars': SafeString(json.dumps(seminars)),
        'durations': SafeString(json.dumps(durations)),
        'all_available_tags': SafeString(json.dumps(name_of_weekdays + durations))
    })
