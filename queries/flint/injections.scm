; =========================================
; Flint Tree-sitter Injections
; =========================================

(call_expr 
  callee: (property_access property: (identifier) @method (#match? @method "^(exec|spawn)$"))
  (string_literal) @injection.content
  (#set! injection.language "bash")
)
