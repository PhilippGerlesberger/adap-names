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

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));
        this.delimiter = delimiter;
        this.nameParser = new NameParser(delimiter);

        // TODO: Class invariant: nameParser
        const newDelimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(newDelimiter));

        MethodFailedException.assert(newDelimiter == delimiter);
    }

    public clone(): Name {
        const clone = Object.create(Object.getPrototypeOf(this));
        // TODO: Postcondition: Name object created?
        // TODO: Class invarianz: check clone (isEqual, hashcode?)
        return Object.assign(clone, this);
        
    }

    // --------------------------------------------------------------------------------------------
    // Printable Interface
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));
        let unmaskComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const unmaskComponent = this.nameParser.unmask(this.getComponent(i));
            unmaskComponents.push(unmaskComponent);
        }
        // TODO: Class invariant: valid unmask string?
        return unmaskComponents.join(delimiter);
    }

    public toString(): string {
        // TODO: Postcondition
        return this.asDataString();
    }

    public asDataString(): string {
        let dataComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const dataComponent = this.nameParser.remask(this.getComponent(i), DEFAULT_DELIMITER);
            dataComponents.push(dataComponent);
        }
        // TODO: class invariant: valid data string?
        return dataComponents.join(DEFAULT_DELIMITER);
    }

    // --------------------------------------------------------------------------------------------
    // Equality Interface
    // --------------------------------------------------------------------------------------------

    public isEqual(other: Name): boolean {
        // TODO: Precondition: valid other Name?   
        return this.asDataString() === other.asDataString() &&
               this.getDelimiterCharacter() === other.getDelimiterCharacter() &&
               this.getNoComponents() == other.getNoComponents();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        // TODO: Postcondition
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        // TODO: Class invarianz
        return hashCode;
    }

    // --------------------------------------------------------------------------------------------
    // Name Interface
    // --------------------------------------------------------------------------------------------

    public isEmpty(): boolean {
        // TODO: Postcondition: valid no of components
        return this.getNoComponents() === 0;
    }

    // ------------------------------------ Getter and Setter -------------------------------------

    public getDelimiterCharacter(): string {
        // TODO: Precondition valid delim
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this.isValidIndexExclusive(i));
        // TODO: Class invarianz: valid component
        return this.doGetComponent(i);
    }

    protected abstract doGetComponent(i: number): string;

    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(this.isValidIndexExclusive(i));
        this.doSetComponent(i, c);
        // TODO: Class invarianz: valid component
    }

    protected abstract doSetComponent(i: number, c: string): void;

    // ------------------------------------ Mutation Methods --------------------------------------

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(this.isValidIndexInclusive(i));
        this.doInsert(i, c);
        // TODO: Class invarianz: valid string
    }

    protected abstract doInsert(i: number, c: string): void;

    abstract append(c: string): void;

    public remove(i: number): void {
        IllegalArgumentException.assert(this.isValidIndexExclusive(i));
        this.doRemove(i);
        // TODO: Class invarianz: valid string
    }

    protected abstract doRemove(i: number): void;

    public concat(other: Name): void {
        // TODO: Precondition: Check Name
        for (let i = 0; i < other.getNoComponents(); i++) {
            const otherComponent = other.getComponent(i);
            // TODO: Postcondtion: valid component
            const otherDelimiter = other.getDelimiterCharacter();
            // TODO: Postcondtion: valid delim
            const component = this.nameParser.remask(otherComponent, this.delimiter, otherDelimiter)
            // TODO: Postcondtion: valid component
            this.append(component);
            // TODO: Class invarianz: valid string
        }
    }

    // --------------------------------------------------------------------------------------------
    // Utility Functions
    // --------------------------------------------------------------------------------------------

    private isValidDelimiter(delimiter: string) {
        return delimiter.length === 1;
    }

    /**
     * Asserts that the index is within existing component boundaries.
     * Valid range: 0 <= i < getNoComponents().
     *
     * @param i The index to check.
     * @throws Error if the index is out of bounds.
     */
    private isValidIndexExclusive(idx: number): boolean {
        return 0 <= idx && idx < this.getNoComponents();
    }
    
    /**
     * Asserts that the index is valid for insertion.
     * Valid range: 0 <= i <= getNoComponents().
     *
     * @param i The index to check.
     * @throws Error if the index is out of bounds.
     */
    private isValidIndexInclusive(i: number): boolean {
        return 0 <= i && i <= this.getNoComponents();
    }
}