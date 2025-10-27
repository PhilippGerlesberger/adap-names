export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];
    private special_characters: Set<string> = new Set([ESCAPE_CHARACTER, DEFAULT_DELIMITER]);

    /** Expects that all Name components are properly masked */
    // @methodtype: Initialization method
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
    // @methodtype: Conversion method
    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(c => this.asUnmaskedString(c)).join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype: Conversion method
    public asDataString(): string {
        return this.components.join(this.delimiter);
    }

    // --------------------------------------------------------------------------------------------
    // Getters and Setters
    // --------------------------------------------------------------------------------------------

    /** Returns properly masked component string */
    // @methodtype: Get method
    public getComponent(i: number): string {
        return this.components[i];
    }

    // @methodtype: Set method
    public setComponent(i: number, c: string): void {
        if (!this.isProperlyMasked(c)) {
            throw new Error("Component to set is not properly masked");
        }
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     // @methodtype: Get method
     public getNoComponents(): number {
        return this.components.length;
    }

    // --------------------------------------------------------------------------------------------
    // Command Methods (Mutators)
    // --------------------------------------------------------------------------------------------

    /** Expects that new Name component c is properly masked */
    // @methodtype: Command method
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
    // @methodtype: Command method
    public append(c: string): void {
        if (!this.isProperlyMasked(c)) {
            throw new Error("Component to append is not properly masked");
        }
        this.components.push(c);
    }

    // @methodtype: Command method
    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index to remove is out of bounds");
        }
        this.components.splice(i, 1);
    }

    // --------------------------------------------------------------------------------------------
    // Private Parsing and Component
    // --------------------------------------------------------------------------------------------

    // @methodtype: Conversion method
    public asComponents(name: string): string[] {
        let ret: string[] = [];
        let current_component: string = "";
        let is_masked: boolean = false;

        for (const n of name) {
            if (!is_masked && n === this.delimiter) {
                // it's a real delimiter
                ret.push(current_component);
                current_component = "";
                continue;
            }
            if (n === ESCAPE_CHARACTER) {
                is_masked = !is_masked;
            }
            current_component += n;
        }

        ret.push(current_component);
        return ret;
    }

    // @methodtype: Comparison method
    public compareComponents(other: string[]): boolean {
        if (this.components.length !== other.length) {
            return false;
        }
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] !== other[i]) {
                console.log("Mismatch at index " + i + ": " + this.components[i] + " !== " + other[i]);
                return false;
            }
        }
        return true;
    }

    // --------------------------------------------------------------------------------------------
    // Private Masking Utilities
    // --------------------------------------------------------------------------------------------

    // @methodtype: Boolean query method
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

    // @methodtype: Conversion method
    private asMaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(sc, ESCAPE_CHARACTER + sc);
        }

        return ret;
    }

    // @methodtype: Conversion method
    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }
}
