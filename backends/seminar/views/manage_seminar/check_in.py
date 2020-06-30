from django.shortcuts import get_object_or_404, redirect

from . import manage_seminar_required
from ...models.category import PostOfRecruitSeminar
from ...models.manage_seminar.planed_seminar import PlannedSeminar


@manage_seminar_required
def check_in(req, *args, **kwargs):
    index = kwargs['index']
    planed_seminar = PlannedSeminar()
    planed_seminar.post = get_object_or_404(PostOfRecruitSeminar, id=index)
    planed_seminar.title = req.POST['planed_seminar_name']
    planed_seminar.save()
    return redirect('manage')
