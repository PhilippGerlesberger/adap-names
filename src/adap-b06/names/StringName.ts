import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";

export class StringName extends AbstractName {
    protected readonly name: string = "";
    protected readonly noComponents: number;
    
    constructor(source: string, delimiter?: string, isEmptyName: boolean = false) {
        super(delimiter);
        this.assertIsProperlyMasked(source, false);
        this.name = source;
        if (isEmptyName) {
            IllegalArgumentException.assert(source == "")
            this.noComponents = 0;
        } else {
            this.noComponents = this.nameParser.split(source, this.delimiter).length;
        }
    }

    protected createEmptyStringName(delimiter: string): Name {
        return new StringName("", delimiter, true);
    }

    protected doGetNoComponents(): number {
        return this.noComponents;
    }

    protected doGetComponent(i: number): string {
        return this.nameParser.split(this.name, this.delimiter)[i];
    }

    protected doSetComponent(i: number, c: string): Name {
        let newComponents: string[] = this.nameParser.split(this.name, this.delimiter);
        newComponents[i] = c;
        let newName = newComponents.join(this.delimiter);
        return new StringName(newName, this.delimiter);
    }

    protected doInsert(i: number, c: string): Name {
        if (this.isEmpty()) {
            return new StringName(c, this.delimiter);
        } else {
            let newComponents: string[] = this.nameParser.split(this.name, this.delimiter);
            newComponents.splice(i, 0, c);
            let newName = newComponents.join(this.delimiter);
            return new StringName(newName, this.delimiter);
        }
    }

    protected doAppend(c: string): Name {
        const newName: string = this.isEmpty() ? c : this.name + this.delimiter + c;
        return new StringName(newName, this.delimiter);
    }

    protected doRemove(i: number): Name {
        let newComponents: string[] = this.nameParser.split(this.name, this.delimiter);
        newComponents.splice(i, 1);
        if (newComponents.length == 0) {
            return this.createEmptyStringName(this.delimiter);
        }
        let newName = newComponents.join(this.delimiter);
        return new StringName(newName, this.delimiter);
    }
}