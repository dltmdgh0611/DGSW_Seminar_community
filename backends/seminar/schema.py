import graphene
from graphene_django import DjangoObjectType

from .models.category import post_of_free_seminar


class PostOfFreeSeminar(DjangoObjectType):
    class Meta:
        model = post_of_free_seminar.PostOfFreeSeminar


class Query(graphene.ObjectType):
    posts = graphene.List(PostOfFreeSeminar)

    def resolve_posts(self, info):
        return post_of_free_seminar.PostOfFreeSeminar.objects.all()


schema = graphene.Schema(query=Query)
