from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from seminar.models.category import PostOfRequestSeminar, PostOfFreeSeminar, PostOfRecruitSeminar
from seminar.models.post.link import Link


@login_required
def search(req):
    if req.method == 'POST':
        posts = []
        for link in Link.objects.all():
            if link.namespace == 'PostOfRequestSeminar':
                post = PostOfRequestSeminar.objects.get(link=link)
                if req.POST['word'] in post.title:
                    posts.append({'pk': post.id, 'title': post.title, 'category': 'request_seminar'})
            elif link.namespace == 'PostOfRecruitSeminar':
                post = PostOfRecruitSeminar.objects.get(link=link)
                if req.POST['word'] in post.title:
                    posts.append({'pk': post.id, 'title': post.title, 'category': 'recruit_seminar'})
            elif link.namespace == 'PostOfFreeSeminar':
                post = PostOfFreeSeminar.objects.get(link=link)
                if req.POST['word'] in post.title:
                    posts.append({'pk': post.id, 'title': post.title, 'category': 'free_seminar'})

        context = {'posts': posts}
        return render(req, 'category/search.html', context)
