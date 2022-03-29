//import { Request, Response } from 'lambda-api';

import { Settlement } from '../domain/Settlement';
import { SettlementRepository } from '../domain/SettlementRepository';
import SettlementDDBRepository from '../infra/SettlementDDBRepository';

const settlementRepository: SettlementRepository = SettlementDDBRepository.getInstance;

class SettlementService {
    private static instance: SettlementService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<Settlement[]> {
        try {
            const settlements = await settlementRepository.findAll();
            console.log('operation :', JSON.stringify(settlements));
            return settlements;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default SettlementService;
