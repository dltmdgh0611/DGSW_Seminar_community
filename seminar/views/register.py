import uuid

from django.shortcuts import render, redirect

from ..models import UserData, User


def register(req):
    if req.method == 'GET':
        return render(req, 'signup.html')
    elif req.method == 'POST':
        if req.POST["password"] == req.POST["cpassword"]:
            user = User.objects.create_user(
                username=req.POST["id"], password=req.POST["password"])
            user_data = UserData()
            user_data.uuid = uuid.uuid4()
            user_data.profile_url = ""
            user_data.user_id = user
            user_data.save()
            return redirect('/')
        return render(req, 'signup.html')
    return render(req, 'signup.html')
