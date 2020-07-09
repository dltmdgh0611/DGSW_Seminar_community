import graphene
from graphql_auth.schema import UserQuery, MeQuery

from .category import PostQuery
from .experimental import PostMutations, AuthMutation
from .account import Account_Mutations
from .search_of_category import SearchOfCategoryQuery


class MasterQuery(UserQuery, MeQuery, PostQuery, SearchOfCategoryQuery, graphene.ObjectType):
    pass


class MasterMutation(PostMutations, Account_Mutations, AuthMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=MasterQuery, mutation=MasterMutation)
