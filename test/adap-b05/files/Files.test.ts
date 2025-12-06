import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";
import { Link } from "../../../src/adap-b05/files/Link";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

function createFileSystem2(): RootNode {
  let rn: RootNode = new RootNode();
  const names: string[] = ["a", "b", "c"];
  let dirs: Directory[] = [rn];


  for (let i = 0; i < 3; i++) {
    let currentDirs: Directory[] = [];
    for (let name of names) {
      for (let dir of dirs) {
        let n: Directory = new Directory(name, dir);
        currentDirs.push(n);
        let f: File = new File(name, dir);
      }
    }

    dirs = currentDirs;
  }

  return rn;
}

function createFileSystem3(depth: number = 3): Node[] {
  let rn: RootNode = new RootNode();
  const names: string[] = ["a", "b", "c"];
  let dirs: Directory[] = [rn];
  let result: Node[] = [rn]

  for (let i = 0; i < depth; i++) {
    let currentDirs: Directory[] = [];
    for (let dir of dirs) {
      for (let name of names) {
        let n: Directory = new Directory(name, dir);
        currentDirs.push(n);
        let file: File = new File("file", dir);
        result.push(n);
      }
    }
    dirs = currentDirs;
  }

  return result;
}

describe("Parted tree test", () => {
  it("test 1", () => {
    let n: Node[] = createFileSystem3();
    let as: Node[] = [...n[1].findNodes("a")];
    let asNames: Set<string> = new Set(as.map(a => a.getFullName().asString()))
    expect(asNames.size == as.length).toBe(true);
    expect(as.length).toBe(5);
    let nodeNames: Set<string> = new Set(["/a", "/a/a", "/a/a/a", "/a/b/a", "/a/c/a"])
    for (let a of as) {
      expect(a.getBaseName()).toBe("a");
      let fullName: string = a.getFullName().asString();
      expect(nodeNames.has(fullName)).toBe(true);
    }
  });

  it("test 2", () => {
    let n: Node[] = createFileSystem3();
    let link: Link = new Link("link", n[1] as Directory, n[0]);
    let as: Set<Node> = n[1].findNodes("a");
    let rs: Set<Node> = n[0].findNodes("a");
    expect(as.size == rs.size).toBe(true);
    for (let a of as) {
      expect(rs.has(a)).toBe(true);
    }
  });

  it("test 3", () => {

    let nodeNames: Set<string> = new Set([
      "/a", "/a/a", "/a/a/a", "/a/b/a", "/a/c/a",
      "/c/a", "/c/a/a", "/c/b/a", "/c/c/a"
    ])
    let n: Node[] = createFileSystem3();
    let link: Link = new Link("link", n[1] as Directory, n[3]);
    let as: Node[] = [...n[1].findNodes("a")];
    let asNames: Set<string> = new Set(as.map(a => a.getFullName().asString()))
    expect(asNames.size == as.length).toBe(true);
    expect(as.length == nodeNames.size).toBe(true);

    for (let a of as) {
      expect(a.getBaseName()).toBe("a");
      let fullName: string = a.getFullName().asString();
      expect(nodeNames.has(fullName)).toBe(true);
    }
  });

  it("test link", () => {
    let n: Node[] = createFileSystem3();
    let link: Link = new Link("link", n[4] as Directory, n[1]);
    let linkA: Link = new Link("a", n[1] as Directory, n[4]);
    let as: Node[] = [...n[1].findNodes("a")];
    let asNames: Set<string> = new Set(as.map(a => a.getFullName().asString()))
    expect(asNames.size + 1 == as.length).toBe(true);
    expect(as.length).toBe(6);
    let nodeNames: Set<string> = new Set(["/a", "/a/a", "/a/a/a", "/a/b/a", "/a/c/a"])
    for (let a of as) {
      expect(a.getBaseName()).toBe("a");
      let fullName: string = a.getFullName().asString();
      expect(nodeNames.has(fullName)).toBe(true);
    }
  });
});

describe("Basic naming test", () => {
  it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0];
    let ls2: Node = [...fs.findNodes("ls")][0];
    console.log(ls2.getFullName().asString())
    let n = new StringName("/usr/bin/ls", '/');

    expect(ls.getFullName().asString()).toBe(n.asString());
  });

  it("test name checking 2", () => {
    let fs: RootNode = createFileSystem2();
    let nodes: Node[] = [...fs.findNodes("a")];
    for (let n of nodes) {
      console.log(n.getFullName().asString());
    }
  });
});

function createCircularFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let a: Directory = new Directory("a", rn);
  let b: Directory = new Directory("b", a);
  let c: Link = new Link("linkA", b, a);
  return rn;
}

describe("Circular test", () => {
  it("circular checking", () => {
    let fs: RootNode = createCircularFileSystem();
    let na: Node[] = [...fs.findNodes("a")];
    let nb: Node[] = [...fs.findNodes("b")];
    let la: Node[] = [...fs.findNodes("linkA")];
    expect(na.length).toBe(1);
    expect(nb.length).toBe(1);
    expect(la.length).toBe(1);
  });
  it("test link", () => {
    let n: Node[] = createFileSystem3(0);
    let link1: Link = new Link("link", n[0] as Directory);
    let link2: Link = new Link("a", n[0] as Directory, link1);
    link1.setTargetNode(link2);
    let as: Node[] = [...n[0].findNodes("a")];
    expect(as.length).toBe(1);
  });

  it("test link name", () => { 
    let n: Node[] = createFileSystem3(1);
    let link: Link = new Link("link", n[0] as Directory, n[1]);
    console.log(link.getBaseName());
  });

  it ("test link size", () => {
    let root: RootNode = new RootNode()
    let a: Node = new Node("a", root);
    let link: Link = new Link("link", root, a);
    console.log(root.findNodes("link").size); // 0 oder 1?
    console.log(root.findNodes("a").size); // 1 oder 2?
  })

});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);
  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch(er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex).toBeInstanceOf(ServiceFailureException);
      expect(ex.hasTrigger()).toBe(true);
      let tx: Exception = ex.getTrigger();
      expect(tx).toBeInstanceOf(InvalidStateException);
    }
    expect(threwException).toBe(true);
  });
});
