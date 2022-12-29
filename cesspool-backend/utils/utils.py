
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