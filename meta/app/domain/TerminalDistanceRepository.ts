import { TerminalDistance } from './TerminalDistance';

export interface TerminalDistanceRepository {
    findAll(): Promise<TerminalDistance[]>;
    findByFromTo(departure: string, arrival: string): Promise<TerminalDistance>;
    save(departure: string, arrival: string, distance: number): void;
}
