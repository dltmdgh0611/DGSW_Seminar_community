import graphene
from graphql_jwt.decorators import login_required

from seminar.models import Link
from seminar.models.post import Recommend


class ToggleRecommend(graphene.Mutation):
    class Arguments:
        link_id = graphene.UUID(required=True)

    ok = graphene.Boolean()

    @login_required
    def mutate(self, info, link_id):
        link = Link(uuid=link_id)
        user = info.context.user
        rec = Recommend.objects.filter(ref_link=link, user=user)
        if rec.exists():
            rec.delete()
            ok = not Recommend.objects.filter(ref_link=link, user=user).exists()
        else:
            Recommend(
                ref_link=link,
                user=user
            ).save()
            ok = Recommend.objects.filter(ref_link=link, user=user).exists()
        return ToggleRecommend(ok=ok)


class RecommendMutations(graphene.ObjectType):
    toggle_recommend = ToggleRecommend.Field()
