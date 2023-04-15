"""
Django settings for cesspool_backend project.

Generated by 'django-admin startproject' using Django 4.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from datetime import timedelta
from pathlib import Path
from os import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = environ.get("DJANGO_SECRET_KEY", "r(o0ju*h30c2l=6=510=(@55u2-wqxsz#dp%=2*q%)pc&tb&(x")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(int(environ.get("DJANGO_DEBUG", "1"), 0))
ALLOWED_HOSTS = environ.get('DJANGO_ALLOWED_HOSTS', "*").split(' ')

# host for fronted (email links)
if "*" in ALLOWED_HOSTS:
    WEBSITE = REACT_HOST = "127.0.0.1"
else:
    WEBSITE = REACT_HOST = ALLOWED_HOSTS[0]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',

    'corsheaders',
    'django_celery_beat',

    'account.apps.AccountConfig',
    'cesspool.apps.CesspoolConfig',
    'location.apps.LocationConfig',
    'utils.apps.UtilsConfig',
    'subscription.apps.SubscriptionConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    "django.middleware.locale.LocaleMiddleware"
]

ROOT_URLCONF = 'cesspool_backend.urls'

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

WSGI_APPLICATION = 'cesspool_backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': environ.get('DB_NAME', "name"),
#         'USER': environ.get('DB_USER', "user"),
#         'PASSWORD': environ.get('DB_PASSWORD', "password"),
#         'HOST': environ.get('DB_HOST', "host"),
#         "PORT": environ.get("DB_PORT", "port")
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3', 
    }
}

if int(environ.get("CUSTOM_DB", "0"), 0):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': environ.get('DB_NAME'),
            'USER': environ.get('DB_USER'),
            'PASSWORD': environ.get('DB_PASSWORD'),
            'HOST': environ.get('DB_HOST'),
            "PORT": environ.get("DB_PORT")
        }
    }

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'sk'

TIME_ZONE = 'Europe/Bratislava'

USE_I18N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/api/static/'
STATIC_ROOT = "/vol/web/static"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = "account.UserAccount"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ]
}


CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True

DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000

# models with delete_at field

CHECK_DELETE_MODELS = [
    "location.city",
]

# settings for mqtt

USE_MQTT = not DEBUG and bool(int(environ.get("IS_MAIN", "0"), 0))
MQTT_HOST = environ.get("DJANGO_MQTT_HOST", None)
MQTT_USERNAME = environ.get("DJANGO_MQTT_USERNAME", None)
MQTT_PASSWORD = environ.get("DJANGO_MQTT_PASS", None)
MQTT_TOPIC = "#"

if environ.get("DJANGO_MQTT_PORT", False):
    MQTT_PORT = int(environ.get("DJANGO_MQTT_PORT", 1234))
else: 
    MQTT_PORT = None
    
if USE_MQTT and None in [MQTT_HOST, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD]:
    raise ValueError(f"""
        USE_MQTT is True but some env var are missing
        
        DJANGO_MQTT_HOST={MQTT_HOST}
        DJANGO_MQTT_PORT={MQTT_PORT}
        DJANGO_MQTT_USERNAME={MQTT_USERNAME}
        DJANGO_MQTT_PASS={MQTT_PASSWORD}
    """)

# settings for celery
CELERY_TIMEZONE = TIME_ZONE
DJANGO_CELERY_BEAT_TZ_AWARE = False

CELERY_BROKER_URL = "redis://localhost:6379"
CELERY_RESULT_BACKEND = "redis://localhost:6379"
CELERYBEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

CELERY_BEAT_SCHEDULE = {
    "delete": {
        "task": "utils.tasks.check_delete_models",
        "schedule": timedelta(minutes = 1),
    }
}

# email settings
USE_EMAIL = not DEBUG
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = "587"
EMAIL_HOST_USER = environ.get("DJANGO_EMAIL_HOST_USER", "zumpomer.app@gmail.com")
EMAIL_HOST_PASSWORD = environ.get("DJANGO_EMAIL_HOST_PASS", "wiedzpyzdjfwzxtz")
EMAIL_USE_TLS = True

if USE_EMAIL and EMAIL_HOST_USER == None or EMAIL_HOST_PASSWORD == None:
    raise ValueError(f"""
        USE_EMAIL is True but some env var are missing

        DJANGO_EMAIL_HOST_USER={EMAIL_HOST_USER}
        DJANGO_EMAIL_HOST_PASS={EMAIL_HOST_PASSWORD}
    """)

# for running command "account.setup_groups"
USER_GROUPS = {
    "client": [
        "cesspool.related_to_cesspool",
    ],

    "admin": [
        "cesspool.manage_cesspool",
        "account.manage_account",
        "location.manage_city",
    ],

    "city_admin": [
        "location.export_data",
        "location.be_city_admin",
    ],
}

LOCATION_FILE = "location/data/SK.json"