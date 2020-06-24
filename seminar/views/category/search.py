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
                    posts.append(
                        {'pk': post.id, 'title': post.title, 'category': 'request_seminar', 'tags': post.get_tags, 'created_at':post.created_at})
                elif '#' in req.POST['word']:
                    str1 = req.POST['word']
                    str1 = str1.replace("#", "")
                    print(str1 + "1")
                    if str1 in post.tag_kind:
                        print("1")
                        posts.append(
                            {'pk': post.id, 'title': post.title, 'category': 'request_seminar', 'tags': post.get_tags, 'created_at':post.created_at})
            elif link.namespace == 'PostOfRecruitSeminar':
                post = PostOfRecruitSeminar.objects.get(link=link)
                if req.POST['word'] in post.title:
                    posts.append(
                        {'pk': post.id, 'title': post.title, 'category': 'recruit_seminar', 'tags': post.get_tags, 'created_at':post.created_at})
                elif '#' in req.POST['word']:
                    str2 = req.POST['word']
                    str2 = str2.replace("#", "")
                    print(str2 + "2")
                    if str2 in post.tag_kind:
                        print("2")
                        posts.append(
                            {'pk': post.id, 'title': post.title, 'category': 'recruit_seminar', 'tags': post.get_tags, 'created_at':post.created_at})
            elif link.namespace == 'PostOfFreeSeminar':
                post = PostOfFreeSeminar.objects.get(link=link)
                if req.POST['word'] in post.title:
                    posts.append({'pk': post.id, 'title': post.title, 'category': 'free_seminar', 'created_at':post.created_at})

        context = {'posts': posts}
        return render(req, 'category/search.html', context)
