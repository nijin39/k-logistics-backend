import { Capacity } from './Capacity';

export interface CapacityRepository {
    findByDistanceAndCapaticy(distance: number, carType: number): Promise<Capacity>;
    findAll(): Promise<Capacity[]>;
    save(distance: number, capacity: number, price: number): void;
}
