from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase


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

	def test_get_user_profile(self):
		"""
		Test that /user/profile endpoint returns expected fields
		"""
		self.setup_user()
		url = reverse('app.views.get_my_user')

		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIsNotNone(response.data)

		data = response.data
		expected_fields = ['id', 'first_name', 'last_name', 'username', 'email', 'userType', 'place_id', 'place_name']

		self.assertEqual(set(data.keys()), set(expected_fields))


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

	def setup_event(self):
		data = self.helper_create_event()
		response = self.create_event(data)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		return response.data.get('id')

	def helper_create_event(self):
		data = {
			"name": "This is an event title",
			"description": "We have a great description here :)",
			"picture": "RandomTest",
			"start_date": "2007-01-01T00:00:00Z",
			"end_date": "2007-01-02T00:00:00Z",
			"tags": []
		}
		return data;

	def helper_vote_data(self, event_id, direction):
		data = {
			"event_id": event_id,
			"direction": direction
		}
		return data

	def create_event(self, data):
		url = reverse('app.views.list_create_event')
		return self.client.post(url, data, format='json')

	def get_event(self, event_id):
		url = '/events/' + str(event_id) + '/'
		return self.client.get(url)

	def get_events(self, filter_args = None):
		url = reverse('app.views.list_create_event')
		if filter_args:
			pass
		return self.client.get(url)

	def vote_event(self, data):
		url = reverse('app.views.vote_event')
		return self.client.post(url, data, format='json')

	def validate_event(self, response_data, expected):
		for key, value in expected.viewitems():
			if not isinstance(response_data.get(key), list):
				response_data[key] = response_data.get(key).encode('utf-8')
			self.assertEqual(response_data.get(key), value)

	def test_create_event(self):
		"""
		Event creation test with all fields
		"""
		self.setup_user()
		data = self.helper_create_event()

		response = self.create_event(data)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

	def helper_test_create_event_missing_field(self, field):
		self.setup_user()
		data = self.helper_create_event()
		data.pop(field)
		response = self.create_event(data)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data.get(field)[0].encode('utf-8'), "This field is required.")

	def test_create_event_missing_name(self):
		"""
		Missing name from event creation
		"""
		self.helper_test_create_event_missing_field('name')

	def test_create_event_missing_description(self):
		"""
		Missing description from event creation
		"""
		self.helper_test_create_event_missing_field('description')

	def test_create_event_missing_start_date(self):
		"""
		Missing start_date from event creation
		"""
		self.helper_test_create_event_missing_field('start_date')

	def test_create_event_missing_end_date(self):
		"""
		Missing end_date from event creation
		"""
		self.helper_test_create_event_missing_field('end_date')

	def test_update_event(self):
		"""
		Basic update event test
		"""
		self.setup_user()
		data = self.helper_create_event()

		response = self.create_event(data)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(0, 1, "IMPLEMENT UPDATING EVENTS")

	def test_get_event(self):
		"""
		Test if we can get an event we just created
		"""
		self.setup_user()
		data = self.helper_create_event()

		response = self.create_event(data)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		response = self.get_event(response.data.get('id'))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.validate_event(response.data, data)

	def change_data(self, data, i):
		data['name'] = data.get('name') + str(i)
		return data

	def test_get_events(self):
		"""
		Test if we can get a list of events we just created
		"""
		self.setup_user()
		data = self.helper_create_event()

		data_list = [self.change_data(data, i) for i in range(0, 10)]
		for d in data_list:
			response = self.create_event(d)
			self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		response = self.get_events()
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		for response_data, expected_data in zip(response.data, data_list):
			self.validate_event(response_data, expected_data)

	def test_get_events_filter(self):
		"""
		TODO: Test the filters we have in place when we do ranked events
		"""
		self.assertEqual(0, 1, "TODO: Test the filters we have in place when we do ranked events")

	def vote(self, event_id, direction, expected):
		vote_data = self.helper_vote_data(event_id, direction)
		response = self.vote_event(vote_data)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		response = self.get_event(event_id)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(expected, response.data.get('vote'))

	def test_event_upvote(self):
		"""
		Test event upvoting
		"""
		self.setup_user()
		event_id = self.setup_event()
		self.vote(event_id, 1, 1)

	def test_event_downvote(self):
		"""
		Test event downvoting
		"""
		self.setup_user()
		event_id = self.setup_event()
		self.vote(event_id, -1, -1)

	def test_event_novote(self):
		"""
		Test event novoting
		"""
		self.setup_user()
		event_id = self.setup_event()
		self.vote(event_id, 0, 0)

	def test_event_vote_algorithm(self):
		"""
		We can do some rigourous testing of voting in this test.
		"""
		self.setup_user()
		event_id = self.setup_event()
		self.vote(event_id, 1, 1)
		self.vote(event_id, -1, -1)

class ImageUploadTests(APITestCase):

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

	def _create_test_file(self, path):
		# f = open(path, 'w')
		# f.write('testfile123\n')
		# f.close()
		f = open(path, 'rb')
		return {'image': f}

	def test_upload_image(self):
		self.setup_user()
		url = reverse('app.views.upload_image')
		data = self._create_test_file('/tmp/test_upload.png')
		response = self.client.post(url, data, format='multipart')
		print(response)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)