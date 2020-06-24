from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from seminar.models import Comment


@login_required
def select(req, index):
    if req.method == 'DELETE':
        get_object_or_404(Comment, pk=index).delete()
        return JsonResponse({}, status=200)
