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
    private mask: string = ESCAPE_CHARACTER;
    private masked_delimiter : string = ESCAPE_CHARACTER + DEFAULT_DELIMITER;
    private masked_escape : string = ESCAPE_CHARACTER + ESCAPE_CHARACTER;

    /** Expects that all Name components are properly masked */
    // @methodtype: Initialization method
    constructor(other: string[], delimiter?: string) {
        this.delimiter = delimiter ? delimiter : DEFAULT_DELIMITER;
        if (this.delimiter === ESCAPE_CHARACTER) {
            this.mask = "#";
            this.masked_delimiter = "#" + this.delimiter;
            this.masked_escape = "#" + ESCAPE_CHARACTER;
        }
        for (let c of other) {
            if (!this.isProperlyMasked(c)) {
                throw new Error("Component " + c + " to initialize is not properly masked");
            }
        }
        this.components = other.slice();
    }

    // @methodtype: Boolean query method
    public isProperlyMasked(a: string): boolean {
        const c = a.replaceAll(this.masked_escape, '')
                    .replaceAll(this.masked_delimiter, '')
                    .replaceAll(this.mask + this.mask, '');
        for (let i = 0; i < c.length; i++) {
            if (c.charAt(i) === this.delimiter || c.charAt(i) === ESCAPE_CHARACTER || c.charAt(i) === this.mask) {
                return false;
            }
        }
        return true;
    }

    private unmaskComponent(c: string): string {
        let ret = c
            .replaceAll(this.masked_escape, ESCAPE_CHARACTER)
            .replaceAll(this.masked_delimiter, this.delimiter);

        if (this.mask === "#") {
            ret = ret.replaceAll(this.mask + this.mask, this.mask);
        }

        return ret;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(c => this.unmaskComponent(c)).join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.components.join(this.delimiter);
    }

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
        if (i < 0 || i > this.components.length) {
            throw new Error("Index to remove is out of bounds");
        }
        this.components.splice(i, 1);
    }
}
