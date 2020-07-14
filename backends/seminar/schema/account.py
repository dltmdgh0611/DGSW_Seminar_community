from uuid import uuid4

import graphene
from graphql_auth import mutations
from graphql_auth.utils import normalize_fields
from graphql_auth.settings import graphql_auth_settings

from backend_setting.models import Member


class AccountMutations(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
