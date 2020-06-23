from django.shortcuts import render

from seminar.models import PostRequestSeminar


def req(req):
    context = {'posts': PostRequestSeminar.objects.order_by('-created_at')}
    return render(req, 'req.html', context)
