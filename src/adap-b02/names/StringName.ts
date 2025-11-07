import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";


/**
 * String Name class represents a name as a single string
 */
export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    private special_characters: Set<string> = new Set([ESCAPE_CHARACTER, DEFAULT_DELIMITER]);

    constructor(source: string, delimiter?: string) {
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.")
            }
            this.delimiter = delimiter;
            this.special_characters.add(delimiter);
        }

        this.setNoComponents(this.countNoComponents());
        this.name = source.slice();
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
        return this.asUnmaskedString(this.name);
    }

    /**
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    private setNoComponents(n: number): void {
        if (n < 0) {
            throw new Error("Number of components must be a positive integer");
        }
        this.noComponents = n;
    }

    public getComponent(x: number): string {
        throw new Error("needs implementation or deletion");
    }

    public setComponent(n: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public insert(n: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public append(c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public remove(n: number): void {
        throw new Error("needs implementation or deletion");
    }

    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }

    // Utility functions

    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }

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

    private countNoComponents(): number {
        let ret = 0;
        let is_masked: boolean = false;

        for (const n of this.name) {
            if (!is_masked && n === this.delimiter) {
                // it's a real delimiter
                ret++;
                continue;
            }
            if (n === ESCAPE_CHARACTER) {
                is_masked = !is_masked;
            }
        }

        return ret;
    }
}