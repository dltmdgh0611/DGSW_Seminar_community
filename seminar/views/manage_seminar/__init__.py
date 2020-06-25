from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied


def manage_seminar_required(func):
    @login_required
    def foo(req, *arg, **kwargs):
        if req.user.groups.filter(name='manage_seminar').exists():
            return func(req, *arg, **kwargs)
        else:
            raise PermissionDenied

    return foo
