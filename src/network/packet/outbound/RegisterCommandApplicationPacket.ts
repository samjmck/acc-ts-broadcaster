import { IOutboundPacketData, OutboundPacket } from './OutboundPacket';
import { IWriteBufferDescription, BufferDataType } from '../../../util/buffer';
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
    messageType: OutboundMessageType.RegisterCommandApplication;

    protected getDescriptions(data: IRegisterCommandApplicationPacketData): IWriteBufferDescription[] {
        return [
            {
                type: BufferDataType.UInt8,
                data: data.messageType,
            },
            {
                type: BufferDataType.UInt8,
                data: data.protocolVersion,
            },
            {
                type: BufferDataType.String,
                data: data.displayName,
            },
            {
                type: BufferDataType.String,
                data: data.password,
            },
            {
                type: BufferDataType.UInt32LE,
                data: data.updateInterval,
            },
            {
                type: BufferDataType.String,
                data: data.commandPassword,
            },
        ];
    }
}
