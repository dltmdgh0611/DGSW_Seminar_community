import uuid as UUID

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect

from seminar.models.post import Comment
from seminar.models.post.link import Link


@login_required
def create(req, uuid):
    if req.method == 'POST':
        link = Link()
        link.uuid = UUID.uuid4()
        link.writer = req.user
        link.namespace = Comment.__name__
        ref_link = get_object_or_404(Link, pk=uuid)
        content = req.POST.get('content')
        if content:
            comment = Comment(link=link, ref_link=ref_link, comment_writer=req.user, comment_content=content)
            comment.save()
        if 'HTTP_REFERER' in req.META:
            return redirect(req.META['HTTP_REFERER'])
        return redirect('/')
