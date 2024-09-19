import secrets
import string
import unittest
import requests
import json

def generate_random_string(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

class TestAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.base_url = "http://localhost:5000/api"
        cls.headers = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }
        cls.payload = json.dumps({
            "username": "admin",
            "password": "admin"
        })
        cls.token = cls._get_token()

    @classmethod
    def _get_token(cls):
        url = f"{cls.base_url}/auth/login"
        response = requests.post(url, data=cls.payload, headers=cls.headers)
        response.raise_for_status()
        response_json = response.json()
        return response_json.get("token")

    def _get_headers(self):
        return {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

    # User APIs 
    def test_create_user(self):
        url = f"{self.base_url}/admin/users"
        payload = json.dumps({
            "username": generate_random_string(),
            "password": generate_random_string(),
            "is_admin": False
        })

        response = requests.post(url, data=payload, headers=self._get_headers())
        response_data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response_data)
        self.user_id = response_data.get("user", {}).get("_id", None)
        self.assertIsNotNone(self.user_id)
        return self.user_id

    def test_edit_user(self):
        user_id = self.test_create_user()
        if user_id is None:
            self.skipTest("No user ID available. Skipping edit user test.")

        url = f"{self.base_url}/admin/users/{self.user_id}"
        payload = json.dumps({
            "username": generate_random_string(),
            "password": generate_random_string(),
            "is_admin": True
        })

        response = requests.put(url, data=payload, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("message", response_data)

    def test_remove_user(self):
        user_id = self.test_create_user()
        if user_id is None:
            self.skipTest("No user ID available. Skipping remove user test.")

        url = f"{self.base_url}/admin/users/{self.user_id}"
        response = requests.delete(url, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("message", response_data)

    def test_get_users(self):
        url = f"{self.base_url}/admin/users"
        response = requests.get(url, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    # Group APIs
    def test_create_group(self):
        url = f"{self.base_url}/groups"
        payload = json.dumps({
            "name": generate_random_string(),
            "description": generate_random_string(),
            "members": []
        })

        response = requests.post(url, data=payload, headers=self._get_headers())
        response_data = response.json()
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response_data)
        self.group_id = response_data.get("group", {}).get("_id", None)
        self.assertIsNotNone(self.group_id)
        return self.group_id

    def test_update_group(self):
        group_id = self.test_create_group()
        if group_id is None:
            self.skipTest("No group ID available. Skipping update group test.")

        url = f"{self.base_url}/groups/{self.group_id}"
        payload = json.dumps({
            "name": generate_random_string(),
            "description": generate_random_string(),
            "members": []
        })

        response = requests.put(url, data=payload, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("message", response_data)

    def test_delete_group(self):
        group_id = self.test_create_group()
        if group_id is None:
            self.skipTest("No group ID available. Skipping delete group test.")

        url = f"{self.base_url}/groups/{self.group_id}"
        response = requests.delete(url, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("message", response_data)

    def test_get_user_groups(self):
        url = f"{self.base_url}/groups"
        response = requests.get(url, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_group_by_id(self):
        group_id = self.test_create_group()
        if group_id is None:
            self.skipTest("No group ID available. Skipping get group by ID test.")

        url = f"{self.base_url}/groups/{self.group_id}"
        response = requests.get(url, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data.get("_id"), self.group_id)

    # Message APIs
    def test_send_message(self):
        group_id = self.test_create_group()
        if group_id is None:
            self.skipTest("No group ID available. Skipping send message test.")

        url = f"{self.base_url}/messages"
        payload = json.dumps({
            "groupId": self.group_id,
            "text": generate_random_string()
        })

        response = requests.post(url, data=payload, headers=self._get_headers())
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn("message", response_data)
        self.message_id = response_data.get("messageId", None)
        self.assertIsNotNone(self.message_id)
        return self.message_id

    def test_like_message(self):
        message_id = self.test_send_message()
        if message_id is None:
            self.skipTest("No message ID available. Skipping like message test.")

        url = f"{self.base_url}/messages/like"
        payload = json.dumps({
            "messageId": self.message_id
        })

        response = requests.post(url, data=payload, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("message", response_data)

    def test_get_messages_by_group(self):
        group_id = self.test_create_group()
        if group_id is None:
            self.skipTest("No group ID available. Skipping get messages by group test.")

        self.test_send_message()

        url = f"{self.base_url}/messages/{self.group_id}"
        response = requests.get(url, headers=self._get_headers())
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIsInstance(response_data.get("messages"), list)

if __name__ == "__main__":
    unittest.main()