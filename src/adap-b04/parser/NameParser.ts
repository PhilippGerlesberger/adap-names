import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Parser } from "./Parser";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";


export class NameParser implements Parser {
    protected delimiter;

    constructor(delimiter: string) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter));
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
        IllegalArgumentException.assert(this.isValidDelimiter(toDelimiter));
        IllegalArgumentException.assert(this.isValidDelimiter(fromDelimiter));
        IllegalArgumentException.assert(this.isProperlyMasked(component, fromDelimiter, true));
                
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

        MethodFailedException.assert(this.isProperlyMasked(result, toDelimiter, true));
        return result;
    }

    public split(source: string): string[] {
        const delimiter = this.getDelimiterCharacter();
        IllegalArgumentException.assert(this.isProperlyMasked(source, delimiter));
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

    public isProperlyMasked(name: string, delimiter: string, isComponent: boolean = false): boolean {

        let isEscaped: boolean = false;

        if (isComponent && delimiter == ESCAPE_CHARACTER) {
            for (let c of name) {
                if (isEscaped) {
                    if (c != ESCAPE_CHARACTER) {
                        return false;
                    }
                    isEscaped = false;
                } else {
                    if (c == ESCAPE_CHARACTER) {
                        isEscaped = true;
                    }
                }
            }
            // check if there is a dangeling ESCAPE CHARACTER
            return isEscaped ? false : true;
        }
        if (!isComponent && delimiter == ESCAPE_CHARACTER) {
            // Everythin string will be corrected masked.
            return true;
        }

        for (let c of name) {
            if (isEscaped) {
                if (c != delimiter && c != ESCAPE_CHARACTER) {
                    return false;
                }
                isEscaped = false;
            } else {
                if (c == ESCAPE_CHARACTER) {
                    isEscaped = true;
                } else if (isComponent && c == delimiter) {
                    // In an component no unmasked delimiters are allowed
                    return false;
                }
            }
        }

        // check if there is a dangeling ESCAPE CHARACTER
        return isEscaped ? false : true;
    }

    public isProperlyUnmasked(unmaskedComponent: string, maskedComponent: string): boolean {
        let newMaskedComponent: string = "";

        if (this.delimiter == ESCAPE_CHARACTER) {
            newMaskedComponent = unmaskedComponent.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER);
        } else {
            newMaskedComponent = unmaskedComponent.replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                                                  .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
        }

        return newMaskedComponent == maskedComponent;
    }

    private isValidDelimiter(delimiter: string) {
        return delimiter.length == 1;
    }

    private getDelimiterCharacter(): string {
        return this.delimiter;
    }
}

