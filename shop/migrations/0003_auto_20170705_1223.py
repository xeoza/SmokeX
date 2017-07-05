# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_auto_20170705_1146'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(verbose_name='Изображение', blank=True, upload_to='person/%Y/%m/%d/', width_field=200, height_field=300),
        ),
    ]
