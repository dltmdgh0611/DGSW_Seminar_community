import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from seminar.models.manage_seminar import Calendar

class CalendarSchema(DjangoObjectType):
    class Meta:
        model = Calendar

class CalendarQuery(graphene.ObjectType):
    cal = graphene.List(CalendarSchema)

    def resolve_cal(self, info):
        return Calendar.objects.all()