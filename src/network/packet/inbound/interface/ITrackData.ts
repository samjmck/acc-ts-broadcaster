export type CameraSets = { [key: string]: string[] };

export interface ITrackData {
    name: string;
    id: number;
    meters: number;
    cameraSets: CameraSets;
    HUDPages: string[];
}
