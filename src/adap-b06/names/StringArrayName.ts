import { AbstractName } from "./AbstractName"
import { Name } from "./Name";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source.slice();
    }

    protected doGetNoComponents(): number {
        return this.components.length;
    }

    protected doGetComponent(i: number): string {
        return this.components[i];
    }

    protected doSetComponent(i: number, c: string): Name {
        throw new Error("Method not implemented.");
    }
    protected doInsert(i: number, c: string): Name {
        throw new Error("Method not implemented.");
    }
    protected doAppend(c: string): Name {
        throw new Error("Method not implemented.");
    }
    protected doRemove(i: number): Name {
        throw new Error("Method not implemented.");
    }
    protected doConcat(other: Name): Name {
        throw new Error("Method not implemented.");
    }
}