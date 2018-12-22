import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { BufferReader } from '../../../util/buffer';

export interface IEntryListPacketData extends IInboundPacketData {
    messageType: InboundMessageType.EntryList;
    connectionId: number;
    carEntryCount: number;
    carEntryIndexes: number[];
    driverEntryCount: number;
    driverIndexes;
}

export class EntryListPacket extends InboundPacket<IEntryListPacketData> {
    getData(bufferReader: BufferReader) {
        const messageType = bufferReader.readUInt8();
        const connectionId = bufferReader.readUInt32LE();

        const carEntryCount = bufferReader.readUInt16LE();
        const carEntryIndexes: number[] = [];
        for(let i = 0; i < carEntryCount; i++) {
            carEntryIndexes.push(bufferReader.readUInt16LE());
        }

        const driverEntryCount = bufferReader.readUInt16LE();
        const driverIndexes: number[] = [];
        for(let i = 0; i < driverEntryCount; i++) {
            driverIndexes.push(bufferReader.readUInt16LE());
        }

        return {
            messageType,
            connectionId,
            carEntryCount,
            carEntryIndexes,
            driverEntryCount,
            driverIndexes,
        };
    }
}
