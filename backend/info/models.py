from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinLengthValidator

# Create your models here.
class Info(models.Model):
   user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
   title = models.CharField(max_length=255)
   name = models.CharField(max_length=255)
   major = models.CharField(max_length=255)
   student_id = models.CharField(max_length=10, validators=[MinLengthValidator(10)])
   mbti = models.CharField(max_length=10, blank = True, null = True)
   image = models.CharField(max_length=255, blank = True, null = True)
   date = models.CharField(max_length=255)
   place = models.CharField(max_length=255)
   content = models.TextField()
   uid = models.CharField(max_length=255)
   option = models.BooleanField()
   category = models.CharField(max_length=255, default = '')
   create_date = models.DateTimeField(default=timezone.now)
   
   def __str__(self):
      return self.title
