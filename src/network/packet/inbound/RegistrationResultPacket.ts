import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { IReadBufferDescription, BufferDataType } from '../../../util/buffer';

export interface IRegistrationResultData extends IInboundPacketData {
    messageType: InboundMessageType.RegistrationResult;
    connectionId: number;
    success: boolean;
    isReadonly: boolean;
    errorMessage: string;
}

export class RegistrationResultPacket extends InboundPacket<IRegistrationResultData> {
    messageType: InboundMessageType.RegistrationResult;

    protected descriptions: IReadBufferDescription[] = [
        {
            type: BufferDataType.UInt8,
            propertyName: 'messageType',
        }
        {
            type: BufferDataType.UInt32LE,
            propertyName: 'connectionId',
        },
        {
            type: BufferDataType.Boolean,
            propertyName: 'success',
        },
        {
            type: BufferDataType.Boolean,
            propertyName: 'isReadonly',
        },
        {
            type: BufferDataType.String,
            propertyName: 'errorMessage',
        },
    ];
}
