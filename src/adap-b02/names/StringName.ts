import { inherits } from "util";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";


/**
 * String Name class represents a name as a single string
 */
export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.")
            }
            this.delimiter = delimiter;  
        }
        this.setNoComponents(this.countNoComponents(source));
        this.name = this.toDataString(source);
    }

    // --------------------------------------------------------------------------------------------
    // String Representations
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        return this.asDataComponents().map(c => this.asUnmaskedString(c)).join(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public isEmpty(): boolean {
        return this.name === "";
    }

    // --------------------------------------------------------------------------------------------
    // Getter and Setter
    // --------------------------------------------------------------------------------------------

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    // sets number of components
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
        return this.toSourceString(this.asDataComponents()[x]);
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }
        if (this.countNoComponents(c) != 1) {
            throw new Error("Component to set must be a single component");
        }

        let components = this.asDataComponents();
        components[n] = this.toDataString(c);
        this.name = components.join(DEFAULT_DELIMITER);
    }

    // --------------------------------------------------------------------------------------------
    // Modification Functions
    // --------------------------------------------------------------------------------------------

    public insert(n: number, c: string): void {
        if (n < 0 || this.getNoComponents() < n) {
            throw new Error("Component index out of bounds");
        }
        let components = this.asDataComponents();
        components.splice(n, 0, ... this.asDataComponents(c));
        this.name = components.join(DEFAULT_DELIMITER);
        this.doIncrementNoComponents(this.countNoComponents(c));
    }

    public append(c: string): void {
        this.doIncrementNoComponents(this.countNoComponents(c));
        this.name = this.getNoComponents() === 0 ? this.toDataString(c) : this.name + this.delimiter + c;
    }

    public remove(n: number): void {
        let components = this.asDataComponents();
        components.splice(n, 1)
        this.name = components.join(DEFAULT_DELIMITER);
        this.noComponents--;
    }

    public concat(other: Name): void {
        this.doIncrementNoComponents(other.getNoComponents());
        this.name = this.name + DEFAULT_DELIMITER + other.asDataString();
    }

    // --------------------------------------------------------------------------------------------
    // Pricate Utility Functions
    // --------------------------------------------------------------------------------------------

    // ------------------------ Utility Functions - String representation -------------------------

    // Converts source string to data string format
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

    // Converts data string to source string format
    private toSourceString(dataString: string): string {
        let result: string = "";

        if (this.delimiter === DEFAULT_DELIMITER) {
            // Source name and data string are identical
            return dataString;
        }
        
        let components = this.asDataComponents();
        let tmp = components.map(c => c.replaceAll(ESCAPE_CHARACTER + DEFAULT_DELIMITER, DEFAULT_DELIMITER));
        tmp = tmp.map(c => c.replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter));
        result = tmp.join(this.delimiter)

        return result;
    }

    // Removes escape characters from special characters in data string component
    // Expects that dataString is a single component and in the correct format
    private asUnmaskedString(dataString: string): string {
        let ret = dataString;

        for (const sc of [ESCAPE_CHARACTER, DEFAULT_DELIMITER]) {
            ret = ret.replaceAll(ESCAPE_CHARACTER + sc, sc);
        }

        return ret;
    }

    // -------------------------- Utility Functions - Components handling -------------------------

    // Converts source string to array of data components
    private asDataComponents(source: string = this.name): string[] {

        // Source given -> convert source to data string first
        const dataString = source !== this.name ? this.toDataString(source) : this.name;
        let result: string[] = [];
        let component: string = "";
        let isEscaped: boolean = false;

        // Split dataString by DEFAULT_DELIMITER while respecting escape characters
        for (let i = 0; i < dataString.length; i++) {
            if (isEscaped) {
                switch (dataString[i]) {
                    case ESCAPE_CHARACTER:
                        component += ESCAPE_CHARACTER;
                        break;    
                    case DEFAULT_DELIMITER:
                        component += DEFAULT_DELIMITER;
                        break;
                    default:
                        throw Error("source is not properly masked.");
                }
                isEscaped = false;
            } else {
                switch (dataString[i]) {
                    case ESCAPE_CHARACTER:
                        component += ESCAPE_CHARACTER;
                        isEscaped = true;
                        break;
                    case DEFAULT_DELIMITER:
                        result.push(component);
                        component = "";
                        break;
                    default:
                        component += dataString[i];
                        break;
                }
            }
        }
        result.push(component);
        return result;
    }

    // Counts number of components in source string
    private countNoComponents(name: string): number {
        return this.asDataComponents(name).length;
    }

    // Increments number of components by n
    private doIncrementNoComponents(n: number = 1): void {
        this.noComponents += n;
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