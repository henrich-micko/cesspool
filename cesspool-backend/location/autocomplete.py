import json


def autocomplete_district(location_file: str, value: str):
    output, value = [], value.lower()

    with open(location_file, "r") as f:
        data = json.load(f)

        for district in data.keys():
            district_ = district.lower()
            if district_.startswith(value) and district_ != value:
                output.append(district)
            elif output:
                break

        return output
    

def autocomplete_city(location_file: str, value: str, district: str = None):
    output, value = [], value.lower()

    with open(location_file, "r") as f:
        data = json.load(f)

        if district == None:
            for d in data.keys():
                for c in data[d]:
                    c_ = c.lower()
                    if c_.startswith(value) and c_ != value:
                        output.append(c)
    
        else:
            for c in data.get(district, []):
                c_ = c.lower()
                if c_.startswith(value) and c_ != value:
                    output.append(c)
    
        return output