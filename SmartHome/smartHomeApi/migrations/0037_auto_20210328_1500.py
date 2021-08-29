# Generated by Django 3.1.5 on 2021-03-28 15:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('smartHomeApi', '0036_auto_20210328_1330'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='action',
            name='value',
        ),
        migrations.RemoveField(
            model_name='ifblock',
            name='value',
        ),
        migrations.AddField(
            model_name='value',
            name='actBlock',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='smartHomeApi.action'),
        ),
        migrations.AddField(
            model_name='value',
            name='ifBlock',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='smartHomeApi.ifblock'),
        ),
    ]