from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0005_profile_location"),
    ]

    operations = [
        migrations.AddField(
            model_name="servicerequest",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=30),
            preserve_default=False,
        ),
    ]
