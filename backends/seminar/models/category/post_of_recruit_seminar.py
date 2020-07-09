from django.db import models

from ..post.post_with_tags import PostWithTags


class PostOfRecruitSeminar(PostWithTags):
    category = 'recruit_seminar'
    min_people_count = models.SmallIntegerField(default=0)
    max_people_count = models.SmallIntegerField(default=0)
    times_of_class = models.SmallIntegerField(default=0)
