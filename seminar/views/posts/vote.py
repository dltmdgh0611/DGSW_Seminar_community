from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, get_object_or_404

from seminar.models.category.post_of_recruit_seminar import PostOfRecruitSeminar
from seminar.models.post.recommend import Recommend


@login_required
def vote(req, index: int):
    post = get_object_or_404(PostOfRecruitSeminar, id=index)
    rcm = Recommend.objects.filter(post=post, user=req.user)
    print(rcm)
    if len(rcm) > 0:
        rcm.delete()
    else:
        Recommend(post=post, user=req.user).save()

    post.update_vote_count()
    post.save()

    return redirect('posts.select', index)
