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
	user = models.ForeignKey('ChronosUser')

##############################
# --------- Users! --------- #
##############################
class ChronosUser(AbstractUser):
    REGULAR = 'REG'
    USER_TYPES = (
        (REGULAR, 'Regular'),
    )

    userType = models.CharField(max_length=3, choices=USER_TYPES, default=REGULAR)
    place_id = models.CharField(max_length=100, null=True)

    # We have a reference to the events that were upvoted and downvoted, so that we know
    # which one to show to the user.

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
	name = models.CharField(max_length=100)
	description = models.TextField()
	creator = models.ForeignKey(ChronosUser)
	create_date = models.DateTimeField(auto_now_add=True, blank=True)
	edit_date = models.DateTimeField(auto_now=True, blank=True)
	start_date = models.DateTimeField()
	end_date = models.DateTimeField()
	upvote = models.IntegerField(default=0)
	downvote = models.IntegerField(default=0)
	report = models.IntegerField(default=0)
	is_deleted = models.BooleanField(default=False)
	picture = models.CharField(max_length=255, null=True)
	place_id = models.CharField(max_length=100, null=True)
	tags = models.ManyToManyField(Tag, blank=True)
