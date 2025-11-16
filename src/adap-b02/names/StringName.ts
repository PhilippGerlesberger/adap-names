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
        this.initialize(source, delimiter);
    }

    private initialize(source: string, delimiter?: string): void {
        if (delimiter) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character.");
            }
            this.delimiter = delimiter;
        }
        this.name = this.toDataString(source);
        this.noComponents = this.countComponents(this.name);
    }

    // --------------------------------------------------------------------------------------------
    // String Representations
    // --------------------------------------------------------------------------------------------

    public asString(delimiter: string = this.delimiter): string {
        return this.splitDataString().map(c => this.unescapeComponent(c)).join(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
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

    public getComponent(x: number): string {
        if (x < 0 || this.getNoComponents() <= x) {
            throw new Error("Component index out of bounds");
        }
        return this.maskComponent(this.splitDataString()[x]);
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }

        const dataString = this.toDataString(c);

        if (this.countComponents(dataString) != 1) {
            throw new Error("Component to set must be a single component");
        }

        let components = this.splitDataString();
        components[n] = dataString;
        this.name = components.join(DEFAULT_DELIMITER);
    }

    // --------------------------------------------------------------------------------------------
    // Command Methods (Mutators)
    // --------------------------------------------------------------------------------------------

    public insert(n: number, c: string): void {
        if (n < 0 || this.getNoComponents() < n) {
            throw new Error("Component index out of bounds");
        }

        const dataString = this.toDataString(c);
        const dataComponents = this.splitDataString(dataString);
        
        if (this.isEmpty()) {
            this.name = dataString;
        } else {
            let components = this.splitDataString();
            components.splice(n, 0, ... dataComponents);
            this.name = components.join(DEFAULT_DELIMITER);
        }

        this.incrementNoComponents(dataComponents.length);
    }

    public append(c: string): void {
        const dataString = this.toDataString(c);
        this.name = this.isEmpty() ? dataString : this.name + DEFAULT_DELIMITER + dataString;
        this.incrementNoComponents(this.countComponents(dataString));
    }

    public remove(n: number): void {
        if (n < 0 || this.getNoComponents() <= n) {
            throw new Error("Component index out of bounds");
        }
        let components = this.splitDataString();
        components.splice(n, 1)
        this.name = components.join(DEFAULT_DELIMITER);
        this.decrementNoComponents();
    }

    public concat(other: Name): void {
        if (other.isEmpty()) {
            // Nothing to concat
            return;
        }

        const otherDataString = other.asDataString();

        this.name = this.isEmpty() ? otherDataString : this.name + DEFAULT_DELIMITER + otherDataString;
        this.incrementNoComponents(other.getNoComponents());
    }

    // --------------------------------------------------------------------------------------------
    // Private Utility Functions
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
            if (this.delimiter === ESCAPE_CHARACTER) {
                if (isEscaped) {
                    switch (source[i]) {
                        case ESCAPE_CHARACTER:
                            result += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                            break;
                        case DEFAULT_DELIMITER:
                            result += DEFAULT_DELIMITER + ESCAPE_CHARACTER + DEFAULT_DELIMITER;
                            break;
                        default:
                            result += DEFAULT_DELIMITER + source[i];
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
                        default:
                            result += source[i];
                            break;
                    }
                }
            } else {
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
        }

        if (isEscaped) {
            throw Error("source is not properly masked.");
        }

        return result;
    }

    // Converts data string to source string format
    private maskComponent(dataString: string): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            // Source string and data string are identical
            return dataString;
        } else if (this.delimiter === ESCAPE_CHARACTER) {
            return dataString.replaceAll(ESCAPE_CHARACTER + DEFAULT_DELIMITER, DEFAULT_DELIMITER);
        } else {
            return dataString.replaceAll(ESCAPE_CHARACTER + DEFAULT_DELIMITER, DEFAULT_DELIMITER)
                             .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
        }
    }

    // Removes escape characters from special characters in data string component
    // Expects that dataString is a single component and in the correct format
    private unescapeComponent(dataString: string): string {
        return dataString.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER)
                         .replaceAll(ESCAPE_CHARACTER + DEFAULT_DELIMITER, DEFAULT_DELIMITER);
    }

    // -------------------------- Utility Functions - Components handling -------------------------

    // Converts data string to array of data string components
    private splitDataString(dataString: string = this.name): string[] {

        // Source given -> convert source to data string first
        //const dataString = source !== this.name ? this.toDataString(source) : this.name;
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

    // Counts number of components in data string
    private countComponents(dataString: string): number {
        return this.splitDataString(dataString).length;
    }

    // Increments number of components by n
    private incrementNoComponents(n: number = 1): void {
        this.noComponents += n;
    }

    // Decrements number of components
    private decrementNoComponents(): void {
        this.noComponents--;
    }
}