from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from seminar.models import PostRecruitSeminar, Comment


@login_required
def select(req, index: int):
    if req.method == 'DELETE':
        Comment.objects.get(pk=index).delete()
        return JsonResponse({}, status=200)
