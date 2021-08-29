# Generated by Django 3.1.5 on 2021-03-28 16:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('smartHomeApi', '0037_auto_20210328_1500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='value',
            name='valuefirst',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='first', to='smartHomeApi.value'),
        ),
        migrations.AlterField(
            model_name='value',
            name='valuesecond',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='second', to='smartHomeApi.value'),
        ),
    ]