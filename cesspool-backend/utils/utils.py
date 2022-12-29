
def get_from_dict(value: dict, path: str, default: any) -> any:
    path: list = path.split("/")
    path_key: str = path.pop(0)
    
    try: path_value = path[path_key]
    except: return default 

    get_from_dict(path_value, "/".join(path), default)