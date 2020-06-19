from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, get_object_or_404

from seminar.models import Post, Recommend


@login_required
def vote(req, index: int):
    post = get_object_or_404(Post, id=index)
    rcm = Recommend.objects.filter(post=post, user=req.user)
    print(rcm)
    if len(rcm) > 0:
        rcm.delete()
    else:
        Recommend(post=post, user=req.user).save()

    post.update_vote_count()
    post.save()

    return redirect('posts.select', index)
