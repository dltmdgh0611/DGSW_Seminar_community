from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from seminar.models.category.post_of_recruit_seminar import PostOfRecruitSeminar


@login_required
def select(req, category: str, index: int):
    if req.method == 'GET':
        post = PostOfRecruitSeminar.objects.get(pk=index)
        context = {'post': post, 'comments': post.comments.all(), 'recommends': post.recommends.filter(user=req.user)}
        return render(req, 'post/view.html', context)
    elif req.method == 'DELETE':
        PostOfRecruitSeminar.objects.get(pk=index).delete()
        return JsonResponse({}, status=200)
