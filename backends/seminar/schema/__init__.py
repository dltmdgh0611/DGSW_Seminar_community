import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_jwt import Refresh

from .category import PostQuery
from .comment import CommentQuery
from .experimental import PostMutations
from .CommentMutation import CommentMutations
from .account import AccountMutations
from .search_of_category import SearchOfCategoryQuery


class MasterQuery(UserQuery, MeQuery, PostQuery, SearchOfCategoryQuery, CommentQuery, graphene.ObjectType):
    pass


class MasterMutation(PostMutations, CommentMutations, AccountMutations, Refresh, graphene.ObjectType):
    pass


schema = graphene.Schema(query=MasterQuery, mutation=MasterMutation)
