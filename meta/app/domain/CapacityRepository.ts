import { Capacity } from './Capacity';

export interface CapacityRepository {
    findAll(): Promise<Capacity[]>;
    save(distance: number, capacity: number): void;
}
