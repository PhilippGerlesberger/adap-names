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
        this.noComponents = this.nameParser.split(source).length;
        InvalidStateException.assert(this.isValidNoComponents(this.noComponents));

        MethodFailedException.assert(this.name == source);
    }

    public getNoComponents(): number {
        const noComponents: number = this.doGetNoComponents();
        MethodFailedException.assert(this.isValidNoComponents(noComponents));
        return noComponents;
    }

    protected doGetNoComponents(): number {
        return this.noComponents;
    }

    protected doGetComponent(i: number): string {
        const components = this.nameParser.split(this.name);
        return components[i];
    }

    protected doSetComponent(i: number, c: string): void {
        const delimiter = this.getDelimiterCharacter();
        let components = this.nameParser.split(this.name);
        components[i] = c;
        this.name = components.join(delimiter);
    }
  
    protected doInsert(i: number, c: string): void {
        let components = this.nameParser.split(this.name);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.incrementNoComponents();
    }

    public append(c: string): void {
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(
            c,
            this.getDelimiterCharacter(),
            true
        ))
        this.name = this.isEmpty() ? c : this.name + this.delimiter + c;
        this.incrementNoComponents();
    }

    protected doRemove(n: number): void {
        let components = this.nameParser.split(this.name);
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