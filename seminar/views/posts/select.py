from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from seminar.models import Post


@login_required
def select(req, index: int):
    if req.method == 'GET':
        post = Post.objects.get(pk=index)
        context = {'post': post, 'comments': post.comments.all(), 'recommends': post.recommends.filter(user=req.user)}
        return render(req, 'post.html', context)
    elif req.method == 'DELETE':
        Post.objects.get(pk=index).delete()
        return JsonResponse({}, status=200)
