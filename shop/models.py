# -*- coding: utf-8 -*-
from django.db import models
from django.core.urlresolvers import reverse


class Category(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('shop:ProductListByCategory', args=[self.slug])



class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', verbose_name="Категория")
    name = models.CharField(max_length=200, db_index=True, verbose_name="ФИО")
    slug = models.SlugField(max_length=200, db_index=True)
    image = models.ImageField(upload_to='person/%Y/%m/%d/', blank=True, verbose_name="Изображение")
    description = models.TextField(blank=True, verbose_name="Описание")
    available = models.BooleanField(default=True, verbose_name="Доступен")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'
        index_together = [
            ['id', 'slug']
        ]

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
          return reverse('shop:ProductDetail', args=[self.id, self.slug])


