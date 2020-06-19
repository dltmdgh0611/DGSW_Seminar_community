from django.contrib import auth
from django.shortcuts import redirect


def logout(req):
    auth.logout(req)
    return redirect('main')
