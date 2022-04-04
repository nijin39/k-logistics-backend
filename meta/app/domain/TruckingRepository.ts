import { Trucking } from './Trucking';

export interface TruckingRepository {
    findAll(): Promise<Trucking[]>;
    save(trucking: Trucking): Promise<void>;
}
