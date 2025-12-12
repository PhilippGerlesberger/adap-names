import { AbstractName } from "./AbstractName"
import { Name } from "./Name";

export class StringArrayName extends AbstractName {
    protected readonly components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source.slice();
    }

    protected doGetNoComponents(): number {
        return this.components.length;
    }

    protected doGetComponent(i: number): string {
        return this.components[i];
    }

    protected doSetComponent(i: number, c: string): Name {
        let newComponents: string[] = this.components;
        newComponents[i] = c;
        return new StringArrayName(newComponents, this.delimiter);
    }

    protected doInsert(i: number, c: string): Name {
        let newComponents: string[] = this.components;
        newComponents.splice(i, 0, c);
        return new StringArrayName(newComponents, this.delimiter);
    }

    protected doAppend(c: string): Name {
        let newComponents: string[] = this.components;
        newComponents.push(c);
        return new StringArrayName(newComponents, this.delimiter);
    }

    protected doRemove(i: number): Name {
        let newComponents: string[] = this.components;
        newComponents.splice(i, 1);
        return new StringArrayName(newComponents, this.delimiter);
    }
}