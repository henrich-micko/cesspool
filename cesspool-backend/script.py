from location.models import City

city = City.objects.get(title = "Tŕnie")
city.export_to_csv(1)