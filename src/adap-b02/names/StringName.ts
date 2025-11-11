import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";


/**
 * String Name class represents a name as a single string
 */
export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    private special_characters: Set<string> = new Set([ESCAPE_CHARACTER]);

    constructor(source: string, delimiter?: string) {
        // TODO: refactor 
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.")
            }
            this.delimiter = delimiter;
            this.special_characters.add(delimiter);
        } else {
            this.special_characters.add(DEFAULT_DELIMITER);
        }

        this.setNoComponents(this.countNoComponents(source));
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
        // FIXME: USE delimiter
        //return this.asUnmaskedString(this.name);
        return this.asComponents().map(c => this.asUnmaskedString(c)).join(delimiter);
    }

    /**
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        let components = this.asComponents();
        return components.map(c => this.doPrepareDataString(c)).join(DEFAULT_DELIMITER)
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
        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }
        if (this.countNoComponents(c) != 1) {
            throw new Error("Component to set must be a single component");
        }

        let components = this.asComponents(this.name);
        components[n] = c;
        this.doIncrementNoComponents();
        this.name = components.join(this.delimiter);
    }

    private doIncrementNoComponents(n: number = 1): void {
        this.noComponents += n;
    }

    public insert(n: number, c: string): void {
        let components = this.asComponents(this.name);
        components.splice(n, 0, ... this.asComponents(c))
        this.name = components.join(this.delimiter)
        this.doIncrementNoComponents(this.countNoComponents(c));
    }

    public append(c: string): void {
        this.doIncrementNoComponents(this.countNoComponents(c));
        this.name = this.getNoComponents() === 0 ? c : this.name + this.delimiter + c;
    }

    public remove(n: number): void {
        let components = this.asComponents();
        components.splice(n, 1)
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        const delimiter = other.getDelimiterCharacter();
        let dataString = other.asDataString();

        if (other.isEmpty()) {
            // Nothing to do
            return
        }

        if (!this.special_characters.has(delimiter)) {
            dataString.replace(ESCAPE_CHARACTER + delimiter, delimiter)
        }
        // FIXME: dataString = cs.fau.de#com,io ; other.delim = "," ; this.delim = "#" -> cs#fau#de\\#com,io
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
        const regex = new RegExp('(?<!\\\\)\\.', 'g');
        return s.split(regex)
    }


    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }

    private doPrepareDataString(source: string): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            // nothing to prepare!
            return source;
        }
        if (this.delimiter === ESCAPE_CHARACTER) {
            // mask only Default Delimiters.
            return source.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        } else {
            // unmask unspecial delimiters and mask Default Delimiters;
            return source.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                         .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        }
    }

    public asComponents(name: string = this.name, delimiter: string = this.delimiter): string[] {
        let result: string[] = [];
        let component = "";
        let i = 0;
        name += "x";
        let special_characters: Set<string> = new Set([ESCAPE_CHARACTER]);
        special_characters.add(delimiter);

        while (i < name.length) {
            if (!special_characters.has(name[i])) {
                // normal char
                component += name[i];
                i++;
            } else if (name[i] === ESCAPE_CHARACTER && special_characters.has(name[i + 1])) {
                // it's a masked Special Character
                component += name[i] + name[i + 1];
                i += 2;
            } else {
                // it's a delimiter!
                i++;
                result.push(component);
                component = "";
            }
        }

        result.push(component.slice(0, -1));
        return result;
    }


    public countNoComponents(name: string): number {
        return this.asComponents(name).length;
    }
}