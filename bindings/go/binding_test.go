package tree_sitter_flint_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_flint "github.com/lucaas-d3v/flint/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_flint.Language())
	if language == nil {
		t.Errorf("Error loading Flint grammar")
	}
}
