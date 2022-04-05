import { Trucking } from './Trucking';

export interface TruckingRepository {
    findAll(): Promise<Trucking[]>;
    delete(truckingId: string): Promise<void>;
    save(trucking: Trucking): Promise<void>;
    addTruckingWithInit(trucking: Trucking): Promise<void>;
}
