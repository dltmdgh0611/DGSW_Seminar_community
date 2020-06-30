from urllib.parse import urlparse, parse_qs

from django.contrib import auth
from django.shortcuts import render, redirect


def login(req):
    if req.method == "POST":
        username = req.POST['username']
        password = req.POST['password']
        user = auth.authenticate(req, username=username, password=password)
        if user is not None:
            auth.login(req, user)
            ref = req.META.get('HTTP_REFERER', None)
            if ref:
                query = parse_qs(urlparse(ref).query)
                if 'next' in query:
                    return redirect(query['next'][0])
            return redirect('main')
        else:
            return render(req, 'navigator/login.html', {'error': 'id나 비밀번호가 틀렸습니다'})
    else:
        context = {}
        if 'next' in req.GET:
            context['next'] = req.GET['next']
        return render(req, 'navigator/login.html', context)
