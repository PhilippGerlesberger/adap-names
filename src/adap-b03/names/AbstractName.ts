import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { NameParser } from "../parser/NameParser";
import { Parser } from "../parser/Parser";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected nameParser: Parser;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character.");
        }
        this.delimiter = delimiter;
        this.nameParser = new NameParser(delimiter);
    }

    public clone(): Name {
        const clone = Object.create(Object.getPrototypeOf(this));
        return Object.assign(clone, this);
    }

    // --------------------------------------------------------------------------------------------
    // Printable Interface
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        let unmaskComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmaskComponent = this.nameParser.unmask(this.getComponent(i));
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
            const dataComponent = this.nameParser.remask(this.getComponent(i), DEFAULT_DELIMITER);
            dataComponents.push(dataComponent);
        }
        return dataComponents.join(DEFAULT_DELIMITER);
    }

    // --------------------------------------------------------------------------------------------
    // Equality Interface
    // --------------------------------------------------------------------------------------------

    public isEqual(other: Name): boolean {    
        return this.asDataString() === other.asDataString() &&
               this.getDelimiterCharacter() === other.getDelimiterCharacter() &&
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

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // ------------------------------------ Getter and Setter -------------------------------------

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    public getComponent(i: number): string {
        this.assertIndexExclusive(i);
        return this.doGetComponent(i);
    }

    protected abstract doGetComponent(i: number): string;

    public setComponent(i: number, c: string): void {
        this.assertIndexExclusive(i);
        this.doSetComponent(i, c);
    }

    protected abstract doSetComponent(i: number, c: string): void;

    // ------------------------------------ Mutation Methods --------------------------------------

    public insert(i: number, c: string): void {
        this.assertIndexInclusive(i);
        this.doInsert(i, c);
    }

    protected abstract doInsert(i: number, c: string): void;

    abstract append(c: string): void;

    public remove(i: number): void {
        this.assertIndexExclusive(i);
        this.doRemove(i);
    }

    protected abstract doRemove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            const otherComponent = other.getComponent(i);
            const otherDelimiter = other.getDelimiterCharacter();
            const component = this.nameParser.remask(otherComponent, this.delimiter, otherDelimiter)
            
            this.append(component);
        }
    }

    // --------------------------------------------------------------------------------------------
    // Utility Functions
    // --------------------------------------------------------------------------------------------

    /**
     * Asserts that the index is within existing component boundaries.
     * Valid range: 0 <= i < getNoComponents().
     *
     * @param i The index to check.
     * @throws Error if the index is out of bounds.
     */
    private assertIndexExclusive(i: number): void {
        if (i < 0 || this.getNoComponents() <= i) {
            throw new Error("Index out of bounds");
        }
    }
    
    /**
     * Asserts that the index is valid for insertion.
     * Valid range: 0 <= i <= getNoComponents().
     *
     * @param i The index to check.
     * @throws Error if the index is out of bounds.
     */
    private assertIndexInclusive(i: number): void {
        if (i < 0 || this.getNoComponents() < i) {
            throw new Error("Index out of bounds");
        }
    }
}