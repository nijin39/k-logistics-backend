import { Terminal } from '../domain/Terminal';

export interface TerminalRepository {
    findAll(): Promise<Terminal[]>;
}
