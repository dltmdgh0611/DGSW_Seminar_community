from django.urls import path

from .views import *
from .views import category, posts
from .views.posts import comments

urlpatterns = [
    path('', main, name='main'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('register/', register, name='register'),

    path('request_seminar/', category.request_seminar, name='category.request_seminar'),
    path('recruit_seminar/', category.recruit_seminar, name='category.recruit_seminar'),
    path('free/', category.free, name='category.free'),
    path('posts/create', posts.create, name='posts.create'),
    path('posts/<str:category>/<int:index>', posts.select, name='posts.select'),
    # path('posts/<int:index>/votes', posts.recommend, name='posts.recommend'),
    path('posts/<str:category>/<int:index>/edit', posts.edit, name='posts.edit'),
    path('posts/<uuid:uuid>/comments', posts.comments.create, name='posts.comments.create'),
    path('comment/<int:index>', posts.comments.select, name='posts.comments.select'),
    path('posts/<uuid:uuid>/recommend', posts.recommend, name="posts.recommend"),

]
