import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from backend_setting.models import Member
from seminar.models import PostOfRequestSeminar, PostOfRecruitSeminar, PostOfFreeSeminar, Link


class MemberSchema(DjangoObjectType):
    class Meta:
        model = Member


class LinkSchema(DjangoObjectType):
    class Meta:
        model = Link


class Tag(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()

    class Meta:
        pass

class voteCount(graphene.ObjectType):
    count = graphene.Int()

    class Meta:
        pass


class PostOfRequestSeminarSchema(DjangoObjectType):
    get_tags = graphene.List(Tag)

    class Meta:
        model = PostOfRequestSeminar


class PostOfRecruitSeminarSchema(DjangoObjectType):
    get_tags = graphene.List(Tag)
    class Meta:
        model = PostOfRecruitSeminar


class PostOfFreeSeminarSchema(DjangoObjectType):
    class Meta:
        model = PostOfFreeSeminar


class PostQuery(graphene.ObjectType):
    posts_of_free_seminar = graphene.List(PostOfFreeSeminarSchema)
    posts_of_request_seminar = graphene.List(PostOfRequestSeminarSchema)
    posts_of_recruit_seminar = graphene.List(PostOfRecruitSeminarSchema)
    links = graphene.List(LinkSchema, uuid=graphene.UUID())
    members = graphene.List(MemberSchema)

    def resolve_posts_of_free_seminar(self, info):
        return PostOfFreeSeminar.objects.all()

    def resolve_posts_of_request_seminar(self, info):
        return PostOfRequestSeminar.objects.all()

    def resolve_posts_of_recruit_seminar(self, info):
        return PostOfRecruitSeminar.objects.all()

    def resolve_links(self, info, **kwargs):
        uuid = kwargs['uuid']
        return Link.objects.filter(uuid=uuid)

    def resolve_members(self, info):
        return Member.objects.all()
