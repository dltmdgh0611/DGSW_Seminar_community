from django.urls import path

from .views import *
from .views import category, posts
from seminar.views.manage_seminar.manage import manage
from .views.manage_seminar.check_in import check_in
from .views.posts import comments

urlpatterns = [
    path('', main, name='main'),
    path('manage/', manage, name='manage'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('register/', register, name='register'),

    path('request_seminar/', category.request_seminar, name='category.request_seminar'),
    path('recruit_seminar/', category.recruit_seminar, name='category.recruit_seminar'),
    path('recruit_seminar/check_in/<int:index>', check_in, name='category.recruit_seminar.check_in'),
    path('free_seminar/', category.free, name='category.free_seminar'),
    path('search/', category.search, name='category.search'),
    path('posts/create', posts.create, name='posts.create'),
    path('posts/<str:category>/<int:index>', posts.select, name='posts.select'),
    # path('posts/<int:index>/votes', posts.recommend, name='posts.recommend'),
    path('posts/<str:category>/<int:index>/edit', posts.edit, name='posts.edit'),
    path('posts/<uuid:uuid>/comments', posts.comments.create, name='posts.comments.create'),
    path('comment/<int:index>', posts.comments.select, name='posts.comments.select'),
    path('posts/<uuid:uuid>/recommend', posts.recommend, name="posts.recommend"),

]
