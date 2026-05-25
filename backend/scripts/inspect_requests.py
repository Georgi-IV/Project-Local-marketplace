import os, django, json
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from accounts.models import ServiceRequest
qs = list(ServiceRequest.objects.order_by('-id').values('id','title','post_type','creator_name')[:20])
print(json.dumps(qs, default=str))
