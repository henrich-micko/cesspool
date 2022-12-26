
# load citys data from file <CITY-NAME> <DISTRICT>

def load_from_file(file_path: str):
    with open(file_path, "r") as f:
        lines = f.read().split("\n")
        locations = [l.split("/") for l in lines]
        
    return locations