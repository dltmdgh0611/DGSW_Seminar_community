import graphene
from graphene_django import DjangoObjectType
from .models.category import post_of_free_seminar, post_of_request_seminar, post_of_recruit_seminar


class PostOfFreeSeminar(DjangoObjectType):
    class Meta:
        model = post_of_free_seminar.PostOfFreeSeminar


class PostOfRequestSeminar(DjangoObjectType):
    class Meta:
        model = post_of_request_seminar.PostOfRequestSeminar


class PostOfRecruitSeminar(DjangoObjectType):
    class Meta:
        model = post_of_recruit_seminar.PostOfRecruitSeminar


class AbstractPost(graphene.ObjectType):
    uuid = graphene.UUID()
    title = graphene.String()
    id = graphene.Int()
    namespace = graphene.String()
    createdAt = graphene.DateTime()
    tag_kind = graphene.String()
    content = graphene.String()
    writer = graphene.String()

class Query(graphene.ObjectType):
    postsOfFreeSeminar = graphene.List(PostOfFreeSeminar)
    postsOfRequestSeminar = graphene.List(PostOfRequestSeminar)
    postsOfRecruitSeminar = graphene.List(PostOfRecruitSeminar)
    search = graphene.List(AbstractPost, keyword=graphene.String())

    def resolve_search(self, info, **kwargs):
        keyword = kwargs['keyword']
        result = []
        for post in post_of_free_seminar.PostOfFreeSeminar.objects.filter(title__contains=keyword):
            result.append(AbstractPost(
                title=post.title,
                createdAt=post.created_at,
                content=post.content,
                uuid=post.link.uuid,
                namespace=post.link.namespace,
                writer=post.link.writer,
                id=post.id)
            )
        for post in post_of_request_seminar.PostOfRequestSeminar.objects.filter(title__contains=keyword):
            result.append(AbstractPost(
                title=post.title,
                createdAt=post.created_at,
                content=post.content,
                uuid=post.link.uuid,
                namespace=post.link.namespace,
                id=post.id,
                writer=post.link.writer,
                tag_kind=post.tag_kind
            ))
        for post in post_of_recruit_seminar.PostOfRecruitSeminar.objects.filter(title__contains=keyword):
            result.append(AbstractPost(
                title=post.title,
                createdAt=post.created_at,
                content=post.content,
                uuid=post.link.uuid,
                namespace=post.link.namespace,
                id=post.id,
                writer=post.link.writer,
                tag_kind=post.tag_kind
            ))
        return result

    def resolve_postsOfFreeSeminar(self, info):
        return post_of_free_seminar.PostOfFreeSeminar.objects.all()

    def resolve_postsOfRequestSeminar(self, info):
        return post_of_request_seminar.PostOfRequestSeminar.objects.all()

    def resolve_postsOfRecruitSeminar(self, info):
        return post_of_recruit_seminar.PostOfRecruitSeminar.objects.all()


schema = graphene.Schema(query=Query)
