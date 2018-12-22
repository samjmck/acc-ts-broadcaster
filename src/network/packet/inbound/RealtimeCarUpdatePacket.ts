import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { CarLocation } from './enum/CarLocation';
import { ILap } from './interface/ILap';
import { BufferReader } from '../../../util/buffer';

export interface IRealtimeCarUpdatePacketData extends IInboundPacketData {
    messageType: InboundMessageType.RealtimeCarUpdate;
    carIndex: number;
    driverIndex: number;
    gear: number;
    worldPosX: number;
    worldPosY: number;
    yaw: number;
    carLocation: CarLocation;
    kmh: number;
    position: number;
    trackPosition: number;
    splinePosition: number;
    delta: number;
    bestSessionLap: ILap;
    lastLap: ILap;
    currentLap: ILap;
    laps: number;
    cupPosition: number;
}

export class RealtimeCarUpdatePacket extends InboundPacket<IRealtimeCarUpdatePacketData> {
    getData(bufferReader: BufferReader) {
        const messageType = bufferReader.readUInt8();

        const carIndex = bufferReader.readUInt16LE();
        const driverIndex = bufferReader.readUInt16LE();

        const gear = bufferReader.readUInt8();

        const worldPosX = bufferReader.readFloatLE();
        const worldPosY = bufferReader.readFloatLE();

        const yaw = bufferReader.readFloatLE();

        const carLocation = <CarLocation> bufferReader.readUInt8();

        const kmh = bufferReader.readUInt16LE();

        const position = bufferReader.readUInt16LE();
        const cupPosition = bufferReader.readUInt16LE();
        const trackPosition = bufferReader.readUInt16LE();

        const splinePosition = bufferReader.readFloatLE();

        const laps = bufferReader.readUInt16LE();

        const delta = bufferReader.readInt32LE();

        const bestSessionLap = bufferReader.readLap();
        const lastLap = bufferReader.readLap();
        const currentLap = bufferReader.readLap();

        return {
            messageType,
            carIndex,
            driverIndex,
            gear,
            worldPosX,
            worldPosY,
            yaw,
            carLocation,
            kmh,
            position,
            cupPosition,
            trackPosition,
            splinePosition,
            laps,
            delta,
            bestSessionLap,
            lastLap,
            currentLap,
        };
    }
}
