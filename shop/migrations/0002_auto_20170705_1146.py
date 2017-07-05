# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='product',
            options={'verbose_name': 'Сотрудник', 'verbose_name_plural': 'Сотрудники', 'ordering': ['name']},
        ),
        migrations.RemoveField(
            model_name='product',
            name='price',
        ),
        migrations.RemoveField(
            model_name='product',
            name='stock',
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(verbose_name='Изображение', blank=True, upload_to='person/%Y/%m/%d/'),
        ),
        migrations.AlterField(
            model_name='product',
            name='name',
            field=models.CharField(verbose_name='ФИО', max_length=200, db_index=True),
        ),
    ]
