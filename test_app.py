import unittest
from app import app


class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True

    def test_home_page_status_code(self):
        """Test that home page returns status code 200"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_home_page_content_type(self):
        """Test that home page returns HTML content"""
        response = self.app.get('/')
        self.assertIn('text/html', response.content_type)

    def test_home_page_contains_title(self):
        """Test that home page contains expected content"""
        response = self.app.get('/')
        self.assertIn(b'Remever', response.data)


if __name__ == '__main__':
    unittest.main()