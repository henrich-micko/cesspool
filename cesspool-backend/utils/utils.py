"""

Functions that can be used anywhere
For easier experince while writing this app
U can stole it if u want, i wont be mad
Why i use types here? idk

"""


def get_value_by_path(data: dict, path: str, default: any) -> any:
    splited_path: list = path.split("/")
    key: str = splited_path.pop(0)
    left_path: str = "/".join(splited_path)

    if not key in data.keys(): 
        return default

    value: any = data[key]
    
    if not left_path: return value
    if type(value) != dict: return default

    return get_value_by_path(data = value, path = left_path, default = default)


def try_parse_get_param(request: any, name: str, parse_with: any = int, not_found_default: any = None, invalid_default: any = None) -> any:
    value = request.GET.get(name, default = None)
    if value == None: return not_found_default
    
    try: return parse_with(value)
    except ValueError: return invalid_default


def get_user_model():
    from django.conf import settings
    from django.apps import apps

    return apps.get_model(settings.AUTH_USER_MODEL)


def generate_code(lenght, invalid = []):
    from random import choice, randint
    from string import ascii_letters

    while True:
        output = ""
        for i in range(lenght):
            new_char = choice(ascii_letters)
            if randint(0, 1):
                new_char = new_char.upper()
            output += new_char
        if output not in invalid:
            break
    return output


def is_history(datetime): # i named it this way because i can :)
    from django.utils import timezone
    return timezone.now() > datetime


def get_default_datetime_timedelta(*args, **kwargs):
    from django.utils import timezone
    def func():
        return timezone.now() + timezone.timedelta(*args, **kwargs)
    return func