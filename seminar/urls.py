from django.urls import path

from .views import *
from .views import posts
from .views.posts import comments

urlpatterns = [
    path('', main, name='main'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('register/', register, name='register'),

    path('req/', posts.req, name='posts.req'),
    path('rec/', posts.rec, name='posts.rec'),
    path('posts/create', posts.create, name='posts.create'),
    path('posts/<int:index>', posts.select, name='posts.select'),
    # path('posts/<int:index>/votes', posts.vote, name='posts.vote'),
    path('posts/<int:index>/edit', posts.edit, name='posts.edit'),
    path('posts/<int:index>/comments', posts.comments.create, name='posts.comments.create'),
    path('posts/<int:index>/vote', posts.vote, name="posts.vote"),

    path('comment/<int:index>', posts.comments.select, name='posts.comments.select'),

]
