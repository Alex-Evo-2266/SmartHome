# Generated by Django 3.1.5 on 2021-04-02 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0012_movie_movieshots_serial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='localUrl',
            field=models.SlugField(default=None, max_length=160, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='url',
            field=models.SlugField(default=None, max_length=160, null=True),
        ),
        migrations.AlterField(
            model_name='movieactor',
            name='url',
            field=models.SlugField(default=None, max_length=160, null=True),
        ),
        migrations.AlterField(
            model_name='moviecategory',
            name='url',
            field=models.SlugField(max_length=160),
        ),
        migrations.AlterField(
            model_name='movieganre',
            name='url',
            field=models.SlugField(max_length=160),
        ),
        migrations.AlterField(
            model_name='movieshots',
            name='url',
            field=models.SlugField(max_length=160),
        ),
        migrations.AlterField(
            model_name='serial',
            name='localUrl',
            field=models.SlugField(default=None, max_length=160, null=True),
        ),
        migrations.AlterField(
            model_name='serial',
            name='url',
            field=models.SlugField(default=None, max_length=160, null=True),
        ),
    ]