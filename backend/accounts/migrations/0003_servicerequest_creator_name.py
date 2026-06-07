from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_servicerequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicerequest',
            name='creator_name',
            field=models.CharField(blank=True, max_length=150),
        ),
    ]
