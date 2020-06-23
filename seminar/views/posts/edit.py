from django.shortcuts import render, redirect

from seminar.models.category.post_of_recruit_seminar import PostOfRecruitSeminar


def edit(req, index):
    if req.method == 'GET':
        post = PostOfRecruitSeminar.objects.get(pk=index)
        return render(req, 'post/edit.html', {'post': post})
    elif req.method == 'POST':
        post = PostOfRecruitSeminar.objects.get(pk=index)
        post.writer = req.user
        post.title = req.POST['title']
        post.content = req.POST['content']
        post.save()
        return redirect(f'post/{index}')
