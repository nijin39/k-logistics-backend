//import { Request, Response } from 'lambda-api';

import { Operation } from '../domain/Operation';
import { OperationRepository } from '../domain/OperationRepository';
import OperationDDBRepository from '../infra/OperationDDBRepository';

const operationRepository: OperationRepository = OperationDDBRepository.getInstance;

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

class OperationService {
    private static instance: OperationService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<Operation[]> {
        try {
            const operations = await operationRepository.findAll();
            console.log('operation :', JSON.stringify(operations));
            return operations;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async operationSave(operationRequest: OperationRequest) {
        try {
            await operationRepository.save(operationRequest);
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default OperationService;
