import { Packet, IPacketData } from '../Packet';
import { BufferReader } from '../../../util/buffer';
import { InboundMessageType } from '../../InboundMessageType';

export interface IInboundPacketData extends IPacketData {
    messageType: InboundMessageType;
}

export abstract class InboundPacket<DataType extends IInboundPacketData> extends Packet {
    private bufferReader: BufferReader;

    // protected abstract descriptions: IReadBufferDescription[];

    constructor(protected buffer: Buffer) {
        super();
        this.bufferReader = new BufferReader(buffer);
    }

    toBuffer(): Buffer {
        return this.buffer;
    }

    // fromBuffer(): DataType {
    //     return fromBuffer(this.buffer, this.descriptions);
    // }

    protected abstract getData(bufferReader: BufferReader): DataType;

    fromBuffer(): DataType {
        return this.getData(this.bufferReader);
    }
}
