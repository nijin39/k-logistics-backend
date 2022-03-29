import { Settlement } from './Settlement';

export interface SettlementRepository {
    findAll(): Promise<Settlement[]>;
    save(settlement: Settlement): void;
}
