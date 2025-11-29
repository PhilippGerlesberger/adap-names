import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(
            source.join(this.getDelimiterCharacter()),
            this.getDelimiterCharacter()
        ));
        this.components = source.slice();
        MethodFailedException.assert(this.checkArrays(this.components, source));
    }

    public getNoComponents(): number {
        // TODO: in abstract class + doGetNoComponents
        const noComponents: number = this.doGetNoComponents();
        MethodFailedException.assert(this.isValidNoComponents(noComponents));

        return noComponents;
    }

    private doGetNoComponents(): number {
        return this.components.length;
    }

    protected doGetComponent(i: number): string {
        return this.components[i];
    }

    protected doSetComponent(i: number, c: string) {
        this.components[i] = c;
    }

    protected doInsert(i: number, c: string) {
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        // TODO: in abstract class + doAppend
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(c, this.getDelimiterCharacter(), true));

        const oldNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(oldNoComponents));
        
        this.components.push(c);

        const newNoComponents: number = this.getNoComponents();
        InvalidStateException.assert(this.isValidNoComponents(newNoComponents));
        const newComponent: string = this.getComponent(newNoComponents - 1);
        InvalidStateException.assert(this.nameParser.isProperlyMasked(newComponent, this.getDelimiterCharacter(), true));

        MethodFailedException.assert(oldNoComponents + 1 == newNoComponents);
        MethodFailedException.assert(c == newComponent);
    }

    protected doRemove(i: number) {
        this.components.splice(i, 1);
    }

    // FIXME:!!!
    private checkArrays(a: string[], b: string[]) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
}