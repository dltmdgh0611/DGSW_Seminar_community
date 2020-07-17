import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_jwt import Refresh

from .category import PostQuery
from .CommentQuery import CommentQuery
from .RecommendQuery import RecommendQuery
from .experimental import PostMutations
from .CommentMutation import CommentMutations
from .RecommendMutation import RecommendMutations
from .account import AccountMutations
from .search_of_category import SearchOfCategoryQuery


class MasterQuery(UserQuery, MeQuery, PostQuery, SearchOfCategoryQuery, CommentQuery, RecommendQuery, graphene.ObjectType):
    pass


class MasterMutation(PostMutations, CommentMutations, RecommendMutations, AccountMutations, Refresh, graphene.ObjectType):
    pass


schema = graphene.Schema(query=MasterQuery, mutation=MasterMutation)
