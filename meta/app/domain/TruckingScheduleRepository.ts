import { TruckingSchedule } from './TruckingSchedule';

interface AssignTrucking {
    truckingId: string;
    value: string;
}

export interface TruckingScheduleRepository {
    assignTruckArrivalDateTime(assignTrucking: AssignTrucking): Promise<TruckingSchedule>;
    assignTruckDepartureDateTime(assignTrucking: AssignTrucking): Promise<TruckingSchedule>;
    assignTruck(assignTrucking: AssignTrucking): Promise<void>;
    findAll(): Promise<TruckingSchedule[]>;
    delete(truckingId: string): Promise<void>;
    verify(truckingId: string): Promise<void>;
}
