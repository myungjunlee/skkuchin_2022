from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('username', 'uid', 'email', 'name', 'major', 'student_id', 'mbti', 'image', 'agreement', 'verification', 'password')
