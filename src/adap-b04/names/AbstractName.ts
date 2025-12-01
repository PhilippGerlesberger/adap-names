import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { NameParser } from "../parser/NameParser";
import { Parser } from "../parser/Parser";
import { Name } from "./Name";
import { ExceptionType } from "../common/ExceptionType";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected nameParser: Parser;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));
        this.delimiter = delimiter;
        const nameParser = new NameParser();
        InvalidStateException.assert(nameParser != null);
        this.nameParser = nameParser;

        const newDelimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(newDelimiter));

        MethodFailedException.assert(newDelimiter == delimiter);
    }

    public clone(): Name {
        const proto = Object.create(Object.getPrototypeOf(this));
        const clone: Name = Object.assign(proto, this) as Name;    

        InvalidStateException.assert(this.isValidDelimiter(clone.getDelimiterCharacter()));
        this.assertIsValidNoComponents(clone.getNoComponents(), ExceptionType.CLASS_INVARIANT);

        MethodFailedException.assert(clone.isEqual(this));
        MethodFailedException.assert(clone.getHashCode() == this.getHashCode());
        MethodFailedException.assert(clone !== this);
    
        return clone as Name;
    }

    // --------------------------------------------------------------------------------------------
    // Printable Interface
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));

        let unmaskComponents: string[] = [];
        const noComponents = this.getNoComponents();
        this.assertIsValidNoComponents(noComponents, ExceptionType.CLASS_INVARIANT);

        for (let i = 0; i < noComponents; i++) {
            const maskedComponent = this.getComponent(i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(maskedComponent, delimiter, true));

            const unmaskComponent = this.nameParser.unmask(this.getComponent(i), delimiter);
            MethodFailedException.assert(this.nameParser.isProperlyUnmasked(unmaskComponent, maskedComponent, delimiter));

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
        this.assertIsValidNoComponents(noComponents, ExceptionType.CLASS_INVARIANT);
        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));

        for (let i = 0; i < noComponents; i++) {
            const component = this.getComponent(i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(component, delimiter, true));

            const dataComponent = this.nameParser.remask(this.getComponent(i), DEFAULT_DELIMITER, delimiter);
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
        IllegalArgumentException.assert(other != null);

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
        MethodFailedException.assert(this.isValidHashCode(hashCode));
        return hashCode;
    }

    // --------------------------------------------------------------------------------------------
    // Name Interface
    // --------------------------------------------------------------------------------------------

    public isEmpty(): boolean {
        const noComponents = this.getNoComponents();
        this.assertIsValidNoComponents(noComponents, ExceptionType.CLASS_INVARIANT);
        

        return noComponents === 0;
    }

    // ------------------------------------ Getter and Setter -------------------------------------

    public getDelimiterCharacter(): string {
        const delimiter = this.doGetDelimiterCharacter();
        MethodFailedException.assert(this.isValidDelimiter(delimiter));

        return delimiter;
    }

    protected doGetDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        const noComponents: number = this.doGetNoComponents();
        this.assertIsValidNoComponents(noComponents, ExceptionType.CLASS_INVARIANT);

        return noComponents;
    }

    protected abstract doGetNoComponents(): number;

    public getComponent(i: number): string {
        this.assertIsValidIndexExclusive(i, ExceptionType.PRECONDITION);

        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));
        
        const component = this.doGetComponent(i);

        InvalidStateException.assert(this.nameParser.isProperlyMasked(component, delimiter, true));

        return component;
    }

    protected abstract doGetComponent(i: number): string;

    public setComponent(i: number, c: string): void {
        this.assertIsValidIndexInclusive(i, ExceptionType.PRECONDITION);
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
        this.assertIsValidIndexInclusive(i, ExceptionType.PRECONDITION);
        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(c, delimiter, true));

        const oldNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(oldNoComponents, ExceptionType.CLASS_INVARIANT);

        this.doInsert(i, c);

        const newNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(newNoComponents, ExceptionType.CLASS_INVARIANT);

        MethodFailedException.assert(oldNoComponents + 1 == newNoComponents);
        const newC: string = this.doGetComponent(i);
        MethodFailedException.assert(newC == c);
    }

    protected abstract doInsert(i: number, c: string): void;

    public append(c: string) {
        const delimiter = this.getDelimiterCharacter();
        InvalidStateException.assert(this.isValidDelimiter(delimiter));
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(c, delimiter, true));

        const oldNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(oldNoComponents, ExceptionType.CLASS_INVARIANT);
        
        this.doAppend(c);

        const newNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(newNoComponents, ExceptionType.CLASS_INVARIANT);
        const newComponent: string = this.getComponent(newNoComponents - 1);
        InvalidStateException.assert(this.nameParser.isProperlyMasked(newComponent, delimiter, true));

        MethodFailedException.assert(oldNoComponents + 1 == newNoComponents);
        MethodFailedException.assert(c == newComponent);
    }

    protected abstract doAppend(c: string): void;

    public remove(i: number): void {
        this.assertIsValidIndexExclusive(i, ExceptionType.PRECONDITION);

        const oldNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(oldNoComponents, ExceptionType.CLASS_INVARIANT);

        this.doRemove(i);

        const newNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(newNoComponents, ExceptionType.CLASS_INVARIANT);

        MethodFailedException.assert(this.isValidRemove(oldNoComponents, newNoComponents));
    }

    protected abstract doRemove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(other != null);

        const oldNoComponents: number = this.getNoComponents();
        const otherNoComponents: number = other.getNoComponents();
        const otherDelimiter = other.getDelimiterCharacter();
        const thisDelimiter = this.getDelimiterCharacter();

        this.assertIsValidNoComponents(oldNoComponents, ExceptionType.CLASS_INVARIANT);
        this.assertIsValidNoComponents(otherNoComponents, ExceptionType.CLASS_INVARIANT);
        InvalidStateException.assert(this.isValidDelimiter(otherDelimiter));
        InvalidStateException.assert(this.isValidDelimiter(thisDelimiter));

        for (let i = 0; i < otherNoComponents; i++) {
            const otherComponent: string = other.getComponent(i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(otherComponent, otherDelimiter, true));
    
            const component = this.nameParser.remask(otherComponent, thisDelimiter, otherDelimiter)
            InvalidStateException.assert(this.nameParser.isProperlyMasked(component, thisDelimiter, true));
            
            this.doAppend(component);

            const currentComponent: string = this.getComponent(oldNoComponents + i);
            InvalidStateException.assert(this.nameParser.isProperlyMasked(currentComponent, thisDelimiter, true));

            MethodFailedException.assert(currentComponent == component);
        }

        const newNoComponents: number = this.getNoComponents();
        this.assertIsValidNoComponents(newNoComponents, ExceptionType.CLASS_INVARIANT);

        MethodFailedException.assert(newNoComponents == oldNoComponents + otherNoComponents);
    }

    // --------------------------------------------------------------------------------------------
    // Utility Functions
    // --------------------------------------------------------------------------------------------

    private isValidHashCode(c: number): boolean {
        const intMin32: number = -(2**31);
        const intMax32: number = 2**31 - 1;
        
        return intMin32 <= c && c <= intMax32;
    }

    protected isValidDelimiter(delimiter: string) {
        return delimiter.length === 1;
    }

    protected assertIsValidNoComponents(noComponents: number, et: ExceptionType): void {
        return this.assertIsPositivInteger(noComponents, et);
    }

    protected assertIsValidIndexExclusive(idx: number, et: ExceptionType): void {
        const noComponents = this.doGetNoComponents();
        switch (et) {
            case ExceptionType.PRECONDITION:
                IllegalArgumentException.assert(idx < noComponents);
                break;

            case ExceptionType.CLASS_INVARIANT:
                InvalidStateException.assert(idx < noComponents);
                break;

            case ExceptionType.POSTCONDITION:
                MethodFailedException.assert(idx < noComponents);
                break;
            
            default:
                throw new Error("error");
        }

        this.assertIsPositivInteger(idx,et);
    }

    protected assertIsValidIndexInclusive(idx: number, et: ExceptionType): void {
        const noComponents = this.doGetNoComponents();
        switch (et) {
            case ExceptionType.PRECONDITION:
                IllegalArgumentException.assert(idx <= noComponents);
                break;

            case ExceptionType.CLASS_INVARIANT:
                InvalidStateException.assert(idx <= noComponents);
                break;

            case ExceptionType.POSTCONDITION:
                MethodFailedException.assert(idx <= noComponents);
                break;
            
            default:
                throw new Error("error");
        }

        this.assertIsPositivInteger(idx,et);
    }

    protected assertIsPositivInteger(noComponents: number, et: ExceptionType): void {
        switch (et) {
            case ExceptionType.PRECONDITION:
                IllegalArgumentException.assert(Number.isFinite(noComponents));
                IllegalArgumentException.assert(Number.isInteger(noComponents));
                IllegalArgumentException.assert(0 <= noComponents);
                break;
            case ExceptionType.CLASS_INVARIANT:
                InvalidStateException.assert(Number.isFinite(noComponents));
                InvalidStateException.assert(Number.isInteger(noComponents));
                InvalidStateException.assert(0 <= noComponents);
                break;
            case ExceptionType.POSTCONDITION:
                MethodFailedException.assert(Number.isFinite(noComponents));
                MethodFailedException.assert(Number.isInteger(noComponents));
                MethodFailedException.assert(0 <= noComponents);
                break;
            default:
                throw new Error("error");
        }
    }

    protected isValidRemove(oldNoComponents: number, newNoComponents: number): boolean {
        return oldNoComponents - 1 == newNoComponents;
    }
}