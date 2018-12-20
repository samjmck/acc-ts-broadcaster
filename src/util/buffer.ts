export function getStringBuffer(string: string): Buffer {
    const stringByteLength = Buffer.byteLength(string, 'utf8');

    // + 2 for the 2 bytes (unsigned 16-bit integer) that indicate what the length of the string is
    const buffer = Buffer.alloc(stringByteLength + 2);

    buffer.writeUInt16LE(stringByteLength, 0);
    buffer.write(string, 2, stringByteLength, 'utf8');

    return buffer;
}

export function readBufferString(buffer: Buffer, offset: number): string {
    const length = buffer.readUInt16LE(offset);
    return buffer.slice(offset + 2, length).toString('utf8');
}

export class BufferReader {
    private bytePosition = 0;

    constructor(private buffer: Buffer) {}

    readUInt8(): number {
        const number = this.buffer.readUInt8(this.bytePosition);
        this.bytePosition += 1;
        return number;
    }

    readUInt16LE(): number {
        const number = this.buffer.readUInt16LE(this.bytePosition);
        this.bytePosition += 2;
        return number;
    }

    readUInt32LE(): number {
        const number = this.buffer.readUInt32LE(this.bytePosition);
        this.bytePosition += 4;
        return number;
    }

    readBoolean(): boolean {
        const number = this.readUInt8();
        return number === 1;
    }

    readString(): string {
        const length = this.readUInt16LE();
        const string = this.buffer.slice(this.bytePosition).toString('utf8');
        this.bytePosition += length;
        return string;
    }
}

export enum BufferDataType {
    UInt8,
    UInt16LE,
    UInt32LE,
    String,
    Boolean,
}

export interface IWriteBufferDescription {
    type: BufferDataType;
    data: string | number | boolean;
}

export function toBuffer(descriptions: IWriteBufferDescription[]): Buffer {
    const buffers: Buffer[] = [];

    for(const description of descriptions) {
        const { type, data } = description;

        let buffer: Buffer = null;

        switch(type) {
            case BufferDataType.UInt8:
                buffer = Buffer.alloc(1);
                buffer.writeUInt8(<number> data, 0);
                break;
            case BufferDataType.UInt16LE:
                buffer = Buffer.alloc(2);
                buffer.writeUInt16LE(<number> data, 0);
                break;
            case BufferDataType.UInt32LE:
                buffer = Buffer.alloc(4);
                buffer.writeUInt32LE(<number> data, 0);
                break;
            case BufferDataType.String:
                buffer = getStringBuffer(<string> data);
                break;
            case BufferDataType.Boolean:
                buffer = Buffer.alloc(1);
                buffer.writeUInt8((<boolean> data) ? 1 : 0, 0);
                break;
        }
    }

    return Buffer.concat(buffers);
}

export interface IReadBufferDescription {
    type: BufferDataType;
    propertyName: string;
}

export function fromBuffer<T extends object>(buffer: Buffer, descriptions: IReadBufferDescription[]): T {
    const object = <T> {};

    const bufferReader = new BufferReader(buffer);

    for(const description of descriptions) {
        const { type, propertyName } = description;

        let value = null;

        switch(type) {
            case BufferDataType.UInt8:
                value = bufferReader.readUInt8();
                break;
            case BufferDataType.UInt16LE:
                value = bufferReader.readUInt16LE();
                break;
            case BufferDataType.UInt32LE:
                value = bufferReader.readUInt32LE();
                break;
            case BufferDataType.String:
                value = bufferReader.readString();
                break;
            case BufferDataType.Boolean:
                value = bufferReader.readBoolean();
                break;
        }

        object[propertyName] = value;
    }

    return object;
}
