# shop/apps.py
from django.apps import AppConfig

class ShopAppConfig(AppConfig):
    name = "shop" # Здесь указываем исходное имя приложения
    verbose_name = "Каталог сотрудников УМК" # А здесь, имя которое необходимо отобразить в админке