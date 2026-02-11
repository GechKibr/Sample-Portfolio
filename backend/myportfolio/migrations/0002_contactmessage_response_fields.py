from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myportfolio', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactmessage',
            name='response_status',
            field=models.CharField(
                choices=[
                    ('new', 'New'),
                    ('progress', 'In progress'),
                    ('responded', 'Responded'),
                ],
                default='new',
                max_length=12,
            ),
        ),
        migrations.AddField(
            model_name='contactmessage',
            name='response_text',
            field=models.TextField(blank=True),
        ),
    ]
