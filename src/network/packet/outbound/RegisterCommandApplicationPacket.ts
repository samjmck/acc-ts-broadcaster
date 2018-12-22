import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { getStringBuffer, BufferWriter } from '../../../util/buffer';
import { OutboundMessageType } from '../../OutboundMessageType';

export interface IRegisterCommandApplicationPacketData extends IOutboundPacketData {
    messageType: OutboundMessageType.RegisterCommandApplication;
    protocolVersion: number;
    displayName: string;
    password: string;
    updateInterval: number;
    commandPassword: string;
}

export class RegisterCommandApplicationPacket extends OutboundPacket<IRegisterCommandApplicationPacketData> {
    protected getBuffer(bufferWriter: BufferWriter, data: IRegisterCommandApplicationPacketData) {
        bufferWriter
            .writeUInt8(data.messageType)
            .writeUInt8(data.protocolVersion)
            .writeString(data.displayName)
            .writeString(data.password)
            .writeUInt32LE(data.updateInterval)
            .writeString(data.commandPassword);

        return bufferWriter.buffer;
    }
}
