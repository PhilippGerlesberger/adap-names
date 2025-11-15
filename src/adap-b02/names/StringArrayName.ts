import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

/**
 * StringArrayName class uses a string[] as the internal representation of a name
 */
export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        this.initialize(other, delimiter);
    }

    private initialize(other: string[], delimiter?: string): void {
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.");
            }
            this.delimiter = delimiter;
        }
        this.components = other.map(c => this.toDataString(c));
    }

    // --------------------------------------------------------------------------------------------
    // String Representations
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(c => this.asUnmaskedString(c)).join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // --------------------------------------------------------------------------------------------
    // Getters and Setters
    // --------------------------------------------------------------------------------------------

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** Returns properly masked component string */
    public getComponent(i: number): string {
        return this.toSourceString(this.components[i]);
    }

    public setComponent(i: number, c: string): void {

        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    // --------------------------------------------------------------------------------------------
    // Command Methods (Mutators)
    // --------------------------------------------------------------------------------------------

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if (i < 0 || this.components.length < i) {
            throw new Error("Index to insert is out of bounds");
        }
        this.components.splice(i, 0, ... this.asDataComponents(c) );
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push( ... this.asDataComponents(c) );
    }

    public remove(i: number): void {
        if (i < 0 || this.components.length <= i) {
            throw new Error("Index to remove is out of bounds");
        }
        if (this.isEmpty()) {
            // Nothing to remove
            return;
        }
        // TODO: Decide whether removing the last component should be allowed
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(this.toDataString(other.getComponent(i), other.getDelimiterCharacter()));
        }
    }

    // --------------------------------------------------------------------------------------------
    // Private Masking Utilities
    // --------------------------------------------------------------------------------------------

    // -------------------------- Utility Functions - Components handling -------------------------

    // Converts source string to array of data components
    // Expects that source string is properly masked
    private asDataComponents(source: string, delimiter: string = this.delimiter): string[] {

        let result: string[] = [];
        let component: string = "";
        let isEscaped: boolean = false;

        // Split dataString by DEFAULT_DELIMITER while respecting escape characters
        for (let i = 0; i < source.length; i++) {
            if (isEscaped) {
                switch (source[i]) {
                    case ESCAPE_CHARACTER:
                        component += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                        break;    
                    case delimiter:
                        component += delimiter;
                        break;
                    default:
                        throw Error("source is not properly masked.");
                }
                isEscaped = false;
            } else {
                switch (source[i]) {
                    case ESCAPE_CHARACTER:
                        //component += ESCAPE_CHARACTER;
                        isEscaped = true;
                        break;
                    case delimiter:
                        result.push(component);
                        component = "";
                        break;
                    case DEFAULT_DELIMITER:
                        // this happens only if delimiter != DEFAULT_DELIMITER 
                        // so we need to escape it
                        component += ESCAPE_CHARACTER + DEFAULT_DELIMITER;
                        break;
                    default:
                        component += source[i];
                        break;
                }
            }
        }
        result.push(component);
        return result;
    }

    // ------------------------ Utility Functions - String representation -------------------------

    // Converts source string to data string format
    private toDataString(source: string, delimiter: string = this.delimiter): string {
        
        if (delimiter === DEFAULT_DELIMITER) {
            // source name is already in data string format
            return source;
        }

        let result = "";
        let isEscaped = false;

        for (let i = 0; i < source.length; i++) {
            if (isEscaped) {
                switch (source[i]) {
                    case ESCAPE_CHARACTER:
                        result += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                        break;    
                    case delimiter:
                        result += delimiter;
                        break;
                    default:
                        throw Error("source is not properly masked.");
                }
                isEscaped = false;
            } else {
                switch (source[i]) {
                    case ESCAPE_CHARACTER:
                        isEscaped = true;
                        break;
                    case DEFAULT_DELIMITER:
                        result += ESCAPE_CHARACTER + DEFAULT_DELIMITER;
                        break;
                    case delimiter:
                        result += DEFAULT_DELIMITER;
                        break;
                    default:
                        result += source[i];
                        break;
                }
            }
        }
        return result;
    }

    // Converts data string to source string format
    private toSourceString(dataString: string): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            // Source name and data string are identical
            return dataString;
        }

        return dataString.replaceAll(ESCAPE_CHARACTER + DEFAULT_DELIMITER, DEFAULT_DELIMITER)
                         .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
    }

    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of [ESCAPE_CHARACTER, DEFAULT_DELIMITER]) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }
}