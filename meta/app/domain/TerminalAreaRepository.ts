import { TerminalArea } from './TerminalArea';

export interface TerminalAreaRepository {
    findAll(): Promise<TerminalArea[]>;
    save(terminalArea: string, area: string): void;
}
