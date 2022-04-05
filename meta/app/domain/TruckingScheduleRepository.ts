import { TruckingSchedule } from './TruckingSchedule';

export interface TruckingScheduleRepository {
    findAll(): Promise<TruckingSchedule[]>;
    delete(truckingId: string): Promise<void>;
    verify(truckingId: string): Promise<void>;
}
