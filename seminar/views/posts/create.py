import uuid

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from seminar.models.category.post_of_free_seminar import PostOfFreeSeminar
from seminar.models.category.post_of_recruit_seminar import PostOfRecruitSeminar
from seminar.models.category.post_of_request_seminar import PostOfRequestSeminar
from seminar.models.post.link import Link


def get_tag_string(POST):
    data = set()
    for value in POST.getlist('tag_kind'):
        if ',' in value:
            raise Exception('Unexpected Character ,')
        if type(value) is not str:
            raise Exception(f'Unexpected Type {type(value)}')
        data.add(value)
    text = ''
    for value in data:
        if len(text) > 0:
            text += ','
        text += value
    return text


@login_required
def create(req):
    if req.method == 'GET':
        return render(req, 'post/create.html')
    elif req.method == 'POST':
        link = Link()
        link.uuid = uuid.uuid4()
        link.writer = req.user
        if req.POST['category'] == 'request_seminar':
            post = PostOfRequestSeminar()
            post.title = req.POST['title']
            post.content = req.POST['content']
            post.tag_kind = get_tag_string(req.POST)
        if req.POST['category'] == 'recruit_seminar':
            post = PostOfRecruitSeminar()
            post.title = req.POST['title']
            post.content = req.POST['content']
            post.tag_kind = get_tag_string(req.POST)
        if req.POST['category'] == 'free':
            post = PostOfFreeSeminar()
            post.title = req.POST['title']
            post.content = req.POST['content']
        post.link = link

        link.save()
        post.save()
        return redirect('main')
