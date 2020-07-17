from datetime import datetime

import graphene

from seminar.models.post import Recommend
from seminar.models import Link
from backend_setting.models import Member

class CreateRecommend(graphene.Mutation):
    class Arguments:
        link_id = graphene.UUID(required=True)
        user_id = graphene.UUID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, link_id, user_id):
        link = Link(uuid=link_id)
        user = Member(uuid=user_id)
        rec = Recommend(
            ref_link=link,
            user=user
        )
        rec.save()
        return CreateRecommend(ok=True)


class DeleteRecommend(graphene.Mutation):
    class Arguments:
        link_id = graphene.UUID(required=True)
        user_id = graphene.UUID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, link_id, user_id):
        link = Link(uuid=link_id)
        user = Member(uuid=user_id)
        Recommend.objects.get(ref_link=link, user=user).delete()

        ok = len(Recommend.objects.filter(ref_link=link, user=user)) == 0
        return DeleteRecommend(ok=ok)


class RecommendMutations(graphene.ObjectType):
    create_recommend = CreateRecommend.Field()
    delete_recommend = DeleteRecommend.Field()