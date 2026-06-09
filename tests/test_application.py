import unittest

from src.application import get_project_name, list_components


class TestApplication(unittest.TestCase):
    def test_get_project_name(self):
        self.assertEqual(get_project_name(), "Local Marketplace")

    def test_list_components(self):
        components = list_components()
        self.assertIn("backend", components)
        self.assertIn("frontend", components)
        self.assertIn("src", components)
        self.assertIn("tests", components)


if __name__ == "__main__":
    unittest.main()
