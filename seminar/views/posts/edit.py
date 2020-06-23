from django.shortcuts import render, redirect

from seminar.models import PostRecruitSeminar

def edit(req, index):
    if req.method == 'GET':
        post = PostRecruitSeminar.objects.get(pk=index)
        return render(req, 'edit.html', {'post': post})
    elif req.method == 'POST':
        post = PostRecruitSeminar.objects.get(pk=index)
        post.writer = req.user
        post.title = req.POST['title']
        post.content = req.POST['content']
        post.save()
        return redirect(f'/posts/{index}')
