from django.apps import AppConfig


class ChronosConfig(AppConfig):
    name = "app"
    verbose_name = "Chronos - Crowdsourced Calendar Application"

    def ready(self):
        self.get_model('ChronosUser')._meta.get_field_by_name('email')[0]._unique = True
        self.get_model('ChronosUser')._meta.get_field_by_name('email')[0]._required = True
