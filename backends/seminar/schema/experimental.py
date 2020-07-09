from datetime import datetime
from uuid import uuid4

import graphene
from graphql import ResolveInfo
from graphql_auth import mutations

from seminar.models import PostOfFreeSeminar, PostOfRequestSeminar, PostOfRecruitSeminar, Link
from seminar.models.member import Member


class CreatePost(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        tagKind = graphene.String(required=False)
        KindOf = graphene.String(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(self, info: ResolveInfo, title, content, tagKind, KindOf):
        link = Link()
        link.uuid = uuid4()
        link.writer = Member.objects.get(uuid="ae06c00923534109889b3f42f859d120")
        post = None
        if KindOf == "PostOfFreeSeminar":
            post = PostOfFreeSeminar(
                link=link,
                title=title,
                content=content
            )
        elif KindOf == "PostOfRequestSeminar":
            post = PostOfRequestSeminar(
                link=link,
                title=title,
                content=content,
                tag_kind=tagKind
            )
        elif KindOf == "PostOfRecruitSeminar":
            post = PostOfRecruitSeminar(
                link=link,
                title=title,
                content=content,
                tag_kind=tagKind,
                min_people_count=0,
                max_people_count=0,
                times_of_class=0
            )

        link.namespace = post.__class__.__name__
        link.save()
        post.save()
        return CreatePost(ok=True)


class UpdatePost(graphene.Mutation):
    class Arguments:
        uuid = graphene.UUID()
        title = graphene.String(required=True)
        content = graphene.String(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(self, info: ResolveInfo, uuid, title, content):
        link = Link.objects.get(uuid=uuid)
        post = None
        if link.namespace == "PostOfFreeSeminar":
            post = PostOfFreeSeminar.objects.get(link_id=uuid)
        elif link.namespace == "PostOfRequestSeminar":
            post = PostOfRequestSeminar.objects.get(link_id=uuid)
        elif link.namespace == "PostOfRecruitSeminar":
            post = PostOfRecruitSeminar.objects.get(link_id=uuid)

        print(post)
        post.title = title
        post.content = content
        post.edited_at = datetime.now()

        post.save()

        return CreatePost(ok=True)


class DeletePost(graphene.Mutation):
    class Arguments:
        uuid = graphene.UUID()

    ok = graphene.Boolean()

    @staticmethod
    def mutate(self, info, uuid):
        link = Link.objects.get(uuid=uuid)
        if link.namespace == "PostOfFreeSeminar":
            PostOfFreeSeminar.objects.get(link_id=uuid).delete()
        elif link.namespace == "PostOfRequestSeminar":
            PostOfRequestSeminar.objects.get(link_id=uuid).delete()
        elif link.namespace == "PostOfRecruitSeminar":
            PostOfRecruitSeminar.objects.get(link_id=uuid).delete()

        ok = len(PostOfFreeSeminar.objects.filter(link_id=uuid)) == 0
        return DeletePost(ok=ok)


class PostMutations(graphene.ObjectType):
    delete_post = DeletePost.Field()
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
