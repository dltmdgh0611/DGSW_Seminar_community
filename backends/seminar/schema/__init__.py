import graphene
from graphql_auth.schema import UserQuery, MeQuery

from .category import PostQuery
from .experimental import PostMutations
from .CommentMutation import CommentMutations
from .account import AccountMutations
from .search_of_category import SearchOfCategoryQuery


class MasterQuery(UserQuery, MeQuery, PostQuery, SearchOfCategoryQuery, graphene.ObjectType):
    pass


class MasterMutation(PostMutations, CommentMutations, AccountMutations, graphene.ObjectType):
    pass


schema = graphene.Schema(query=MasterQuery, mutation=MasterMutation)
