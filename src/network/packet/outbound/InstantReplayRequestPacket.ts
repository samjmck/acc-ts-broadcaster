import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { OutboundMessageType } from '../../OutboundMessageType';
import { BufferWriter } from '../../../util/buffer';

export interface IInstantReplayRequestPacketData extends IOutboundPacketData {
    messageType: OutboundMessageType.InstantReplayRequest;
    connectionId: number;
    startSessionTime: number;
    duration: number;
    initialFocusedCarIndex: number;
    initialCameraSet: string;
    initialCamera: string;
}

export class InstantReplayRequestPacket extends OutboundPacket<IInstantReplayRequestPacketData> {
    getBuffer(bufferWriter: BufferWriter, data: IInstantReplayRequestPacketData) {
        bufferWriter
            .writeUInt8(data.messageType)
            .writeInt32LE(data.connectionId)
            .writeFloatLE(data.startSessionTime)
            .writeFloatLE(data.duration)
            .writeInt32LE(data.initialFocusedCarIndex) // could be 16bit?
            .writeString(data.initialCameraSet)
            .writeString(data.initialCamera);

        return bufferWriter.buffer;
    }
}
