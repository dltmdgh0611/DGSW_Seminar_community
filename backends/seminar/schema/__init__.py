import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_jwt import Refresh

from .CommentMutation import CommentMutations
from .CommentQuery import CommentQuery
from .RecommendMutation import RecommendMutations
from .RecommendQuery import RecommendQuery
from .account import AccountMutations
from .category import PostQuery
from .experimental import PostMutations
from .search_of_category import SearchOfCategoryQuery


class MasterQuery(UserQuery, MeQuery, PostQuery, SearchOfCategoryQuery, CommentQuery, RecommendQuery,
                  graphene.ObjectType):
    pass


class MasterMutation(PostMutations, CommentMutations, RecommendMutations, AccountMutations, Refresh,
                     graphene.ObjectType):
    pass


schema = graphene.Schema(query=MasterQuery, mutation=MasterMutation)
