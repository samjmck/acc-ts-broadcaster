import { DriverCategory } from '../enum/DriverCategory';

export interface IDriverInfo {
    firstName: string;
    lastName: string;
    nickname: string;
    shortName: string;
    category: DriverCategory;
}
