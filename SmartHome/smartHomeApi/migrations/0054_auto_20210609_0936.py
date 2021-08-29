# Generated by Django 3.2.2 on 2021-06-09 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('smartHomeApi', '0053_action_scriptact'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='valuedevice',
            name='typeControl',
        ),
        migrations.AddField(
            model_name='valuedevice',
            name='name',
            field=models.SlugField(default='null', max_length=200, verbose_name='device value name'),
        ),
        migrations.AddField(
            model_name='valuedevice',
            name='values',
            field=models.CharField(default='', max_length=200, verbose_name='values'),
        ),
        migrations.AlterField(
            model_name='valuedevice',
            name='type',
            field=models.SlugField(default='boolean', max_length=200, verbose_name='device value value'),
        ),
    ]