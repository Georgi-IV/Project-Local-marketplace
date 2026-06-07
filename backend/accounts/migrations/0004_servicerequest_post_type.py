from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_servicerequest_creator_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="servicerequest",
            name="post_type",
            field=models.CharField(default="need", max_length=10),
            preserve_default=False,
        ),
    ]
