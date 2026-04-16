from unittest import TestCase

from tree_sitter import Language, Parser
import tree_sitter_flint


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            Parser(Language(tree_sitter_flint.language()))
        except Exception:
            self.fail("Error loading Flint grammar")
