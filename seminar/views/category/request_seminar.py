from django.shortcuts import render

from seminar.models.category import PostOfRequestSeminar


def request_seminar(req):
    context = {'posts': PostOfRequestSeminar.objects.all()}
    return render(req, 'category/request_seminar.html', context)
