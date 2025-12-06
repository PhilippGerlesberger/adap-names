import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { Link } from "./Link";
import { Exception } from "../common/Exception";

export enum NodeType {
    File,
    Directory,
    Link,
    Root,
    Node
}

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;
    protected type: NodeType = NodeType.Node;

    constructor(bn: string, pn: Directory, nt?: NodeType) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        if (nt) {
            this.type = nt;
        }
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        return this.doFindNodes(bn, this);
    }

    protected doFindNodes(
        bn: string,
        node: Node,
        result: Set<Node> = new Set<Node>(),
        visited: Set<Node> = new Set<Node>()
    ): Set<Node> {
        
        // Prevent cycles: skip nodes thate were already visited
        if (visited.has(node))  {
            return result;
        }

        // Validate and compare basename; add node if it matches
        const baseName: string = node.doGetBaseName();
        node.validateBaseName(baseName);
        if (baseName == bn) {
            result.add(node);
        }
        
        // Mark node as visited before traversing further
        visited.add(node);

        // Recursively traverse children if directory or follow target if link
        if (node.isDir()) {
            // Iterate thorugh all child nodes
            const dir: Directory = node as Directory;
            const childs: Set<Node> = dir.getChildNodes();
            for (let child of childs) {
                this.doFindNodes(bn, child, result, visited);
            }
        } else if (node.isLink()) {
            // Follow the target node
            const link: Link = node as Link;
            const targetNode: Node | null = link.getTargetNode();
            if (targetNode) {
                this.doFindNodes(bn, targetNode, result, visited);
            }
        }

        return result;
    }

    protected isDir(): boolean {
        return this.type == NodeType.Directory || this.type == NodeType.Root;
    }

    protected isFile(): boolean {
        return this.type == NodeType.File;
    }

    protected isLink(): boolean {
        return this.type == NodeType.Link;
    }

    protected isRoot(): boolean {
        return this.type == NodeType.Root;
    }

    protected validateBaseName(bn: string): void {
        try {
            this.assertBaseName(bn);
        } catch(e) {
            if (e instanceof Exception) {
                throw new ServiceFailureException("Invalid baseName", e)
            } else {
                throw new Error("Something wrong. Haha!")
            }
        }
    }

    protected assertBaseName(bn: string): void {
        let isRoot: boolean = this.isRoot();
        let isValidLength: boolean = 0 < bn.length;
        InvalidStateException.assert(isRoot || isValidLength);
    }
}