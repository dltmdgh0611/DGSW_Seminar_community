from django.shortcuts import render

from seminar.models.category import PostOfRecruitSeminar


def recruit_seminar(req):
    context = {'posts': PostOfRecruitSeminar.objects.all()}
    return render(req, 'category/recruit_seminar.html', context)
