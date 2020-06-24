import uuid as UUID

from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, get_object_or_404

from seminar.models.post.link import Link
from seminar.models.post.recommend import Recommend


@login_required
def recommend(req, uuid):
    if req.method == 'GET':
        ref_link = get_object_or_404(Link, pk=uuid)
        rcm = Recommend.objects.filter(ref_link=ref_link, user=req.user)
        if len(rcm) == 0:
            rcm = Recommend(ref_link=ref_link, user=req.user)
            rcm.save()
        else:
            rcm.delete()

        if 'HTTP_REFERER' in req.META:
            return redirect(req.META['HTTP_REFERER'])
        return redirect('/')
