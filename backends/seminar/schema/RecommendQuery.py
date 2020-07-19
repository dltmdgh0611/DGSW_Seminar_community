import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from seminar.models import Link
from seminar.models.post import Recommend


class RecommendSchema(DjangoObjectType):
    class Meta:
        model = Recommend


class RecommendInfo(graphene.ObjectType):
    me_too = graphene.Boolean()
    count = graphene.Int()


class RecommendQuery(graphene.ObjectType):
    recommend_info = graphene.Field(RecommendInfo, ref_link_uuid=graphene.UUID())

    @login_required
    def resolve_recommend_info(self, info, ref_link_uuid):
        link = Link.objects.get(uuid=ref_link_uuid)

        return RecommendInfo(
            count=Recommend.objects.filter(ref_link=link).count(),
            me_too=Recommend.objects.filter(ref_link=link, user=info.context.user.uuid).exists()
        )
