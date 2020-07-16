from datetime import datetime
from uuid import uuid4

import graphene


from seminar.models import Comment
from seminar.models import Link
from backend_setting.models import Member

class CreateComment(graphene.Mutation):
    class Arguments:
        content = graphene.String(required=True)
        link_id = graphene.UUID(required=True)
        user_id = graphene.UUID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, content, link_id, user_id):
        link = Link(uuid=link_id)
        user = Member(uuid=user_id)
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

    def mutate(self, info, uuid):
        Comment.objects.get(uuid=uuid).delete()

        ok = len(Comment.objects.filter(uuid=uuid)) == 0
        return DeleteComment(ok=ok)


class CommentMutations(graphene.ObjectType):
    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()