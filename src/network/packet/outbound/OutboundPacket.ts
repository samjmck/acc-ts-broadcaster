import { Packet, IPacketData } from '../Packet';
import { IWriteBufferDescription, toBuffer, BufferDataType, BufferReader } from '../../../util/buffer';
import { OutboundMessageType } from '../../OutboundMessageType';

export interface IOutboundPacketData extends IPacketData {
    messageType: OutboundMessageType;
}

export abstract class OutboundPacket<DataType extends IOutboundPacketData> extends Packet {
    // protected descriptions: IWriteBufferDescription[];

    constructor(private data: DataType) {
        super();
        // this.descriptions = this.getDescriptions(data);
    }

    // protected abstract getDescriptions(data: DataType): IWriteBufferDescription[];

    // toBuffer(): Buffer {
    //     return toBuffer(this.descriptions);
    // }

    protected abstract getBuffer(data: DataType): Buffer;

    toBuffer(): Buffer {
        return this.getBuffer(this.data);
    }

    fromBuffer(): DataType {
        return this.data;
    }
}
