from django.shortcuts import render

from seminar.models import PostRecruitSeminar


def rec(req):
    context = {'posts': PostRecruitSeminar.objects.order_by('-created_at')}
    return render(req, 'rec.html', context)