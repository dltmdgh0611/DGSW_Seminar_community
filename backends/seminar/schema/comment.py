import graphene
from graphene_django import DjangoObjectType

from seminar.models import Comment, Link

class CommentSchema(DjangoObjectType):
    class Meta:
        model = Comment


class CommentQuery(graphene.ObjectType):

    comment = graphene.List(CommentSchema, ref_link_uuid = graphene.UUID())

    def resolve_comment(self, info, **kwargs):
        ref_link_uuid = kwargs['ref_link_uuid']
        link = Link.objects.get(uuid=ref_link_uuid)
        return Comment.objects.filter(ref_link=link)

        # link = Link.objects.get(uuid=ref_link)
        #
        # return Comment.objects.filter(ref_link=link)
