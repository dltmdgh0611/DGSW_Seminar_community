from datetime import datetime
from uuid import uuid4

import graphene
from graphql import ResolveInfo
from graphql_jwt.decorators import login_required

from seminar.models import PostOfFreeSeminar, PostOfRequestSeminar, PostOfRecruitSeminar, Link


class CreatePost(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        tagKind = graphene.String(required=False)
        min_people_count = graphene.Int(required=False)
        max_people_count = graphene.Int(required=False)
        times_of_class = graphene.Int(required=False)
        KindOf = graphene.String(required=True)

    ok = graphene.Boolean()

    @login_required

    def mutate(self, info: ResolveInfo, title, content, KindOf, tagKind=None, min_people_count=None, max_people_count=None, times_of_class=None):
        link = Link()
        link.uuid = uuid4()
        link.writer = info.context.user
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
                min_people_count=min_people_count,
                max_people_count=max_people_count,
                times_of_class=times_of_class
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
        tagkind = graphene.String(required=False)
        min_people_count = graphene.Int(required=False)
        max_people_count = graphene.Int(required=False)
        times_of_class = graphene.Int(required=False)

    ok = graphene.Boolean()

    @login_required
    def mutate(self, info: ResolveInfo, uuid, title, content, tagkind=None, min_people_count=None, max_people_count=None, times_of_class=None):
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
        post.tag_kind = tagkind
        post.min_people_count = min_people_count
        post.max_people_count = max_people_count
        post.times_of_class = times_of_class

        post.save()

        return CreatePost(ok=True)


class DeletePost(graphene.Mutation):
    class Arguments:

        uuid = graphene.UUID()

    ok = graphene.Boolean()

    @login_required
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
