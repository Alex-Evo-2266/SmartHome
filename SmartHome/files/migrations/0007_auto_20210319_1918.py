# Generated by Django 3.1.5 on 2021-03-19 19:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0006_auto_20210319_1916'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='localUrl',
            field=models.SlugField(default='', max_length=160, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='url',
            field=models.SlugField(max_length=160, null=True, unique=True),
        ),
    ]