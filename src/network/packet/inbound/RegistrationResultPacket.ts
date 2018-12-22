import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { BufferReader } from '../../../util/buffer';

export interface IRegistrationResultData extends IInboundPacketData {
    messageType: InboundMessageType.RegistrationResult;
    connectionId: number;
    success: boolean;
    isReadonly: boolean;
    errorMessage: string;
}

export class RegistrationResultPacket extends InboundPacket<IRegistrationResultData> {
    protected getData(bufferReader: BufferReader) {
        return {
            messageType: bufferReader.readUInt8(),
            connectionId: bufferReader.readInt32LE(),
            success: bufferReader.readUInt8() === 1,
            isReadonly: bufferReader.readUInt8() === 0,
            errorMessage: bufferReader.readString(),
        };
    }
}
