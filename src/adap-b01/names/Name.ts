export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    // @methodtype: Initialization method
    constructor(other: string[], delimiter?: string) {
        this.delimiter = delimiter ? delimiter : this.DEFAULT_DELIMITER;
        this.components = other.slice();
    }

    /** Returns human-readable representation of Name instance */
    // @methodtype: Conversion method
    public asNameString(delimiter: string = this.delimiter): string {
        let ret : string = this.components[0];
        for (let i = 1; i < this.components.length; i++) {
            ret += delimiter + this.components[i];
        }
        return ret;
    }

    // @methodtype: Get method
    public getComponent(i: number): string {
        return this.components[i];
    }

    // @methodtype: Set method
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

     /** Returns number of components in Name instance */
     // @methodtype: Get method
     public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype: Command method
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    // @methodtype: Command method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype: Command method
    public remove(i: number): void {
        this.components.splice(i, 1);
    }
}