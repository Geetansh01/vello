import datetime
from django.utils.timezone import now
from django.core.exceptions import ObjectDoesNotExist

class SessionActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, 'user', None)

        if user and user.is_authenticated:
            current_time = now()
            last_seen = request.session.get('last_seen')

            if last_seen:
                last_seen_time = datetime.datetime.fromisoformat(last_seen)
                elapsed = current_time - last_seen_time

                if elapsed.total_seconds() < 3600:
                    try:
                        profile = user.userprofile
                        profile.active_time += elapsed
                        profile.save()
                    except ObjectDoesNotExist:
                        pass  # 🛑 Prevents errors during signup or broken profile state

            request.session['last_seen'] = current_time.isoformat()

        return self.get_response(request)
