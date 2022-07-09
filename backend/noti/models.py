from django.db import models
from django.utils import timezone

def upload_to(instance, filename):
    return 'noti/%s/%s' % (instance.title, filename)

# Create your models here.
class Noti(models.Model):
   title = models.CharField(max_length=255)
   image = models.ImageField(upload_to = upload_to, blank = True, null = True)
   content = models.TextField()
   category = models.CharField(max_length=255)
   create_date = models.DateTimeField(default=timezone.now)
   
   def __str__(self):
      return self.title