from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404

from seminar.models.category import PostOfRequestSeminar, PostOfFreeSeminar
from seminar.models.category.post_of_recruit_seminar import PostOfRecruitSeminar


@login_required
def select(req, category: str, index: int):
    if req.method == 'GET':
        post = None
        if category == 'request_seminar':
            post = get_object_or_404(PostOfRequestSeminar, id=index)
        elif category == 'recruit_seminar':
            post = get_object_or_404(PostOfRecruitSeminar, id=index)
        elif category == 'free':
            post = get_object_or_404(PostOfFreeSeminar, id=index)
        else:
            return HttpResponse(status=404)

        context = {'post': post, 'comments': post.link.comments.all(),
                   'recommends': post.link.recommends.filter(user=req.user), 'category': category}
        return render(req, 'post/view.html', context)
    elif req.method == 'DELETE':
        post = None
        if category == 'request_seminar':
            post = get_object_or_404(PostOfRequestSeminar, id=index)
        elif category == 'recruit_seminar':
            post = get_object_or_404(PostOfRecruitSeminar, id=index)
        elif category == 'free':
            post = get_object_or_404(PostOfFreeSeminar, id=index)
        else:
            return HttpResponse(status=404)
        post.delete()
        return JsonResponse({}, status=200)
