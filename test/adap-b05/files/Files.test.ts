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
  it("Test only one leave", () => {
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

  it("Test 2 Leaves", () => {

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

  it("Test Link to Root", () => {
    let n: Node[] = createFileSystem3();
    let link: Link = new Link("link", n[1] as Directory, n[0]);
    let as: Set<Node> = n[1].findNodes("a");
    let rs: Set<Node> = n[0].findNodes("a");
    expect(as.size == rs.size).toBe(true);
    for (let a of as) {
      expect(rs.has(a)).toBe(true);
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
    let n = new StringName("/usr/bin/ls", '/');
    expect(ls.getFullName().asString()).toBe(n.asString());
  });


  it("test name checking 2", () => {
    let fs: Node[] = createFileSystem3();
    let nodes: Node[] = [...fs[0].findNodes("a")];
    expect(nodes.length).toBe(13);
  });

  it("Test files", () => {
    let fs: Node[] = createFileSystem3(2);
    let files: Node[] = [...fs[0].findNodes("file")];
    expect(files.length).toBe(12);
  });

  it("Start at file 1", () => {
    let fs: Node[] = createFileSystem3(1);
    let file: File = new File("Start", fs[0] as Directory);
    let nodes: Node[] = [...file.findNodes("a")];
    expect(nodes.length).toBe(0);
  });

  it("Start at file 2", () => {
    let fs: Node[] = createFileSystem3(1);
    let file: File = new File("Start", fs[0] as Directory);
    let nodes: Node[] = [...file.findNodes("Start")];
    expect(nodes.length).toBe(1);
  });

  it("Start at link 1", () => {
    let fs: Node[] = createFileSystem3(1);
    let link: Link = new Link("Start", fs[1] as Directory, fs[0]);
    let nodes: Node[] = [...link.findNodes("c")];
    expect(nodes.length).toBe(1);
  });

  it("Start at link 2", () => {
    let fs: Node[] = createFileSystem3(1);
    let link: Link = new Link("Start", fs[1] as Directory, fs[0]);
    let nodes: Node[] = [...link.findNodes("Start")];
    expect(nodes.length).toBe(1);
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

  it ("test link size", () => {
    let root: RootNode = new RootNode()
    let a: Node = new Node("a", root);
    let link: Link = new Link("link", root, a);
    expect(root.findNodes("link").size).toBe(1);
    expect(root.findNodes("a").size).toBe(1);
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
