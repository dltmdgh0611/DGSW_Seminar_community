from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from seminar.models import PostRecruitSeminar


@login_required
def create(req):
    if req.method == 'GET':
        return render(req, 'create_post.html')
    elif req.method == 'POST':
        post = PostRecruitSeminar()
        post.writer = req.user
        post.title = req.POST['title']
        post.content = req.POST['content']
        post.start_at = req.POST['start_at']
        post.end_at = req.POST['end_at']
        post.class_count = req.POST['class_count']
        data = set()
        for value in req.POST.getlist('tag_kind'):
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
        post.tag_kind = text

        post.save()
        return redirect('main')
