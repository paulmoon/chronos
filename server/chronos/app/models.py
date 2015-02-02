from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models

# Create your models here.
class Events(models.Model):
	title = models.CharField(max_length=100)
	description = models.TextField()
	creator = models.IntegerField()
	create_date = models.DateField()
	edit_date = models.DateField()
	comment_id = models.IntegerField()
	start_date = models.DateField()
	end_date = models.DateField()
	vote = models.IntegerField()
	report = models.IntegerField()
	is_deleted = models.BooleanField()
	picture = models.CharField(max_length=255)




