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

    // --------------------------------------------------------------------------------------------
    // Getter and Setter
    // --------------------------------------------------------------------------------------------

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
        if (x < 0 || this.getNoComponents() < x) {
            throw new Error("Component index out of bounds");
        }
        return this.asComponents(this.name)[x];
    }

    public setComponent(n: number, c: string): void {
        // FIXME: string c could have delimiter characters
        let components: string[] = [];

        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }

        components = this.asComponents(this.name);
        components[n] = c;
        this.doIncrementNoComponents();
        this.name = components.join(this.delimiter);
    }

    private doIncrementNoComponents(): void {
        this.noComponents++;
    }

    public insert(n: number, c: string): void {
        // FIXME: string c could have delimiter characters
        let components: string[] = [];

        if (n < 0 || this.getNoComponents() < n) {
            throw new Error("Component index out of bounds");
        }

        // TODO: Use splice, slice and or concat instead of for loop and push
        for (let i = 0; i < n; i++) {
            components.push(this.getComponent(i));
        }
        components.push(c);
        for (let i = n; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }

        this.doIncrementNoComponents();
        this.name = components.join(this.delimiter);
    }

    public append(c: string): void {
        // FIXME string c could have delimiter characters
        this.doIncrementNoComponents();
        // TODO: Use ? operator
        if (this.getNoComponents() === 0) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
    }

    public remove(n: number): void {
        let components: string[] = [];

        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }
        // TODO: Use splice, slice and or concat instead of for loop and push
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (i !== n) {
                components.push(this.getComponent(i));
            }
        }

        this.noComponents--;
        this.name = components.join(this.delimiter);
    }

    public concat(other: Name): void {
        const delimiter = other.getDelimiterCharacter()
        let dataString = other.asDataString()

        if (other.getNoComponents() === 0) {
            // Nothing to do
            return
        }

        if (!this.special_characters.has(delimiter)) {
            dataString.replace(ESCAPE_CHARACTER + delimiter, delimiter)
        }

        // TODO: Use ? Operator
        if (this.getNoComponents() === 0) {
            this.name = dataString;
        } else {
            this.name += this.delimiter + dataString;
        }

        this.noComponents += other.getNoComponents();
    }

    // Utility functions
    // TODO: Use regex for splitting
    // TODO: Use splice, slice and or concat instead of for loop and push
    
    // TODO: Example usage for splitting with regex
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp
    public splitRegex(s: string): string[] {

        //const regex = new RegExp('(?<=${ESCAPE_CHARACTER})\\.');
        const regex = new RegExp('(?<!\\${ESCAPE_CHARACTER})\\.', 'g');
        //const regex = new RegExp('(?<!\\\\)\\.', 'g');

        
        return s.split(regex)
    }


    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }

    public asComponents(name: string): string[] {
        // TODO: Use regex for splitting
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
        // TODO: Use regex for counting
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