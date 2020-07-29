import graphene
from seminar.models.manage_seminar import Calendar
from uuid import uuid4

class CreateCalendar(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        startplan = graphene.String(required=True)
        endplan = graphene.String(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, title, startplan, endplan):
        cal = Calendar(
            Plantitle=title,
            PlanStart=startplan,
            PlanEnd=endplan,
            plan_id=uuid4()
        )
        cal.save()
        return CreateCalendar(ok=True)


class DeleteCalendar(graphene.Mutation):
    class Arguments:
        plan_id = graphene.UUID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, plan_id):
        Calendar.objects.get(plan_id=plan_id).delete()
        return DeleteCalendar(ok=True)


class CalendarMutations(graphene.ObjectType):
    create_calendar = CreateCalendar.Field()
    delete_calendar = DeleteCalendar.Field()


