import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";
import { DEFAULT_DELIMITER } from "../common/Printable";

describe("Basic StringName function tests", () => {

  describe("asDataString Tests", () =>  {
    it ("basic asDataString test with no delimiter", () => {
      let n: Name = new StringName("oss.cs.fau.de", '#');
      expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");
    });

    it ("basic asDataString test with only delimiter", () => {
      let n: Name = new StringName("oss.cs.fau.de", '.');
      expect(n.asDataString()).toBe("oss.cs.fau.de");
    });

    it ("basic asDataString test with special characters", () => {
      let n: Name = new StringName("oss\\.cs\\\\fau.de", '.');
      expect(n.asDataString()).toBe("oss\\.cs\\\\fau.de");
    });
    /* TODO: ask if \\ is allowed as delimiter.
    it ("basic asDataString test with special characters and ESCAPE delimiter", () => {
      let n: Name = new StringName("oss.cs\\fau\\\\.de", '\\');
      expect(n.asDataString()).toBe("oss\\.cs.fau\\\\\\.de");
    });
    */
    it ("basic asDataString test with special characters and unspecial delimiter", () => {
      let n: Name = new StringName("oss#cs\\\\#fau\\#.de", '#');
      expect(n.asDataString()).toBe("oss.cs\\\\.fau#\\.de");
    });

    it ("asDataString test 6", () => {
      let n: Name = new StringName("de,com#org\\,io", ','); 
      expect(n.asDataString()).toBe("de.com#org,io");
    });

    it("asDataString test 7", () => {
      let n: Name = new StringName("oss.cs#fau", '#');
      expect(n.getNoComponents()).toBe(2);
      expect(n.asDataString()).toBe("oss\\.cs.fau");
    });
  });

  describe("test insert", () => {
    it("test insert 0", () => {
      let n: Name = new StringName("oss.fau.de");
      n.insert(1, "cs");
      expect(n.asString()).toBe("oss.cs.fau.de");
  });
    it("test insert 1", () => {
      let n: Name = new StringName("oss.fau.de");
      n.insert(1, "cs");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test insert 2", () => {
      let n: Name = new StringName("oss.de");
      n.insert(1, "cs.fau");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test insert 3", () => {
      let n: Name = new StringName("oss.fau.de");
      n.insert(0, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe(".oss.fau.de");
    });
    it("test insert 4", () => {
      let n: Name = new StringName("oss.fau.de");
      n.insert(1, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss..fau.de");
    });
    it("test insert 5", () => {
      let n: Name = new StringName("oss.fau.de");
      n.insert(2, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.fau..de");
    });
    it("test insert 6", () => {
      let n: Name = new StringName("oss.fau.de");
      n.insert(3, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.fau.de.");
    });
    it("test insert 7", () => {
      let n: Name = new StringName("oss#de", "#");
      n.insert(1, "cs#fau");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString(".")).toBe("oss.cs.fau.de");
    });
    it("test insert 8", () => {
      let n: Name = new StringName("oss\\#cs", "#");
      n.insert(1, "fau#de");
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString(".")).toBe("oss#cs.fau.de");
    });
    it("test insert 9", () => {
      let n: Name = new StringName("oss#de", "#");
      n.insert(1, "cs.fa\\#u");
      expect(n.getNoComponents()).toBe(3);
      expect(n.asDataString()).toBe("oss.cs\\.fa#u.de");
    });
    it("test insert 10", () => {
      let n: Name = new StringName("", );
      n.insert(0, "de");
      n.insert(0, "fau");
      n.insert(0, "cs");
      n.insert(0, "oss");
      expect(n.getNoComponents()).toBe(5);
      expect(n.asString()).toBe("oss.cs.fau.de.");
    });
    it("test insert 11", () => {
      let n: Name = new StringName("", );
      n.insert(1, "test");
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe(".test");
    });
    it("test insert 12", () => {
        let n: Name = new StringName("oss.fau.de");
        expect(() => n.insert(-1, "cs")).toThrow();
      });
    it("test insert 13", () => {
      let n: Name = new StringName("oss.fau.de");
      expect(() => n.insert(4, "cs")).toThrow();
    });
    it("test insert 14", () => {
      let n: Name = new StringName("oss.cs.fau");
      n.insert(3, "de");
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
  });

  describe("test append", () => {
    it("test append 0", () => {
      let n: Name = new StringName("oss.cs.fau");
      n.append("de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 1", () => {
      let n: Name = new StringName("oss.cs.fau");
      n.append("de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 2", () => {
      let n: Name = new StringName("oss.cs");
      n.append("fau.de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");  
    });
    it("test append 3", () => {
      let n: Name = new StringName("oss.cs");
      n.append("fau.de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 4", () => {
      let n: Name = new StringName("oss.cs");
      n.append("");
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.cs.");
    });
    it("test append 5", () => {
      let n: Name = new StringName("");
      n.append("");
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe(".");
    });
  });

  describe("test remove", () => {
    it("test remove 0", () => {
      let n: Name = new StringName("oss.cs.fau.de"); 
      n.remove(1);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.fau.de");
    });
    it("test remove 1", () => {
      let n: Name = new StringName("oss.cs.fau.de"); 
      n.remove(0);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("cs.fau.de");
    });
    it("test remove 2", () => {
      let n: Name = new StringName("oss.cs.fau.de"); 
      n.remove(3);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.cs.fau");
    });
    it("test remove 3", () => {
      let n: Name = new StringName("oss..fau.de"); 
      n.remove(1);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.fau.de");
    });
    it("test remove 4", () => {
      let n: Name = new StringName("oss.cs.fau.de"); 
      expect(() => n.remove(-1)).toThrow();
    });
    it("test remove 5", () => {
      let n: Name = new StringName("oss.cs.fau.de"); 
      expect(() => n.remove(4)).toThrow();
    });
    it("test remove 6", () => {
      let n: Name = new StringName("oss"); 
      n.remove(0);
      expect(n.getNoComponents()).toBe(1);
      n.insert(0, "");
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe(".");
    });
    it("test remove 6", () => {
      let n: Name = new StringName(""); 
      n.remove(0);
      expect(n.getNoComponents()).toBe(1);
      expect(n.asString()).toBe("");
    });
  });

  describe("test concat", () => {
    it("test concat 0", () => {
      let n: Name = new StringName("oss.cs#fau", '#');
      let m: Name = new StringName("cs.fau\\\\,de#com\\,io", ',');
      expect(n.getNoComponents()).toBe(2);
      expect(m.getNoComponents()).toBe(2);
      n.concat(m);
      expect(n.asString()).toBe("oss.cs#fau#cs.fau\\#de#com,io");
      expect(n.asDataString()).toBe("oss\\.cs.fau.cs\\.fau\\\\.de#com,io");
    });
    it("test concat 1", () => {
      let n: Name = new StringName("oss.cs#fau", '#');
      let m: Name = new StringName("de,com#org\\,io", ',');    
      expect(n.getNoComponents()).toBe(2);
      expect(m.getNoComponents()).toBe(2);
      n.concat(m);
      expect(n.asString()).toBe("oss.cs#fau#de#com#org,io");
      expect(n.asDataString()).toBe("oss\\.cs.fau.de.com#org,io");
    });
    it("test concat 2", () => {
      let n: Name = new StringName("", '#');
      let m: Name = new StringName("de,com#org\\,io", ',');    
      expect(n.getNoComponents()).toBe(1);
      expect(m.getNoComponents()).toBe(2);
      n.concat(m);
      expect(n.asString()).toBe("#de#com#org,io");
      expect(n.asDataString()).toBe(".de.com#org,io");
    });
    it("test concat 3", () => {
      let n: Name = new StringName("oss.cs#fau", '#');
      let m: Name = new StringName("", ',');    
      expect(n.getNoComponents()).toBe(2);
      expect(m.getNoComponents()).toBe(1);
      n.concat(m);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.cs#fau#");
      expect(n.asDataString()).toBe("oss\\.cs.fau.");
    });
    it("test concat 4", () => {
      let n: Name = new StringName("", '#');
      let m: Name = new StringName("", ',');    
      expect(n.getNoComponents()).toBe(1);
      expect(m.getNoComponents()).toBe(1);
      n.concat(m);
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe("#");
      expect(n.asDataString()).toBe(".");
    });
  });

  describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions", () => {
      let n: Name = new StringName("oss.cs.fau.de", '#');
      expect(n.getNoComponents()).toBe(1);
      expect(n.asString()).toBe("oss.cs.fau.de");
      n.append("people");
      expect(n.asString()).toBe("oss.cs.fau.de#people");
    });
  });
});

describe("Basic StringArrayName function tests", () => {

  describe("test asDataString", () => {

    it("basic asDataString test with no delimiter", () => {
      let n: Name = new StringArrayName(["oss.cs.fau.de"], '#');
      expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");
    });

    it("basic asDataString test with only delimiter", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
      expect(n.asDataString()).toBe("oss.cs.fau.de");
    });

    it("basic asDataString test with special characters", () => {
      // Equivalent to "oss\\.cs\\\\fau.de" with '.' delimiter
      let n: Name = new StringArrayName(["oss\\", "cs\\\\fau", "de"], '.');
      expect(n.asDataString()).toBe("oss\\.cs\\\\fau.de");
    });

    /* TODO: ask if \\ is allowed as delimiter.
    it ("basic asDataString test with special characters and ESCAPE delimiter", () => {
      let n: Name = new StringArrayName(["oss.cs", "fau\\", "\\.de"], '\\');
      expect(n.asDataString()).toBe("oss\\.cs.fau\\\\\\.de");
    });
    */

    it("basic asDataString test with special characters and unspecial delimiter", () => {
      // Equivalent to "oss#cs\\\\#fau\\#.de" with '#' delimiter
      let n: Name = new StringArrayName(["oss", "cs\\\\", "fau\\#.de"], '#');
      expect(n.asDataString()).toBe("oss.cs\\\\.fau#\\.de");
    });

    it("asDataString test 6", () => {
      // Equivalent to "de,com#org\\,io" with ',' delimiter
      let n: Name = new StringArrayName(["de", "com#org\\,io"], ',');
      expect(n.asDataString()).toBe("de.com#org,io");
    });

    it("asDataString test 7", () => {
      let n: Name = new StringArrayName(["oss.cs", "fau"], '#');
      expect(n.getNoComponents()).toBe(2);
      expect(n.asDataString()).toBe("oss\\.cs.fau");
    });
  });

  describe("test insert", () => {
    it("test insert 0", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      n.insert(1, "cs");
      expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test insert 1", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      n.insert(1, "cs");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test insert 2", () => {
      let n: Name = new StringArrayName(["oss", "de"], '.');
      n.insert(1, "cs.fau");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });

    it("test insert 3", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      n.insert(0, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe(".oss.fau.de");
    });

    it("test insert 4", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      n.insert(1, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss..fau.de");
    });

    it("test insert 5", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      n.insert(2, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.fau..de");
    });

    it("test insert 6", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      n.insert(3, "");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.fau.de.");
    });

    it("test insert 7", () => {
      let n: Name = new StringArrayName(["oss", "de"], '#');
      n.insert(1, "cs#fau");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString(".")).toBe("oss.cs.fau.de");
    });

    it("test insert 8", () => {
      let n: Name = new StringArrayName(["oss\\#cs"], '#');
      n.insert(1, "fau#de");
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString(".")).toBe("oss#cs.fau.de");
    });

    it("test insert 9", () => {
      let n: Name = new StringArrayName(["oss", "de"], '#');
      n.insert(1, "cs.fa\\#u");
      expect(n.getNoComponents()).toBe(3);
      expect(n.asDataString(".")).toBe("oss.cs\\.fa#u.de");
    });

    it("test insert 10", () => {
      let n: Name = new StringArrayName([""], '.');
      n.insert(0, "de");
      n.insert(0, "fau");
      n.insert(0, "cs");
      n.insert(0, "oss");
      expect(n.getNoComponents()).toBe(5);
      expect(n.asString()).toBe("oss.cs.fau.de.");
    });

    it("test insert 11", () => {
      let n: Name = new StringArrayName([""], '.');
      n.insert(1, "test");
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe(".test");
    });

    it("test insert 12", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      expect(() => n.insert(-1, "cs")).toThrow();
    });

    it("test insert 13", () => {
      let n: Name = new StringArrayName(["oss", "fau", "de"], '.');
      expect(() => n.insert(4, "cs")).toThrow();
    });

    it("test insert 14", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau"], '.');
      n.insert(3, "de");
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
  });

  describe("test append", () => {
    it("test append 0", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau"], '.');
      n.append("de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 1", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau"], '.');
      n.append("de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 2", () => {
      let n: Name = new StringArrayName(["oss", "cs"], '.');
      n.append("fau.de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 3", () => {
      let n: Name = new StringArrayName(["oss", "cs"], '.');
      n.append("fau.de");
      expect(n.getNoComponents()).toBe(4);
      expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append 4", () => {
      let n: Name = new StringArrayName(["oss", "cs"], '.');
      n.append("");
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.cs.");
    });
    it("test append 5", () => {
      let n: Name = new StringArrayName([""], '.');
      n.append("");
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe(".");
    });
  });

  describe("test remove", () => {
    it("test remove 0", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
      n.remove(1);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.fau.de");
    });
    it("test remove 1", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
      n.remove(0);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("cs.fau.de");
    });
    it("test remove 2", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
      n.remove(3);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.cs.fau");
    });
    it("test remove 3", () => {
      let n: Name = new StringArrayName(["oss", "", "fau", "de"], '.');
      n.remove(1);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.fau.de");
    });
    it("test remove 4", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
      expect(() => n.remove(-1)).toThrow();
    });
    it("test remove 5", () => {
      let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], '.');
      expect(() => n.remove(4)).toThrow();
    });
    it("test remove 6", () => {
      let n: Name = new StringArrayName(["oss"], '.');
      n.remove(0);
      expect(n.getNoComponents()).toBe(1);
      n.insert(0, "");
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe(".");
    });
    it("test remove 7", () => {
      let n: Name = new StringArrayName([""], '.');
      n.remove(0);
      expect(n.getNoComponents()).toBe(1);
      expect(n.asString()).toBe("");
    });
  });

  describe("test concat", () => {
    it("test concat 0", () => {
      let n: Name = new StringArrayName(["oss.cs", "fau"], '#');
      let m: Name = new StringArrayName(["cs.fau\\\\", "de#com\\,io"], ',');
      expect(n.getNoComponents()).toBe(2);
      expect(m.getNoComponents()).toBe(2);
      n.concat(m);
  expect(n.asString()).toBe("oss.cs#fau#cs.fau\\#de#com,io");
      expect(n.asDataString()).toBe("oss\\.cs.fau.cs\\.fau\\\\.de#com,io");
    });
    it("test concat 1", () => {
      let n: Name = new StringArrayName(["oss.cs", "fau"], '#');
      let m: Name = new StringArrayName(["de", "com#org\\,io"], ',');
      expect(n.getNoComponents()).toBe(2);
      expect(m.getNoComponents()).toBe(2);
      n.concat(m);
      expect(n.asString()).toBe("oss.cs#fau#de#com#org,io");
      expect(n.asDataString()).toBe("oss\\.cs.fau.de.com#org,io");
    });
    it("test concat 2", () => {
      let n: Name = new StringArrayName([""], '#');
      let m: Name = new StringArrayName(["de", "com#org\\,io"], ',');
      expect(n.getNoComponents()).toBe(1);
      expect(m.getNoComponents()).toBe(2);
      n.concat(m);
      expect(n.asString()).toBe("#de#com#org,io");
      expect(n.asDataString()).toBe(".de.com#org,io");
    });
    it("test concat 3", () => {
      let n: Name = new StringArrayName(["oss.cs", "fau"], '#');
      let m: Name = new StringArrayName([""], ',');
      expect(n.getNoComponents()).toBe(2);
      expect(m.getNoComponents()).toBe(1);
      n.concat(m);
      expect(n.getNoComponents()).toBe(3);
      expect(n.asString()).toBe("oss.cs#fau#");
      expect(n.asDataString()).toBe("oss\\.cs.fau.");
    });
    it("test concat 4", () => {
      let n: Name = new StringArrayName([""], '#');
      let m: Name = new StringArrayName([""], ',');
      expect(n.getNoComponents()).toBe(1);
      expect(m.getNoComponents()).toBe(1);
      n.concat(m);
      expect(n.getNoComponents()).toBe(2);
      expect(n.asString()).toBe("#");
      expect(n.asDataString()).toBe(".");
    });
  });

  describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions", () => {
      let n: Name = new StringArrayName(["oss.cs.fau.de"], '#');
      expect(n.getNoComponents()).toBe(1);
      expect(n.asString()).toBe("oss.cs.fau.de");
      n.append("people");
      expect(n.asString()).toBe("oss.cs.fau.de#people");
    });
  });

  describe("isEmpty tests", () => {
    it("test isEmpty 0", () => {
      let n: Name = new StringArrayName([""]);
      expect(n.isEmpty()).toBe(true);
    });
    it("test isEmpty 0", () => {
      let n: Name = new StringArrayName([]);
      expect(n.isEmpty()).toBe(true);
    });
  });
});


// PRIVATE TESTS

/*
describe("Components test", () => {
  // TODO: ESCAPE_CHARACTER allowed es delimiter?
  it ("test asComponents 1", () => {
    let n: StringName = new StringName("", "\\");
    let source: string = "oss.cs\\fau\\\\.de\\";
    expect(n.asComponents(source, "\\")).toEqual(["oss.cs", "fau\\\\.de", ""]);
  });
  

  it ("test asComponents 1", () => {
    let n: StringName = new StringName("", ".");
    let source: string = "oss.cs\\\\fau\\\\.de\\\\";
    expect(n.asDataComponents(source)).toEqual(["oss", "cs\\\\fau\\\\", "de\\\\"]);
  });
});
*/