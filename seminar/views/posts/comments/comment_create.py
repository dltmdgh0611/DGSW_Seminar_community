from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect

from seminar.models import Post, Comment


@login_required
def create(req, index):
    if req.method == 'POST':
        post = get_object_or_404(Post, pk=index)
        content = req.POST.get('content')
        if not content:
            return redirect(f'/posts/{index}')

        comment = Comment(post=post, comment_writer=req.user, comment_content=content)
        comment.save()
        return redirect(f'/posts/{index}')
