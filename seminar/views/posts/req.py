from django.shortcuts import render

from seminar.models import post_request_seminar


def req(req):
    context = {'posts': post_request_seminar.objects.order_by('-created_at')}
    return render(req, 'req.html', context)
