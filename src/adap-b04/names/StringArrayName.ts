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
        // TODO: isProperlyMasked for arrays.
        IllegalArgumentException.assert(this.nameParser.isProperlyMasked(
            source.join(this.getDelimiterCharacter()),
            this.getDelimiterCharacter()
        ));
        this.components = source.slice();
        MethodFailedException.assert(this.checkArrays(this.components, source));
    }

    protected doGetNoComponents(): number {
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

    protected doAppend(c: string) {
        this.components.push(c);
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