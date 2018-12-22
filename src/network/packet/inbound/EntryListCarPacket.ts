import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { BufferReader } from '../../../util/buffer';
import { IDriverInfo } from './interface/IDriverInfo';
import { ICarInfo } from './interface/ICarInfo';

export interface IEntryListCarPacketData extends IInboundPacketData {
    messageType: InboundMessageType.EntryListCar;
    carIndex: number;
    carInfo: ICarInfo;
    driversOnCarCount: number;
    driversInfo: IDriverInfo[];
}

export class EntryListCarPacket extends InboundPacket<IEntryListCarPacketData> {
    getData(bufferReader: BufferReader) {
        const messageType = bufferReader.readUInt8();
        const carIndex = bufferReader.readUInt16LE();
        const carInfo: ICarInfo = {
            modelType: bufferReader.readUInt8(),
            teamName: bufferReader.readString(),
            raceNumber: bufferReader.readUInt32LE(),
            teamCarName: bufferReader.readString(),
            displayName: bufferReader.readString(),
            cupCategory: bufferReader.readUInt8(),
        };

        const driversOnCarCount = bufferReader.readUInt8();
        const driversInfo: IDriverInfo[] = [];
        for(let i = 0; i < driversOnCarCount; i++) {
            driversInfo.push({
                firstName: bufferReader.readString(),
                lastName: bufferReader.readString(),
                nickname: bufferReader.readString(),
                shortName: bufferReader.readString(),
                category: bufferReader.readUInt8(),
            });
        }

        return {
            messageType,
            carIndex,
            carInfo,
            driversOnCarCount,
            driversInfo,
        };
    }
}
