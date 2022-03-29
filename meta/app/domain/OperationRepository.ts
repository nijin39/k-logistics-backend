import { Operation } from './Operation';

interface OperationRequest {
    id: string;
    terminalArrival: string;
    terminalArrivalAreaCode: string;
    arrivalTime: string;
    terminalDeparture: string;
    terminalDepartureAreaCode: string;
    departureTime: string;
    carType: number;
}

export interface OperationRepository {
    findAll(): Promise<Operation[]>;
    save(operation: OperationRequest): void;
}
