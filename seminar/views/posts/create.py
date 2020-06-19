from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from seminar.models import Post


@login_required
def create(req):
    if req.method == 'GET':
        return render(req, 'create_post.html')
    elif req.method == 'POST':
        post = Post()
        post.writer = req.user
        post.title = req.POST['title']
        post.content = req.POST['content']
        post.save()
        return redirect('main')
