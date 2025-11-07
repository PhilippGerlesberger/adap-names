import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

/**
 * StringArrayName class uses a string[] as the internal representation of a name
 */
export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];
    private special_characters: Set<string> = new Set([ESCAPE_CHARACTER, DEFAULT_DELIMITER]);

    constructor(other: string[], delimiter?: string) {
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.")
            }
            this.delimiter = delimiter;
            this.special_characters.add(delimiter);
        }
        for (let c of other) {
            if (!this.isProperlyMasked(c)) {
                throw new Error("Component " + c + " to initialize is not properly masked");
            }
        }
        this.components = other.slice();
    }

    // --------------------------------------------------------------------------------------------
    // String Representations
    // --------------------------------------------------------------------------------------------

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(c => this.asUnmaskedString(c)).join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.components.join(this.delimiter);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    // --------------------------------------------------------------------------------------------
    // Getters and Setters
    // --------------------------------------------------------------------------------------------

    /** Returns properly masked component string */
    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (!this.isProperlyMasked(c)) {
            throw new Error("Component to set is not properly masked");
        }
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
        if (i < 0 || i > this.components.length) {
            throw new Error("Index to insert is out of bounds");
        }
        if (!this.isProperlyMasked(c)) {
            throw new Error("Component to insert is not properly masked");
        }
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        if (!this.isProperlyMasked(c)) {
            throw new Error("Component to append is not properly masked");
        }
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index to remove is out of bounds");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i))
        }
    }

    // --------------------------------------------------------------------------------------------
    // Private Masking Utilities
    // --------------------------------------------------------------------------------------------

    private isProperlyMasked(c: string): boolean {
        let remaining = c;

        for (const sc of this.special_characters) {
            remaining = remaining.replaceAll(ESCAPE_CHARACTER + sc, "");
        }

        for (const r of remaining) {
            if (this.special_characters.has(r)) {
                return false;
            }
        }

        return true;
    }

    private asMaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(sc, ESCAPE_CHARACTER + sc);
        }

        return ret;
    }

    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }
}