from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator

class Vote(models.Model):
	event = models.ForeignKey('Events')
	direction = models.IntegerField(validators=[MinValueValidator(-1), MaxValueValidator(1)])

##############################
# --------- Users! --------- #
##############################
class ChronosUser(AbstractUser):
    REGULAR = 'REG'
    USER_TYPES = (
        (REGULAR, 'Regular'),
    )

    userType = models.CharField(max_length=3, choices=USER_TYPES, default=REGULAR)

    # We have a reference to the events that were upvoted and downvoted, so that we know
    # which one to show to the user.
    votes = models.ManyToManyField(Vote, null=True)

@receiver(post_save, sender=ChronosUser)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

##############################
# --------- Tag System! ---- #
##############################
class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

##############################
# --------- Events! -------- #
##############################
class Events(models.Model):
	title = models.CharField(max_length=100)
	description = models.TextField()
	creator = models.IntegerField()
	create_date = models.DateField()
	edit_date = models.DateField()
	comment_id = models.IntegerField()
	start_date = models.DateField()
	end_date = models.DateField()
	upvote = models.IntegerField()
	downvote = models.IntegerField()
	report = models.IntegerField()
	is_deleted = models.BooleanField(default=False)
	picture = models.CharField(max_length=255)
	place_id = models.CharField(max_length=100)
	tags = models.ManyToManyField(Tag, null=True)
