from django.shortcuts import render

from seminar.models import PostRecruitSeminar


def main(req):
    return render(req, 'main.html')