import { LapType } from '../enum/LapType';

export interface ILap {
    milliseconds: number;
    splits: number[];
    carIndex: number;
    driverIndex: number;
    isInvalid: boolean;
    isValidForBest: boolean;
    type: LapType;
}
