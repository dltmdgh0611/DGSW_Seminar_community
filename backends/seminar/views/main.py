from django.shortcuts import render

from ..models.category import PostOfFreeSeminar


def main(req):
    return render(req, 'main.html', {'post': PostOfFreeSeminar.objects.all()})
