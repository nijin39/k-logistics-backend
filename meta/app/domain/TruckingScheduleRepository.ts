import { TruckingSchedule } from './TruckingSchedule';

interface AssignTrucking {
    truckingId: string;
    value: string;
}

export interface TruckingScheduleRepository {
    assignTruckArrivalDateTime(assignTrucking: AssignTrucking): Promise<void>;
    assignTruckDepartureDateTime(assignTrucking: AssignTrucking): Promise<void>;
    assignTruck(assignTrucking: AssignTrucking): Promise<void>;
    findAll(): Promise<TruckingSchedule[]>;
    delete(truckingId: string): Promise<void>;
    verify(truckingId: string): Promise<void>;
}
