; =========================================
; Flint Tree-sitter Indents Query
; =========================================

[
  (block)
  (struct_decl)
  (dict_literal)
  (array_literal)
] @indent.begin

[
  "}"
  "]"
] @indent.end

(pipeline_expr right: (_) @indent.begin)

(line_comment) @indent.ignore
(block_comment) @indent.ignore
