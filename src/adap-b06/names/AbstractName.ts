import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor (delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }

    clone(): Name {
        throw new Error("Method not implemented.");
    }

    // --------------------------------------------------------------------------------------------
    // Printable Interface
    // --------------------------------------------------------------------------------------------

    asString(delimiter?: string): string {
        throw new Error("Method not implemented.");
    }

    asDataString(): string {
        throw new Error("Method not implemented.");
    }

    getDelimiterCharacter(): string {
        throw new Error("Method not implemented.");
    }

    // --------------------------------------------------------------------------------------------
    // Equality Interface
    // --------------------------------------------------------------------------------------------
    
    isEqual(other: Object): boolean {
        throw new Error("Method not implemented.");
    }

    getHashCode(): number {
        throw new Error("Method not implemented.");
    }

    // --------------------------------------------------------------------------------------------
    // Name Interface
    // --------------------------------------------------------------------------------------------

    isEmpty(): boolean {
        throw new Error("Method not implemented.");
    }

    getNoComponents(): number {
        throw new Error("Method not implemented.");
    }

    getComponent(i: number): string {
        throw new Error("Method not implemented.");
    }
    
    setComponent(i: number, c: string): Name {
        return this.doSetComponent(i, c);
    }
    protected abstract doSetComponent(i: number, c: string): Name

    insert(i: number, c: string): Name {
        return this.doInsert(i, c);
    }
    protected abstract doInsert(i: number, c: string): Name;

    append(c: string): Name {
        return this.doAppend(c);
    }
    protected abstract doAppend(c: string): Name;

    remove(i: number): Name {
        return this.doRemove(i);
    }
    protected abstract doRemove(i: number): Name;

    concat(other: Name): Name {
        return this.doConcat(other);
    }
    protected abstract doConcat(other: Name): Name;
}