/**
 * Parser for string components with escape-aware delimiters.
 * Supports masking, unmasking, remasking, and splitting.
 * Special characters are the escape symbol and the delimiter.
 */
export interface Parser {

    /**
     * Escapes all special characters in a component.
     *
     * @param component The input string.
     * @returns The masked component.
     */
    mask(component: string, delimiter: string): string;

    /**
     * Restores original characters by removing escape sequences.
     * 
     * Ecpects that the component is properly masked.
     *
     * @param component The input string.
     * @returns The unmasked component.
     */
    unmask(component: string, delimiter: string): string;

    /**
     * Converts a component from one delimiter context to another.
     * Removes old escapes and applies new ones.
     * 
     * Ecpects that the component is properly masked.
     *
     * @param component The input string.
     * @param toDelimiter The target delimiter.
     * @param fromDelimiter (optional) The source delimiter the component is masked with.
     *                      Defaults to this.delimiter. Use this parameter if the component
     *                      originates from a different delimiter context.
     * @returns The remasked component.
     */
    remask(component: string, toDelimiter: string, fromDelimiter: string): string;

    /**
     * Splits a string into components using the current delimiter,
     * respecting escape rules.
     * 
     * Ecpects that source is properly masked.
     *
     * @param source The full input string.
     * @returns The parsed components.
     */
    split(source: string, delimiter: string): string[];

    isProperlyMasked(name: string, delimiter: string, isComponent?: boolean): boolean;

    isProperlyUnmasked(unmaskedComponent: string, maskedComponent: string, delimiter: string): boolean;
}