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

    readString(): string {
        const length = this.readUInt16LE();
        const string = this.buffer.slice(this.bytePosition).toString('utf8');
        this.bytePosition += length;
        return string;
    }
}
