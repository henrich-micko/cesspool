from django.core.management.base import BaseCommand, CommandParser
from django.db import OperationalError, connections

import time

class Command(BaseCommand):
    help = "Wait for db connection"

    def handle(self, *argv, **kwargs):
        self.stdout.write("Waiting for database...")

        is_db_connected = False
        while is_db_connected:
            try:
                is_db_connected = connections["default"]
            except OperationalError:
                self.stdout.write("Database cant be reached, waiting 1 second...")
                time.sleep(1)
        
        self.stdout.write(self.style.SUCCESS("Database connected."))