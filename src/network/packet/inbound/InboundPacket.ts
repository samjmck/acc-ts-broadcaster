import { Packet, IPacketData } from '../Packet';
import { IReadBufferDescription, fromBuffer, BufferDataType } from '../../../util/buffer';
import { InboundMessageType } from '../../InboundMessageType';

export interface IInboundPacketData extends IPacketData {
    messageType: InboundMessageType;
}

export abstract class InboundPacket<DataType extends IInboundPacketData> extends Packet {
    abstract messageType: InboundMessageType;

    protected abstract descriptions: IReadBufferDescription[];

    constructor(protected buffer: Buffer) {
        super();
    }

    toBuffer() {
        return this.buffer;
    }

    fromBuffer(): DataType {
        return fromBuffer(this.buffer, this.descriptions);
    }
}
