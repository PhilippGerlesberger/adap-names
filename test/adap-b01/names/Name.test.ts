import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

// ------------------------------------------------------------------------------------------------
// Construction tests
// ------------------------------------------------------------------------------------------------

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test construction - single component", () => {
    let n: Name = new Name(["oss\\.cs\\.fau\\.de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test construction - empty components", () => {
    let n: Name = new Name(["", "", "", ""]);
    expect(n.asString()).toBe("..."); // three delimiters for four empty components
  });

  it ("test construction - empty name", () => {
    let n: Name = new Name([]);
    expect(n.asString()).toBe("");
  });

  it ("test construction - Escape character as delimiter", () => {
    let n: Name = new Name( ["oss#\\\\", "#\\\\cs", "fau\\.", "de"],"\\");
    expect(n.asString()).toBe("oss#\\\\#\\cs\\fau.\\de");
  });

  it ("test construction - only special characters", () => {
    let n: Name = new Name( ["\\\\", "\\.", "\\\\"],".");
    expect(n.asString()).toBe("\\...\\");
  } );
  
});

describe("Basic masking tests", () => {
  it("test masking function", () => {
    let n: Name = new Name( ["oss##", "cs"], "\\");
    let m: string[] = n.asComponents(n.asDataString());
    console.log(m);
    console.log(n.asDataString());
    console.log(n.asString());
    let x: boolean = n.compareComponents(m);
    expect(x).toBe(true);
  });

  it("test empty components", () => {
    let n: Name = new Name( ["", "", ""], "\\");
    expect(n.asString()).toBe("\\\\");
  });

  it("test masking function 2", () => {
    let n: Name = new Name( ["\\\\ \\\\ \\\\"]);
    let m: string[] = n.asComponents(n.asDataString());
    console.log(m);
    console.log(n.asDataString());
    console.log(n.asString());
    let x: boolean = n.compareComponents(m);
    expect(x).toBe(true);
  });
});

// FIXME: Test cases for mask functions
describe("Basic unmask initialization tests", () => {
  it("test unmasked construction", () => {
    let n: Name = new Name( ["oss\\\\", "cs", "fau\\.", "de"]);
    expect(n.asString()).toBe("oss\\.cs.fau..de");
  });
});

describe("Basic unmask initialization tests", () => {
  it("test unmasked construction 2", () => {
    let n: Name = new Name( ["oss\\\\", "cs", "fau\\.", "\\\\de"],"\\");
    expect(n.asString()).toBe("oss\\\\cs\\fau.\\\\de");
  });
});

// test ESCAPE_CHARACTER as delimiter
describe("Escape character as delimiter tests", () => {
  it("test construction with escape character as delimiter", () => {
    let n: Name = new Name( ["oss\\\\", "\\\\cs", "fau\\.", "de"],"\\");
    expect(n.asString()).toBe("oss\\\\\\cs\\fau.\\de");
  });
});

// test insert method
describe("Basic insert tests", () => {
  it("test insert method", () => {
    let n: Name = new Name( ["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

// test append method
describe("Basic append tests", () => {
  it("test append method", () => {
    let n: Name = new Name( ["oss", "fau", "de"]);
    n.append("cs");
    expect(n.asString()).toBe("oss.fau.de.cs");
  });
});

describe("Basic function tests", () => {
  it("test insert - basic", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

    it("test insert - negativ parameter", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    expect(() => n.insert(-3, "cs")).toThrow();
  });

  
    it("test insert - param bigger then component length", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    expect(() => n.insert(10, "cs")).toThrow();
  });

  it("test insert - insert at the end", () => {
    let n: Name = new Name(["oss","cs", "fau"]);
    n.insert(3, "de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });


});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss\\.cs\\.fau\\.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});


describe("Name – Getter und defensive Kopien", () => {
  it("should return number of components", () => {
    const n = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });

  it("should get component correctly", () => {
    const n = new Name(["oss", "cs", "fau"]);
    expect(n.getComponent(1)).toBe("cs");
  });

  it("should copy constructor array defensively", () => {
    const arr = ["oss", "cs"];
    const n = new Name(arr);
    arr[0] = "evil";
    expect(n.getComponent(0)).toBe("oss");
  });
});

describe("Name – Delimiter edge cases", () => {
  it("should handle different delimiters cleanly", () => {
    const n1 = new Name(["a", "b", "c"], "/");
    expect(n1.asString()).toBe("a/b/c");

    const n2 = new Name(["a", "b", "c"], "-");
    expect(n2.asString()).toBe("a-b-c");
  });

  it("should correctly join and stringify data using custom delimiter", () => {
    const n = new Name(["oss", "cs", "fau"], "#");
    expect(n.asDataString()).toBe("oss#cs#fau");
  });
});

describe("Name – Large and special component tests", () => {
  it("should handle many components efficiently", () => {
    const arr = Array.from({ length: 500 }, (_, i) => `part${i}`);
    const n = new Name(arr);
    expect(n.getNoComponents()).toBe(500);
    expect(n.asString().startsWith("part0")).toBe(true);
  });

  it("should handle components with escape and delimiter symbols", () => {
    const n = new Name(["oss\\.", "cs\\\\", "fau\\.de"]);
    expect(n.asString()).toContain("oss");
  });

  it("should handle mixed special character delimiters", () => {
    const n = new Name(["a\\\\b", "c\\#d"], "#");
    expect(n.asString()).toBe("a\\b#c#d");
  });
});