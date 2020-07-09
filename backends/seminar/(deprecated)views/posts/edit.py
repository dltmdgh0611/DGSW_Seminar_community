from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404

from seminar.models.category import PostOfRequestSeminar, PostOfFreeSeminar
from seminar.models.category.post_of_recruit_seminar import PostOfRecruitSeminar
from .views.posts import get_tag_string


@login_required
def edit(req, category, index):
    post = None
    if req.method == 'GET':
        if category == 'request_seminar':
            post = get_object_or_404(PostOfRequestSeminar, id=index)
        elif category == 'recruit_seminar':
            post = get_object_or_404(PostOfRecruitSeminar, id=index)
        elif category == 'free_seminar':
            post = get_object_or_404(PostOfFreeSeminar, id=index)
        else:
            return HttpResponse(status=404)
        return render(req, 'post/edit.html', {'category': category, 'post': post})
    elif req.method == 'POST':
        if req.POST['category'] == 'request_seminar':
            post = get_object_or_404(PostOfRequestSeminar, id=index)
            post.title = req.POST['title']
            post.content = req.POST['content']
            post.tag_kind = get_tag_string(req.POST)
        elif req.POST['category'] == 'recruit_seminar':
            post = get_object_or_404(PostOfRecruitSeminar, id=index)
            post.title = req.POST['title']
            post.content = req.POST['content']
            post.tag_kind = get_tag_string(req.POST)
        elif req.POST['category'] == 'free_seminar':
            post = get_object_or_404(PostOfFreeSeminar, id=index)
            post.title = req.POST['title']
            post.content = req.POST['content']
        else:
            return HttpResponse(status=404)
    post.save()
    return redirect(f'/posts/{category}/{index}')
