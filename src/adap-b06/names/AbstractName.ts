import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { NameParser } from "../parser/NameParser";
import { Parser } from "../parser/Parser";
import { Name } from "./Name";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected nameParser: Parser;

    constructor (delimiter?: string) {
        if (delimiter) {
            this.delimiter = delimiter;
        }
        this.nameParser = new NameParser();
    }

    clone(): Name {
        throw new Error("Method not implemented.");
    }

    // --------------------------------------------------------------------------------------------
    // Printable Interface
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        let unmaskComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmaskComponent = this.nameParser.unmask(this.getComponent(i), this.delimiter);
            unmaskComponents.push(unmaskComponent);
        }
        return unmaskComponents.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let dataComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const dataComponent = this.nameParser.remask(this.getComponent(i), DEFAULT_DELIMITER, this.delimiter);
            dataComponents.push(dataComponent);
        }
        return dataComponents.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // --------------------------------------------------------------------------------------------
    // Equality Interface
    // --------------------------------------------------------------------------------------------
    
    public isEqual(other: Name): boolean {    
        return this.asDataString() == other.asDataString() &&
               this.getDelimiterCharacter() == other.getDelimiterCharacter() &&
               this.getNoComponents() == other.getNoComponents();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // --------------------------------------------------------------------------------------------
    // Name Interface
    // --------------------------------------------------------------------------------------------

    isEmpty(): boolean {
        return this.getNoComponents() == 0;
    }

    public getNoComponents(): number {
        return this.doGetNoComponents();
    }
    protected abstract doGetNoComponents(): number;

    public getComponent(i: number): string {
        return this.doGetComponent(i);
    }
    protected abstract doGetComponent(i: number): string;
    
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