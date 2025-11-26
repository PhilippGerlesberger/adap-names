import { ESCAPE_CHARACTER } from "../common/Printable";
import { Parser } from "./Parser";


export class NameParser implements Parser {
    protected delimiter;

    constructor(delimiter: string) {
        this.delimiter = delimiter;
    }

    public mask(component: string): string {
        throw new Error("Method not implemented.");
    }

    public unmask(component: string): string {
        if (this.delimiter === ESCAPE_CHARACTER) {
            return component.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
        } else {
            return component.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER)
                            .replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter);
        }
    }

    public remask(component: string, toDelimiter: string, fromDelimiter: string = this.delimiter): string {
                
        if (fromDelimiter === toDelimiter) {
            return component;
        }

        let result = component;

        if (fromDelimiter !== ESCAPE_CHARACTER) {
            result = result.replaceAll(ESCAPE_CHARACTER + fromDelimiter, fromDelimiter);
        }
        if (toDelimiter !== ESCAPE_CHARACTER) {
            result = result.replaceAll(toDelimiter, ESCAPE_CHARACTER + toDelimiter);
        }

        return result;
    }

    public split(source: string): string[] {
        const delimiter = this.getDelimiterCharacter();
        let result: string[] = [];
        let component: string = "";
        let isEscaped: boolean = false;

        // Split source by delimiter while respecting escape characters
        for (let i = 0; i < source.length; i++) {
            if (delimiter === ESCAPE_CHARACTER) {
                if (isEscaped) {
                    if (source[i] === ESCAPE_CHARACTER) {
                        component += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                    } else {
                        result.push(component);
                        component = source[i];
                    }
                    isEscaped = false;
                } else {
                    if (source[i] == ESCAPE_CHARACTER) {
                        isEscaped = true;
                    } else {
                        component += source[i];
                    }
                }
            } else {
                if (isEscaped) {
                    component += source[i];
                    isEscaped = false;
                } else {
                    switch (source[i]) {
                        case ESCAPE_CHARACTER:
                            component += ESCAPE_CHARACTER;
                            isEscaped = true;
                            break;
                        case delimiter:
                            result.push(component);
                            component = "";
                            break;
                        default:
                            component += source[i];
                            break;
                    }
                }
            }
        }
        result.push(component);
        return result;
    }

    private getDelimiterCharacter(): string {
        return this.delimiter;
    }
}

