//import { Request, Response } from 'lambda-api';

import { CompanyRate } from '../domain/CompanyRate';
import { CompanyRateRepository } from '../domain/CompanyRateRepository';
import { Operation } from '../domain/Operation';
import { OperationRepository } from '../domain/OperationRepository';
import { Settlement } from '../domain/Settlement';
import { SettlementRepository } from '../domain/SettlementRepository';
import CompanyRateDDBRepository from '../infra/CompanyRateDDBRepository';
import OperationDDBRepository from '../infra/OperationDDBRepository';
import SettlementDDBRepository from '../infra/SettlementDDBRepository';

const settlementRepository: SettlementRepository = SettlementDDBRepository.getInstance;
const companyRateRepository: CompanyRateRepository = CompanyRateDDBRepository.getInstance;
const operationRepository: OperationRepository = OperationDDBRepository.getInstance;

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

    async settlement(): Promise<Settlement[]> {
        const operations: Operation[] = await operationRepository.findAll();

        const settlements = await Promise.all(
            operations.map(async (item: Operation) => {
                const companyRate: CompanyRate = await companyRateRepository.findByFromTo(
                    item.terminalDepartureAreaCode + item.terminalArrivalAreaCode,
                );
                return { ...item, rate: companyRate.rate };
            }),
        );

        settlements.forEach(async (item) => {
            await settlementRepository.save(item);
        });

        console.log('Settlements:', settlements);

        return settlements as unknown as Settlement[];
    }
}

export default SettlementService;
