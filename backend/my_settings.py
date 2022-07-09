# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'skkuchindb',
        'USER': 'skkusil',
        'PASSWORD': 'master00!!',
        'PORT': '3306',
        'HOST': 'skkuchin-db-mysql.c8bc27u7gper.ap-northeast-2.rds.amazonaws.com',
        'OPTIONS': {
            'init_command': 'SET sql_mode="STRICT_TRANS_TABLES"',
	    'charset': 'utf8mb4',
            'use_unicode': True,
        }
    }
}

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '48u&-ryfg8rfiasz3@qbmps8s+kb(w^v@jazkain(%)60^*@qe'

EMAIL_HOST_PASSWORD = 'eopkbojixcwwuiop'
