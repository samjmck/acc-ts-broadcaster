import { IInboundPacketData, InboundPacket } from './InboundPacket';
import { InboundMessageType } from '../../InboundMessageType';
import { ITrackData, CameraSets } from './interface/ITrackData';
import { BufferReader } from '../../../util/buffer';

export interface ITrackDataPacketData extends IInboundPacketData {
    messageType: InboundMessageType.TrackData;
    connectionId: number;
    trackData: ITrackData;
}

export class TrackDataPacket extends InboundPacket<ITrackDataPacketData> {
    getData(bufferReader: BufferReader) {
        const messageType = bufferReader.readUInt8();
        const connectionId = bufferReader.readUInt32LE();

        const trackName = bufferReader.readString();
        const trackId = bufferReader.readUInt32LE();
        const trackMeters = bufferReader.readUInt32LE();

        const cameraSets: CameraSets = {};
        const cameraSetCount = bufferReader.readUInt8();
        for(let cameraSetIndex = 0; cameraSetIndex < cameraSetCount; cameraSetIndex++) {
            const cameraSetName = bufferReader.readString();
            cameraSets[cameraSetName] = [];

            const cameraCount = bufferReader.readUInt8();
            for(let cameraIndex = 0; cameraIndex < cameraCount; cameraIndex++) {
                const cameraName = bufferReader.readString();
                cameraSets[cameraSetName].push(cameraName);
            }
        }

        const hudPages: string[] = [];
        const hudPagesCount = bufferReader.readUInt8();
        for(let i = 0; i < hudPagesCount; i++) {
            hudPages.push(bufferReader.readString());
        }

        return {
            messageType,
            connectionId,
            trackData: {
                name: trackName,
                id: trackId,
                meters: trackMeters,
                cameraSets,
                HUDPages: hudPages,
            },
        };
    }
}
