from django.shortcuts import render

from seminar.models import PostFreeSeminar


def free(req):
    context = {'posts': PostFreeSeminar.objects.order_by('-created_at')}
    return render(req, 'free.html', context)