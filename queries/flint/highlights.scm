; =========================================
; Flint Tree-sitter Highlights Query
; =========================================

; 1. Keywords
[
  "import"
  "as"
  "if"
  "else"
  "for"
  "while"
  "stream"
  "return"
  "break"
  "continue"
] @keyword

[
  "fn"
  "extern"
] @keyword.function

[
  "var"
  "const"
  "struct"
] @keyword.storage

; 2. Literals
(string_literal) @string
(number) @number
(boolean) @boolean
(null_literal) @constant.builtin

; 3. Types
(type) @type
(type (identifier) @type) ; Para structs customizadas como `Config`

; 4. Functions and Calls
(function_decl name: (identifier) @function)
(call_expr callee: (identifier) @function.call)
(call_expr callee: (property_access property: (identifier) @function.method.call))

; 5. Variables and Identifiers
(var_decl name: (identifier) @variable)
(parameter name: (identifier) @parameter)
(struct_field name: (identifier) @property)
(property_access property: (identifier) @property)

(identifier) @variable

; 6. Operators
[
  "~>"
  "+"
  "-"
  "*"
  "/"
  "%"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "="
  "and"
  "or"
  ".."
] @operator

; 7. punctuation
[
  "(" ")"
  "[" "]"
  "{" "}"
] @punctuation.bracket

[
  "."
  ","
  ";"
  ":"
] @punctuation.delimiter

; 8. Comments
(line_comment) @comment
(block_comment) @comment