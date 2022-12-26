from location.parser import load_from_file


def autocomplete_city(location_file: str, value: str):
    output, value = [], value.lower()
    with open(location_file, "r") as f:
        while True:
            line = f.readline().strip()
            if not line: break
            district, city = line.split("/")

            if not city.lower().startswith(value):
                if output and city[0] != value[0]:
                    break
                continue

            output.append(city)
    
    return output

def autocomplete_district(location_file: str, value: str):
    output, value = [], value.lower()
    with open(location_file, "r") as f:
        while True:
            line = f.readline().strip()
            if not line: break
            district, city = line.split("/")

            if not district.lower().startswith(value):
                continue

            if not district in output:
                output.append(district)
    
    return output