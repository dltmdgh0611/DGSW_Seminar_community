import graphene
from graphene_django import DjangoObjectType

from seminar.models.post import Recommend
from seminar.models import Link

class RecommendSchema(DjangoObjectType):
    class Meta:
        model = Recommend


class RecommendQuery(graphene.ObjectType):

    recommend = graphene.List(RecommendSchema, ref_link_uuid=graphene.UUID())

    def resolve_recommend(self, info, **kwargs):
        ref_link_uuid = kwargs['ref_link_uuid']
        link = Link.objects.get(uuid=ref_link_uuid)
        return Recommend.objects.filter(ref_link=link)
