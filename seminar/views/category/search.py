from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from seminar.models.category import PostOfRequestSeminar, PostOfFreeSeminar, PostOfRecruitSeminar


@login_required
def search(req):
    if req.method == 'GET':
        posts = []
        filter_dict = analyze_raw_query(req.GET['s'])
        print(filter_dict)
        posts += filter_posts('free_seminar', PostOfFreeSeminar.objects.all(), filter_dict)
        posts += filter_posts('recruit_seminar', PostOfRecruitSeminar.objects.all(), filter_dict, contain_tags=True)
        posts += filter_posts('request_seminar', PostOfRequestSeminar.objects.all(), filter_dict, contain_tags=True)

        context = {'posts': posts}
        return render(req, 'category/search.html', context)


def analyze_raw_query(raw_query: str):
    text_query = ''
    topics = []
    mentions = []
    for word in raw_query.split():
        if word.startswith('#'):
            topics.append(word[1:])
        elif word.startswith('@'):
            mentions.append(word[1:])
        else:
            if len(text_query) > 0:
                text_query += ' '
            text_query += word
    return {'text_query': text_query, 'topics': topics, 'mentions': mentions}


def filter_posts(category: str, posts: list, filter_dict: dict, contain_tags=False):
    result = []
    for post in posts:
        if filter_dict['text_query'] in str(post.title):
            block = False
            print('contain_tags', contain_tags)
            if contain_tags:
                for tag in filter_dict['topics']:
                    if tag not in post.get_tags:
                        block = True
                        break
            elif len(filter_dict['topics']) > 0:
                block = True
            if not block:
                print(str(post.link.writer.username))
                print(''.join(filter_dict['mentions']))
                if ''.join(filter_dict['mentions']) == str(post.link.writer.username):
                    print(str(post.link.writer.username)+"c")
                    result.append(
                        {'pk': post.id,
                         'title': post.title,
                         'category': category,
                         'created_at': post.created_at,
                         'writer': post.link.writer,
                         'tags': post.get_tags if contain_tags else []
                         })
    return result
