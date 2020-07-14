"""backend_setting URL Configuration

The `urlpatterns` list routes URLs to (deprecated)views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function (deprecated)views
    1. Add an import:  from my_app import (deprecated)views
    2. Add a URL to urlpatterns:  path('', (deprecated)views.home, name='home')
Class-based (deprecated)views
    1. Add an import:  from other_app.(deprecated)views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api', csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=True)))),
]
