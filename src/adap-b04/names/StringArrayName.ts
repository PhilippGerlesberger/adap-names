import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { sourceMapsEnabled } from "process";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source.slice();
    }

    public getNoComponents(): number {
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
        this.components.push(c);
    }

    protected doRemove(i: number) {
        this.components.splice(i, 1);
    }
}