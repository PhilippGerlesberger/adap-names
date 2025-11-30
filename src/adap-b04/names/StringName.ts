import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { Parser } from "../parser/Parser";
import { NameParser } from "../parser/NameParser";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;
    

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(
            source,
            this.getDelimiterCharacter()
        ))
        this.name = source;
        this.noComponents = this.nameParser.split(source, this.getDelimiterCharacter()).length;
        InvalidStateException.assert(this.isValidNoComponents(this.noComponents));

        MethodFailedException.assert(this.name == source);
    }

    protected doGetNoComponents(): number {
        return this.noComponents;
    }

    protected doGetComponent(i: number): string {
        const components = this.nameParser.split(this.name, this.delimiter);
        return components[i];
    }

    protected doSetComponent(i: number, c: string): void {
        let components = this.nameParser.split(this.name, this.delimiter);
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    protected doInsert(i: number, c: string): void {
        let components = this.nameParser.split(this.name, this.delimiter);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.incrementNoComponents();
    }

    protected doAppend(c: string): void {
        this.name = this.isEmpty() ? c : this.name + this.delimiter + c;
        this.incrementNoComponents();
    }

    protected doRemove(n: number): void {
        let components = this.nameParser.split(this.name, this.delimiter);
        components.splice(n, 1)
        this.name = components.join(this.delimiter);
        this.decrementNoComponents();
    }

    // Increments number of components by n
    private incrementNoComponents(): void {
        this.noComponents++;
    }

    // Decrements number of components
    private decrementNoComponents(): void {
        this.noComponents--;
    }  
}