import { AbstractName } from "./AbstractName"
import { Name } from "./Name";

export class StringArrayName extends AbstractName {
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