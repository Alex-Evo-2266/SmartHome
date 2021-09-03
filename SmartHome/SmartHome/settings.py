"""
Django settings for SmartHome project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from pathlib import Path
import os, sys

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'wse5dr6ft7yg8plivkuytrrestrytfygui'

SECRET_JWT_KEY = "dxkhbg5hth56"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []
# ALLOWED_HOSTS = ["localhost",'127.0.0.1']

# Application definition

INSTALLED_APPS = [
    'django_cleanup',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_yasg',
    'files',
    'channels',
    'smartHomeApi',
    'client',
    # 'ckeditor',
    # 'ckeditor-uploader'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'SmartHome.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'SmartHome.wsgi.application'


# docker values
# REDIS_HOST = os.environ.get("SMARTHOME_REDIS_HOST")
# REDIS_PORT = os.environ.get("SMARTHOME_REDIS_PORT")
#
# BD_HOST = os.environ.get("SMARTHOME_BD_HOST")
# BD_PORT = os.environ.get("SMARTHOME_BD_PORT")
# BD_NAME = os.environ.get("SMARTHOME_BD_NAME")
# BD_USER = os.environ.get("SMARTHOME_BD_USER")
# BD_PASSWORD = os.environ.get("SMARTHOME_BD_PASSWORD")
#
# SMART_HOME_HOST = os.environ.get("SMARTHOME_SOCKET_HOST")
# SMART_HOME_PORT = os.environ.get("SMARTHOME_SOCKET_PORT")

#dev no docker
REDIS_HOST = '0.0.0.0'
REDIS_PORT = 6379

BD_HOST = 'localhost'
BD_PORT = '3306'
BD_NAME = 'djangoSmartHome'
BD_USER = 'roothome'
BD_PASSWORD = 'root'

SMART_HOME_HOST = 'localhost'
SMART_HOME_PORT = '5000'

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': BD_NAME,
        'USER': BD_USER,
        'PASSWORD': BD_PASSWORD,
        'HOST': BD_HOST,
        'PORT': BD_PORT,
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = True


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

# LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "client","templates","client","build","static"),
]

SERVER_CONFIG = os.path.join(BASE_DIR, "config","server-config.yml")
SCRIPTS_DIR = os.path.join(BASE_DIR, "config","scripts")
STYLES_DIR = os.path.join(BASE_DIR, "config","styles")

TIME_UPPDATA = 6

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


ASGI_APPLICATION = 'SmartHome.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(REDIS_HOST, REDIS_PORT)],
        },
    },
}

# CHANNEL_LAYERS = {
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [('redis', REDIS_PORT)],
#         },
#     },
# }

# CELERY_BROKER_URL = 'redis://' + REDIS_HOST + ':' + str(REDIS_PORT)
# CELERY_BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 3600}
# CELERY_RESULT_BACKEND = 'redis://' + REDIS_HOST + ':' + str(REDIS_PORT)
# CELERY_ACCEPT_CONTENT = ['application/json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'

# CELERY_BROKER_URL = 'redis://redis:6379'
# CELERY_BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 3600}
# CELERY_RESULT_BACKEND = 'redis://redis:6379'
# CELERY_ACCEPT_CONTENT = ['application/json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'

# STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
