import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { IWriteBufferDescription, BufferDataType, getStringBuffer } from '../../../util/buffer';
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
    protected getBuffer(data: IRegisterCommandApplicationPacketData) {
        // alloc 2 bytes for UInt8 for message type and protocol version (first byte is always message type)
        const initialBuffer = Buffer.alloc(2);
        // UInt8 --> unsigned 8-bit integer --> 0-255
        // offset 0, start from start
        initialBuffer.writeUInt8(data.messageType, 0);
        initialBuffer.writeUInt8(data.protocolVersion, 1);

        const displayNameBuffer = getStringBuffer(data.displayName);
        const passwordBuffer = getStringBuffer(data.password);

        // alloc 4 bytes for 32-bit (4 x 8-bits) buffer
        const updateIntervalBuffer = Buffer.alloc(4);
        updateIntervalBuffer.writeUInt32LE(data.updateInterval, 0);

        const commandPasswordBuffer = getStringBuffer(data.commandPassword);

        return Buffer.concat([
            initialBuffer,
            displayNameBuffer,
            passwordBuffer,
            updateIntervalBuffer,
            commandPasswordBuffer,
        ]);
    }
}
