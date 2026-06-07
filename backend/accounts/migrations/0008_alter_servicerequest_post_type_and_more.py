import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_review'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='servicerequest',
            name='post_type',
            field=models.CharField(choices=[('need', 'Need'), ('offer', 'Offer')], default='need', max_length=10),
        ),
        migrations.AlterField(
            model_name='servicerequest',
            name='urgency',
            field=models.CharField(choices=[('urgent', 'Urgent'), ('soon', 'Soon'), ('whenever', 'Whenever'), ('normal', 'Normal')], default='normal', max_length=10),
        ),
        migrations.CreateModel(
            name='ProfileReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author_name', models.CharField(blank=True, max_length=150)),
                ('rating', models.PositiveSmallIntegerField(default=5, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='profile_reviews', to=settings.AUTH_USER_MODEL)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='profile_reviews', to='accounts.profile')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
