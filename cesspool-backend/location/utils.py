def split_location(location):
    if location == None:
        return None, None
    splited_location = location.split("/")
    if len(splited_location) != 2: 
        return None, None    
    return splited_location