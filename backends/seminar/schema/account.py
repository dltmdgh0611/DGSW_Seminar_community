import graphene
from seminar.models.member import Member, User
from uuid import uuid4


class Create_Account(graphene.Mutation):
    class Arguments:
        email = graphene.String()
        password = graphene.String()
        name = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, email, password, name):
        user = User(
            password=password,
            email=email,
            username=name
        )
        user.save()

        member = Member(
            uuid=uuid4(),
            profile_url="/",
            user_id=user
        )

        member.save()
        print(user)
        return Create_Account(ok=True)




class Account_Mutations(graphene.ObjectType):
    create_account = Create_Account.Field()