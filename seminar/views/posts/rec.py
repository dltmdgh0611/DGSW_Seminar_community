from django.shortcuts import render

from seminar.models import post_recruit_seminar


def rec(req):
    context = {'posts': post_recruit_seminar.objects.order_by('-created_at')}
    return render(req, 'rec.html', context)