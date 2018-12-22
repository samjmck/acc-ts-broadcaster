import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { RaceSessionType } from './enum/RaceSessionType';
import { SessionPhase } from './enum/SessionPhase';
import { ILap } from './interface/ILap';
import { BufferReader } from '../../../util/buffer';

export interface IReplay {
    sessionTime: number;
    remainingTime: number;
    focusedCar: number;
}

export interface IRealtimeUpdatePacketData extends IInboundPacketData {
    messageType: InboundMessageType.RealtimeUpdate;
    eventIndex: number;
    sessionIndex: number;
    sessionType: RaceSessionType;
    phase: SessionPhase;
    sessionTime: number;
    sessionEndTime: number;
    focusedCarIndex: number;
    activeCameraSet: string;
    activeCamera: string;
    currentHUDPage: string;
    isReplayPlaying: boolean;
    replay?: IReplay;
    timeOfDay: number;
    ambientTemperature: number;
    trackTemperature: number;
    clouds: number;
    rainLevel: number;
    wetness: number;
    bestSessionLap: ILap;
}

export class RealtimeUpdatePacket extends InboundPacket<IRealtimeUpdatePacketData> {
    getData(bufferReader: BufferReader) {
        const messageType = bufferReader.readUInt8();

        const eventIndex = bufferReader.readUInt16LE();

        const sessionIndex = bufferReader.readUInt16LE();
        const sessionType = <RaceSessionType> bufferReader.readUInt8();

        const phase = <SessionPhase> bufferReader.readUInt8();

        const sessionTime = bufferReader.readFloatLE();
        const sessionEndTime = bufferReader.readFloatLE();

        const focusedCarIndex = bufferReader.readInt32LE();

        const activeCameraSet = bufferReader.readString();
        const activeCamera = bufferReader.readString();

        const currentHUDPage = bufferReader.readString();

        const isReplayPlaying = bufferReader.readBoolean();
        const replay: IReplay = isReplayPlaying ? {
            sessionTime: bufferReader.readFloatLE(),
            remainingTime: bufferReader.readFloatLE(),
            focusedCar: bufferReader.readInt32LE(),
        } : null;

        const timeOfDay = bufferReader.readUInt16LE();
        const ambientTemperature = bufferReader.readUInt8();
        const trackTemperature = bufferReader.readUInt8();

        const clouds = bufferReader.readUInt8() / 10;
        const rainLevel = bufferReader.readUInt8() / 10;
        const wetness = bufferReader.readUInt8() / 10;

        const bestSessionLap = bufferReader.readLap();

        return {
            messageType,
            eventIndex,
            sessionIndex,
            sessionType,
            phase,
            sessionTime,
            sessionEndTime,
            focusedCarIndex,
            activeCameraSet,
            activeCamera,
            currentHUDPage,
            isReplayPlaying,
            replay,
            timeOfDay,
            ambientTemperature,
            trackTemperature,
            clouds,
            rainLevel,
            wetness,
            bestSessionLap,
        };
    }
}
