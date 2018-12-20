import { Packet, IPacketData } from '../Packet';
import { IWriteBufferDescription, toBuffer, BufferDataType } from '../../../util/buffer';
import { OutboundMessageType } from '../../OutboundMessageType';

export interface IOutboundPacketData extends IPacketData {
    messageType: OutboundMessageType;
}

export abstract class OutboundPacket<DataType extends IOutboundPacketData> extends Packet {
    abstract messageType: OutboundMessageType;

    protected descriptions: IWriteBufferDescription[];

    constructor(private data: DataType) {
        super();
        this.descriptions = this.getDescriptions(data);
    }

    protected abstract getDescriptions(data: DataType): IWriteBufferDescription[];

    toBuffer(): Buffer {
        return toBuffer(this.descriptions);
    }

    fromBuffer(): DataType {
        return this.data;
    }
}
