import { Packet, IPacketData } from '../Packet';
import { OutboundMessageType } from '../../OutboundMessageType';
import { BufferWriter } from '../../../util/buffer';

export interface IOutboundPacketData extends IPacketData {
    messageType: OutboundMessageType;
}

export abstract class OutboundPacket<DataType extends IOutboundPacketData> extends Packet {
    private bufferWriter: BufferWriter = new BufferWriter();

    constructor(private data: DataType) {
        super();
    }

    protected abstract getBuffer(bufferWriter: BufferWriter, data: DataType): Buffer;

    toBuffer(): Buffer {
        return this.getBuffer(this.bufferWriter, this.data);
    }

    fromBuffer(): DataType {
        return this.data;
    }
}
