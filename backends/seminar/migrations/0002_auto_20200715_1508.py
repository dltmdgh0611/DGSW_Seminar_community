# Generated by Django 3.0.8 on 2020-07-15 06:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('seminar', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='postofrecruitseminar',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterModelOptions(
            name='postofrequestseminar',
            options={'ordering': ['-created_at']},
        ),
    ]
