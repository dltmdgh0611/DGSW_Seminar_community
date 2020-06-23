from django.shortcuts import render

from seminar.models import post_free_seminar


def rec(req):
    context = {'posts': post_free_seminar.objects.order_by('-created_at')}
    return render(req, 'rec.html', context)