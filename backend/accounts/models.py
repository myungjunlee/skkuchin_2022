from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import MinLengthValidator

def upload_to(instance, filename):
    return 'images/%s/%s' % (instance.username, filename)

def auth_upload_to(instance, filename):
    return 'docs/%s/%s' % (instance.username, filename)

class UserAccountManager(BaseUserManager):
    def create_superuser(self, username, uid, email, name, major, student_id, mbti, image, agreement, verification, password, **other_fields):
        
        other_fields.setdefault('is_active', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_staff', True)
        
        if other_fields.get('is_active') is not True:
            raise ValueError(
                'Superuser must be assigned to is_active=True.')

        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')

        return self.create_user(username, uid, email, name, major, student_id, mbti, image, agreement, verification, password, **other_fields)

    def create_user(self, username, uid, email, name, major, student_id, mbti, image, agreement, verification, password=None, **other_fields):
        if email:
            email = self.normalize_email(email)
            email_name, domain_part = email.rsplit('@', 1)
            if (domain_part != 'g.skku.edu'):
                raise ValueError('Domain must be g.skku.edu')

        else:
            email = None

        user = self.model(username=username, uid=uid, email=email, name=name,  major=major, student_id=student_id, mbti=mbti, image=image, agreement=agreement, verification=verification,  **other_fields)
        user.set_password(password)
        user.save()

        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    uid = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, blank = True, null = True, unique=True)
    name = models.CharField(max_length=255)
    major = models.CharField(max_length=255)
    student_id = models.CharField(max_length=10, validators=[MinLengthValidator(10)], unique=True)
    mbti = models.CharField(max_length=10, blank = True, null = True)
    image = models.ImageField(upload_to = upload_to, blank = True, null = True)
    agreement = models.BooleanField(default=False)
    verification = models.ImageField(upload_to = auth_upload_to, blank = True, null = True)
    start_date = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    
    objects = UserAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['uid', 'email', 'name', 'major', 'student_id', 'mbti', 'image', 'agreement', 'verification']

    def get_full_name(self):
        return self.name
    
    def get_short_name(self):
        return self.name
    
    def __str__(self):
        return self.username
