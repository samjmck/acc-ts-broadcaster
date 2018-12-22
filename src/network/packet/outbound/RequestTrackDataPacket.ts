import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { OutboundMessageType } from '../../OutboundMessageType';
import { BufferWriter } from '../../../util/buffer';

export interface IRequestTrackDataPacketData extends IOutboundPacketData {
    messageType: OutboundMessageType.RequestTrackData;
    connectionId: number;
}

export class RequestTrackDataPacket extends OutboundPacket<IRequestTrackDataPacketData> {
    getBuffer(bufferWriter: BufferWriter, data: IRequestTrackDataPacketData) {
        bufferWriter
            .writeUInt8(data.messageType)
            .writeInt32LE(data.connectionId);

        return bufferWriter.buffer;
    }
}
