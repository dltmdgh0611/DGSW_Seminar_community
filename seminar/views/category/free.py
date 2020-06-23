from django.shortcuts import render

from seminar.models.category import PostOfFreeSeminar


def free(req):
    context = {'posts': PostOfFreeSeminar.objects.all()}
    return render(req, 'category/recruit_seminar.html', context)
