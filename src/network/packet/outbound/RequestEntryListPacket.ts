import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { OutboundMessageType } from '../../OutboundMessageType';
import { BufferWriter } from '../../../util/buffer';

export interface IRequestEntryListPacketData extends IOutboundPacketData {
    messageType: OutboundMessageType.RequestTrackData;
    connectionId: number;
}

export class RequestEntryListPacket extends OutboundPacket<IRequestEntryListPacketData> {
    getBuffer(bufferWriter: BufferWriter, data: IRequestEntryListPacketData) {
        bufferWriter
            .writeUInt8(data.messageType)
            .writeInt32LE(data.connectionId);

        return bufferWriter.buffer;
    }
}
