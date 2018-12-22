import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { OutboundMessageType } from '../../OutboundMessageType';
import { BufferWriter } from '../../../util/buffer';

export interface IChangeHUDPacketData extends IOutboundPacketData {
    messageType: OutboundMessageType.ChangeHUDPage;
    connectionId: number;
    HUDPage: string;
}

export class ChangeHUDPacket extends OutboundPacket<IChangeHUDPacketData> {
    getBuffer(bufferWriter: BufferWriter, data: IChangeHUDPacketData) {
        bufferWriter
            .writeUInt8(data.messageType)
            .writeUInt32LE(data.connectionId)
            .writeString(data.HUDPage);

        return bufferWriter.buffer;
    }
}
