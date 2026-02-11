from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myportfolio', '0002_contactmessage_response_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='profile_picture_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
