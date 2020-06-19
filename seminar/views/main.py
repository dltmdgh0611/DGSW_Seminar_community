from django.shortcuts import render

from ..models import Post


def main(req):
    context = {'posts': Post.objects.all()}
    return render(req, 'main.html', context)
