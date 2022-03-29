import { Settlement } from './Settlement';

export interface SettlementRepository {
    findAll(): Promise<Settlement[]>;
    save(settlement: Settlement): Promise<void>;
    delete(settlement: Settlement): Promise<void>;
}
