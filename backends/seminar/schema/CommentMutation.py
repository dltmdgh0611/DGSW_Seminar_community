from datetime import datetime
from uuid import uuid4

import graphene
from graphql_jwt.decorators import login_required

from seminar.models import Comment
from seminar.models import Link


class CreateComment(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)
        link_id = graphene.UUID(required=True)

    ok = graphene.Boolean()

    @login_required
    def mutate(self, info, content, link_id):
        link = Link(uuid=link_id)
        user = info.context.user
        comment = Comment(
            ref_link=link,
            comment_date=datetime.now(),
            comment_writer=user,
            uuid=uuid4(),
            comment_content=content
        )
        comment.save()
        return CreateComment(ok=True)


class DeleteComment(graphene.Mutation):
    class Arguments:
        uuid = graphene.UUID()

    ok = graphene.Boolean()

    @login_required
    def mutate(self, info, uuid):
        comment = Comment.objects.get(uuid=uuid)
        if info.context.user.id == comment.comment_writer.id:
            ok = False
        else:
            Comment.objects.get(uuid=uuid).delete()
            ok = len(Comment.objects.filter(uuid=uuid)) == 0
        return DeleteComment(ok=ok)


class CommentMutations(graphene.ObjectType):
    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()
