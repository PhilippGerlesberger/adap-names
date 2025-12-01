import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // do something
        const state: FileState = this.doGetFileState();
        IllegalArgumentException.assert(state != FileState.CLOSED);
        IllegalArgumentException.assert(state != FileState.DELETED);

        this.doSetFileState(FileState.OPEN);
    }

    public read(noBytes: number): Int8Array {
        const state: FileState = this.doGetFileState();
        IllegalArgumentException.assert(state == FileState.OPEN);
        IllegalArgumentException.assert(0 <= noBytes)
        IllegalArgumentException.assert(Number.isFinite(noBytes));
        IllegalArgumentException.assert(Number.isInteger(noBytes));
        // read something
        return new Int8Array();
    }

    public close(): void {
        const state: FileState = this.doGetFileState();
        IllegalArgumentException.assert(state == FileState.OPEN);
        // do something

        this.doSetFileState(FileState.CLOSED);
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    protected doSetFileState(state: FileState) {
        this.state = state;
    }

}