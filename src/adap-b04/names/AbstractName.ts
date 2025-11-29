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
        const noComponents = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(noComponents));

        for (let i = 0; i < noComponents; i++) {
            const maskedComponent = this.getComponent(i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(maskedComponent, delimiter, true));

            const unmaskComponent = this.nameParser.unmask(this.getComponent(i));
            MethodFailedException.assert(this.nameParser.isProperlyUnmasked(unmaskComponent, maskedComponent));

            unmaskComponents.push(unmaskComponent);
        }

        const result: string = unmaskComponents.join(delimiter);

        return result;
    }

    public toString(): string {
        const result = this.asDataString();
        MethodFailedException.assert(this.nameParser.isProperlyMasked(result, DEFAULT_DELIMITER));

        return result;
    }

    public asDataString(): string {
        let dataComponents: string[] = [];
        const noComponents = this.getNoComponents();
        MethodFailedException.assert(this.isValidNoComponents(noComponents));

        // TODO: no delimiter needed
        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));

        for (let i = 0; i < noComponents; i++) {
            const component = this.getComponent(i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(component, delimiter, true));

            const dataComponent = this.nameParser.remask(this.getComponent(i), DEFAULT_DELIMITER);
            MethodFailedException.assert(this.nameParser.isProperlyMasked(dataComponent, DEFAULT_DELIMITER, true));

            dataComponents.push(dataComponent);
        }

        const result: string = dataComponents.join(DEFAULT_DELIMITER);

        return result;
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
        InvalidStateException.assert(this.nameParser.isProperlyMasked(s, DEFAULT_DELIMITER))
        
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
        const noComponents = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(noComponents));

        return noComponents === 0;
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
        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(c, delimiter, true));

        this.doSetComponent(i, c);
        
        const newC: string = this.doGetComponent(i);
        InvalidStateException.assert(this.nameParser.isProperlyMasked(newC, delimiter, true));

        MethodFailedException.assert(newC == c);
    }

    protected abstract doSetComponent(i: number, c: string): void;

    // ------------------------------------ Mutation Methods --------------------------------------

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(this.isValidIndexInclusive(i));
        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(c, delimiter, true));

        const oldNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(oldNoComponents));

        this.doInsert(i, c);

        const newNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(newNoComponents));

        MethodFailedException.assert(oldNoComponents + 1 == newNoComponents);
        const newC: string = this.doGetComponent(i);
        MethodFailedException.assert(newC == c);
    }

    protected abstract doInsert(i: number, c: string): void;

    abstract append(c: string): void;

    public remove(i: number): void {
        IllegalArgumentException.assert(this.isValidIndexExclusive(i));

        const oldNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(oldNoComponents));

        this.doRemove(i);

        const newNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(newNoComponents));

        MethodFailedException.assert(this.isValidRemove(oldNoComponents, newNoComponents));
    }

    protected abstract doRemove(i: number): void;

    public concat(other: Name): void {
        // TODO: Precondition: Check Name
        const oldNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(oldNoComponents));
        const otherNoComponents: number = other.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(otherNoComponents));
        const otherDelimiter = other.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(otherDelimiter));
        const thisDelimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(thisDelimiter));

        for (let i = 0; i < otherNoComponents; i++) {
            const otherComponent: string = other.getComponent(i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(otherComponent, otherDelimiter, true));
    
            const component = this.nameParser.remask(otherComponent, thisDelimiter, otherDelimiter)
            InvalidStateException.assert(this.nameParser.isProperlyMasked(component, thisDelimiter, true));
            
            this.append(component);

            const currentComponent: string = this.getComponent(oldNoComponents + i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(currentComponent, thisDelimiter, true));

            MethodFailedException.assert(currentComponent == component);
        }

        const newNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(newNoComponents));

        MethodFailedException.assert(newNoComponents == oldNoComponents + otherNoComponents);
    }

    // --------------------------------------------------------------------------------------------
    // Utility Functions
    // --------------------------------------------------------------------------------------------

    protected isValidDelimiter(delimiter: string) {
        return delimiter.length === 1;
    }

    protected isValidNoComponents(noComponents: number): boolean {
        return 0 <= noComponents;
    }

    protected isValidRemove(oldNoComponents: number, newNoComponents: number): boolean {
        if (oldNoComponents == 0 && newNoComponents == 0) {
            return true;
        }
        return oldNoComponents - 1 == newNoComponents;
    }

    /**
     * Asserts that the index is within existing component boundaries.
     * Valid range: 0 <= i < getNoComponents().
     *
     * @param i The index to check.
     * @throws Error if the index is out of bounds.
     */
    protected isValidIndexExclusive(idx: number): boolean {
        return 0 <= idx && idx < this.getNoComponents();
    }
    
    /**
     * Asserts that the index is valid for insertion.
     * Valid range: 0 <= i <= getNoComponents().
     *
     * @param i The index to check.
     * @throws Error if the index is out of bounds.
     */
    protected isValidIndexInclusive(i: number): boolean {
        return 0 <= i && i <= this.getNoComponents();
    }
}