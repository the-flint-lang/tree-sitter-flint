import XCTest
import SwiftTreeSitter
import TreeSitterFlint

final class TreeSitterFlintTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_flint())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Flint grammar")
    }
}
