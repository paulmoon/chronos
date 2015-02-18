from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token

class UserTests(APITestCase):

	def helper_user_create(self):
		data = {
			'username': 'test_user',
			'password': 'test_password',
			'email': 'test_user@test.com',
			'first_name': 'test_name',
			'last_name': 'test_lastname',
		} 
		return data

	def create_user(self, data):
		url = reverse('app.views.create_user')	
		response = self.client.post(url, data, format='json')
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertIsNotNone(response.data.get('token'))

	def setup_user(self):
		data = self.helper_user_create()
		url = reverse('app.views.create_user')	
		response = self.client.post(url, data, format='json')

		verify_url = reverse('rest_framework.authtoken.views.obtain_auth_token')
		data.pop('first_name')
		data.pop('last_name')
		data.pop('email')

		response = self.client.post(verify_url, data)
		self.assertIsNotNone(response.data.get('token'))

		self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data.get('token'))

	def test_create_user(self):
		"""
		Ensure we can still create a basic account
		"""
		data = self.helper_user_create()
		self.create_user(data)

	def test_create_user_only_required(self):
		"""
		Ensure that accounts can be created with only the required fields
		"""
		data = self.helper_user_create()
		data.pop('first_name')
		data.pop('last_name')
		self.create_user(data)

	def test_create_user_missing_email(self):
		"""
		Ensure that users cannot be created without an email
		"""
		url = reverse('app.views.create_user')	
		data = self.helper_user_create()
		data.pop('email')
		response = self.client.post(url, data, format='json')
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


	def test_update_user(self):
		"""
		Test basic user updating
		"""
		self.setup_user()
		url = reverse('app.views.update_user')

		data = {
			'first_name': 'changed'
		}

		response = self.client.put(url, data, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data.get('first_name'), data['first_name'])

		data = {
			'last_name': 'changed_last',
			'password': 'different'
		}

		response = self.client.put(url, data, format='json')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data.get('last_name'), data['last_name'])

class EventTests(APITestCase):

	def helper_user_create(self):
		data = {
			'username': 'test_user',
			'password': 'test_password',
			'email': 'test_user@test.com',
			'first_name': 'test_name',
			'last_name': 'test_lastname',
		} 
		return data

	def setup_user(self):
		data = self.helper_user_create()
		url = reverse('app.views.create_user')	
		response = self.client.post(url, data, format='json')

		verify_url = reverse('rest_framework.authtoken.views.obtain_auth_token')
		data.pop('first_name')
		data.pop('last_name')
		data.pop('email')

		response = self.client.post(verify_url, data)
		self.assertIsNotNone(response.data.get('token'))

		self.client.credentials(HTTP_AUTHORIZATION='Token ' + response.data.get('token'))

	def helper_create_event(self):
		data = {
			"title": "This is an event title",
			
		}

	def test_create_event(self):
		"""
		Event creation test with all fields
		"""
		pass