import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";


// TODO: Refactor 
// 1. Separate source string and data string handling
// 2. Use only data strings internally and convert source strings to data strings on input
// 3. Convert data strings to source strings on output
// 4. This will simplify a lot of code and make it more maintainable

/**
 * String Name class represents a name as a single string
 */
export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    private special_characters: Set<string> = new Set([ESCAPE_CHARACTER, DEFAULT_DELIMITER]);

    constructor(source: string, delimiter?: string) {
        // TODO: refactor 
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.")
            }
            this.delimiter = delimiter;  
        }
        this.setNoComponents(this.countNoComponents(source));
        this.name = this.toDataString(source);
    }

    private toDataString(source: string): string {
        
        if (this.delimiter === DEFAULT_DELIMITER) {
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
                    case this.delimiter:
                        result += this.delimiter;
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
                    case this.delimiter:
                        result += DEFAULT_DELIMITER;
                        break;
                    case DEFAULT_DELIMITER:
                        result += ESCAPE_CHARACTER + DEFAULT_DELIMITER;
                        break;
                    default:
                        result += source[i];
                        break;
                }
            }
        }
        return result;
    }

    // --------------------------------------------------------------------------------------------
    // String Representations
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        return this.asComponents().map(c => this.asUnmaskedString(c)).join(delimiter);
    }

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
        return this.toSourceString(this.asComponents()[x]);
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }
        if (this.countNoComponents(c) != 1) {
            throw new Error("Component to set must be a single component");
        }

        let components = this.asComponents();
        components[n] = this.toDataString(c);
        this.doIncrementNoComponents();
        this.name = components.join(DEFAULT_DELIMITER);
    }

    private doIncrementNoComponents(n: number = 1): void {
        this.noComponents += n;
    }

    public insert(n: number, c: string): void {
        let components = this.asComponents();
        components.splice(n, 0, ... this.asComponents(c));
        this.name = components.join(DEFAULT_DELIMITER);
        this.doIncrementNoComponents(this.countNoComponents(c));
    }

    public append(c: string): void {
        this.doIncrementNoComponents(this.countNoComponents(c));
        this.name = this.getNoComponents() === 0 ? this.toDataString(c) : this.name + this.delimiter + c;
    }

    public remove(n: number): void {
        let components = this.asComponents();
        components.splice(n, 1)
        this.name = components.join(DEFAULT_DELIMITER);
        this.noComponents--;
    }

    public concat(other: Name): void {
        let dataString = other.asDataString();
        const otherDelimiter = this.getDelimiterCharacter();

        if (other.isEmpty()) {
            // Nothing to do
            return
        }

        if (otherDelimiter !== this.delimiter) {
            dataString = dataString.replaceAll(this.delimiter, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        }

        this.doIncrementNoComponents(other.getNoComponents());
        this.name = this.isEmpty() ? dataString : this.name + DEFAULT_DELIMITER + dataString;
    }


    private asUnmaskedString(c: string): string {
        let ret = c;

        for (const sc of this.special_characters) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }

    private toSourceString(dataString: string): string {
        let result: string = "";

        if (this.delimiter === DEFAULT_DELIMITER) {
            // nothing to prepare!
            return dataString;
        }
        
        let components = this.asComponents();
        let tmp = components.map(c => c.replaceAll(ESCAPE_CHARACTER + DEFAULT_DELIMITER, DEFAULT_DELIMITER));
        tmp = tmp.map(c => c.replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter));
        result = tmp.join(this.delimiter)

        return result;
    }

    public asComponents(source?: string): string[] {
        // FIXME: Only use this function for data string and build a function to convert back to source string
        // FIXME: no x at the end!
        let name = source ? this.toDataString(source) : this.name;

        let result: string[] = [];
        let component = "";
        let i = 0;
        name += "x";
        let special_characters: Set<string> = new Set([ESCAPE_CHARACTER, DEFAULT_DELIMITER]);

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

    // --------------------------------------------------------------------------------------------
    // DUMP 
    // --------------------------------------------------------------------------------------------    

    private toSourceName(dataString: string, delimiter: string): string {
        // dataString = cs.fau.de#com,io ; other.delim = "," ; this.delim = "#" -> cs#fau#de\\#com,io

        let ret: string = ""
        const regex = new RegExp("(?<!\\\\)" + delimiter, 'g');

        ret = dataString
            .replaceAll(this.delimiter, "\\" + this.delimiter)
            .replaceAll(delimiter, this.delimiter)
            .replaceAll(regex, delimiter);


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
}