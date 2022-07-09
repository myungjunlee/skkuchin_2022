from rest_framework import serializers
from .models import Info

class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Info
        fields = (
            'id',
            'user',
            'title',
            'name',
            'major',
            'student_id',
            'mbti',
	    'image',
            'date',
            'place',
            'content',
            'uid',
            'option',
            'category',
            'create_date'
        )
