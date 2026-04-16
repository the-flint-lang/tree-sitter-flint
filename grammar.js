const PREC = {
  pipeline: 1,
  assign: 2,
  or: 3,
  and: 4,
  equality: 5,
  relational: 6,
  additive: 7,
  multiplicative: 8,
  unary: 9,
  call: 10,
  property: 11,
};

module.exports = grammar({
  name: 'flint',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  conflicts: $ => [
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.import_stmt,
      $.var_decl,
      $.struct_decl,
      $.function_decl,
      $.if_stmt,
      $.for_stmt,
      $.while_stmt,
      $.stream_stmt,
      $.return_stmt,
      $.break_stmt,
      $.continue_stmt,
      $.expression_statement
    ),

    import_stmt: $ => seq(
      'import',
      field('module', $.identifier),
      optional(seq('as', field('alias', $.identifier))),
      ';'
    ),

    var_decl: $ => seq(
      choice('var', 'const'),
      field('name', $.identifier),
      optional(seq(':', field('type', $.type))),
      '=',
      field('value', $._expression),
      ';'
    ),

    struct_decl: $ => seq(
      'struct',
      field('name', $.identifier),
      '{',
      commaSep($.struct_field),
      '}'
    ),

    struct_field: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type)
    ),

    function_decl: $ => seq(
      optional('extern'),
      'fn',
      field('name', $.identifier),
      '(',
      optional($._parameters),
      ')',
      optional(field('return_type', $.type)),
      choice($.block, ';')
    ),

    _parameters: $ => commaSep1($.parameter),

    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type)
    ),

    if_stmt: $ => seq(
      'if', '(', field('condition', $._expression), ')',
      field('consequence', $.block),
      optional(seq('else', field('alternative', choice($.block, $.if_stmt))))
    ),

    for_stmt: $ => seq(
      'for', '(', field('item', $.identifier), 'in', field('iterable', $._expression), ')',
      field('body', $.block)
    ),

    while_stmt: $ => seq(
      'while', '(', field('condition', $._expression), ')',
      field('body', $.block)
    ),

    stream_stmt: $ => seq(
      'stream', '(', field('item', $.identifier), 'in', field('iterable', $._expression), ')',
      field('body', $.block)
    ),

    return_stmt: $ => seq('return', optional($._expression), ';'),
    break_stmt: $ => seq('break', ';'),
    continue_stmt: $ => seq('continue', ';'),

    expression_statement: $ => seq($._expression, ';'),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    _expression: $ => choice(
      $.identifier,
      $.number,
      $.string_literal,
      $.boolean,
      $.null_literal,
      $.placeholder,
      $.array_literal,
      $.dict_literal,
      $.call_expr,
      $.property_access,
      $.binary_expr,
      $.unary_expr,
      $.pipeline_expr,
      seq('(', $._expression, ')')
    ),

    pipeline_expr: $ => prec.left(PREC.pipeline, seq(
      field('left', $._expression),
      '~>',
      field('right', choice($.call_expr, $.identifier))
    )),

    binary_expr: $ => choice(
      prec.left(PREC.multiplicative, seq(field('left', $._expression), choice('*', '/', '%'), field('right', $._expression))),
      prec.left(PREC.additive, seq(field('left', $._expression), choice('+', '-'), field('right', $._expression))),
      prec.left(PREC.relational, seq(field('left', $._expression), choice('<', '>', '<=', '>='), field('right', $._expression))),
      prec.left(PREC.equality, seq(field('left', $._expression), choice('==', '!='), field('right', $._expression))),
      prec.left(PREC.and, seq(field('left', $._expression), 'and', field('right', $._expression))),
      prec.left(PREC.or, seq(field('left', $._expression), 'or', field('right', $._expression))),
      prec.left(PREC.relational, seq(field('left', $._expression), '..', field('right', $._expression))) // range
    ),

    unary_expr: $ => prec(PREC.unary, seq(
      field('operator', choice('-', '!')),
      field('operand', $._expression)
    )),

    call_expr: $ => prec(PREC.call, seq(
      field('callee', choice($.identifier, $.property_access)),
      '(',
      optional($._arguments),
      ')'
    )),

    property_access: $ => prec(PREC.property, seq(
      field('object', choice($.identifier, $.call_expr, $.array_literal)),
      '.',
      field('property', $.identifier)
    )),

    _arguments: $ => commaSep1($._expression),

    array_literal: $ => seq('[', commaSep($._expression), ']'),

    dict_literal: $ => seq('{', commaSep($.dict_entry), '}'),

    dict_entry: $ => seq(
      field('key', choice($.string_literal, $.identifier)),
      ':',
      field('value', $._expression)
    ),

    type: $ => choice(
      'int', 'float', 'string', 'bool', 'void', 'val',
      seq('arr', optional(seq('<', $.type, '>'))),
      seq('dict', optional(seq('<', $.type, ',', $.type, '>'))),
      $.identifier
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    placeholder: $ => '_',

    number: $ => /-?\d+(\.\d+)?([eE][+-]?\d+)?/,

    boolean: $ => choice('true', 'false'),

    null_literal: $ => 'null',

    string_literal: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq('`', /[^`]*/, '`'),
      seq('$"', /[^"]*/, '"'),
      seq('$`', /[^`]*/, '`')
    ),

    line_comment: $ => seq('--', /.*/),
    block_comment: $ => seq('{-', /(.|\n)*?/, '-}')
  }
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}