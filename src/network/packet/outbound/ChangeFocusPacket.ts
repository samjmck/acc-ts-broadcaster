import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { OutboundMessageType } from '../../OutboundMessageType';
import { BufferWriter } from '../../../util/buffer';

export interface IChangeFocusPacketData extends IOutboundPacketData {
    messageType: OutboundMessageType.ChangeFocus;
    connectionId: number;
    carIndex: number;
    cameraSet: string;
    camera: string;
}

export class ChangeFocusPacket extends OutboundPacket<IChangeFocusPacketData> {
    getBuffer(bufferWriter: BufferWriter, data: IChangeFocusPacketData) {
        bufferWriter
            .writeUInt8(data.messageType)
            .writeInt32LE(data.connectionId);

        if(data.carIndex === null) {
            bufferWriter.writeUInt8(0);
        } else {
            bufferWriter.writeUInt8(1);
            bufferWriter.writeUInt16LE(data.carIndex);
        }

        const { cameraSet, camera } = data;

        if(!cameraSet || !camera) {
            bufferWriter.writeUInt8(0);
        } else {
            bufferWriter
                .writeUInt8(1)
                .writeString(cameraSet)
                .writeString(camera);
        }

        return bufferWriter.buffer;
    }
}
