import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;
    
    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.nameParser.split(source, this.delimiter).length;
    }

    protected doGetNoComponents(): number {
        throw new Error("Method not implemented.");
    }
    protected doGetComponent(i: number): string {
        throw new Error("Method not implemented.");
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