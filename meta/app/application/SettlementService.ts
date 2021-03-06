//import { Request, Response } from 'lambda-api';

import { Capacity } from '../domain/Capacity';
import { CapacityRepository } from '../domain/CapacityRepository';
import { CompanyRate } from '../domain/CompanyRate';
import { CompanyRateRepository } from '../domain/CompanyRateRepository';
import { Operation } from '../domain/Operation';
import { OperationRepository } from '../domain/OperationRepository';
import { Settlement } from '../domain/Settlement';
import { SettlementRepository } from '../domain/SettlementRepository';
import { TerminalDistance } from '../domain/TerminalDistance';
import { TerminalDistanceRepository } from '../domain/TerminalDistanceRepository';
import CapacityDDBRepository from '../infra/CapacityDDBRepository';
import CompanyRateDDBRepository from '../infra/CompanyRateDDBRepository';
import OperationDDBRepository from '../infra/OperationDDBRepository';
import SettlementDDBRepository from '../infra/SettlementDDBRepository';
import TerminalDistanceDDBRepository from '../infra/TerminalDistanceDDBRepository';

const settlementRepository: SettlementRepository = SettlementDDBRepository.getInstance;
const companyRateRepository: CompanyRateRepository = CompanyRateDDBRepository.getInstance;
const operationRepository: OperationRepository = OperationDDBRepository.getInstance;
const terminalDistanceRepository: TerminalDistanceRepository = TerminalDistanceDDBRepository.getInstance;
const tarriffRepository: CapacityRepository = CapacityDDBRepository.getInstance;

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

        //TODO need Refactoring
        try {
            const settlements = await Promise.all(
                operations.map(async (item: Operation) => {
                    const companyRate: CompanyRate = await companyRateRepository.findByFromTo(
                        item.terminalDepartureAreaCode + item.terminalArrivalAreaCode,
                    );
                    const terminalDistance: TerminalDistance = await terminalDistanceRepository.findByFromTo(
                        item.terminalDeparture,
                        item.terminalArrival,
                    );

                    if (terminalDistance !== undefined) {
                        const capaticy: Capacity = await tarriffRepository.findByDistanceAndCapaticy(
                            terminalDistance.distance,
                            item.carType,
                        );

                        const rate = companyRate.rate;
                        const distance = terminalDistance === undefined ? 0 : terminalDistance.distance;
                        const price = capaticy === undefined ? 0 : capaticy.price;
                        const sattlementPrice = (price * rate) / 100;

                        return {
                            ...item,
                            rate: companyRate.rate,
                            distance: distance,
                            price: price,
                            sattlementPrice: Math.round(sattlementPrice),
                        };
                    } else {
                        return {
                            ...item,
                            rate: companyRate.rate,
                            distance: -1,
                            price: -1,
                            sattlementPrice: -1,
                        };
                    }
                }),
            );

            settlements.forEach(async (item) => {
                await settlementRepository.save(item);
            });

            return settlements as unknown as Settlement[];
        } catch (error) {
            console.error('Error :', error);
            throw new Error(JSON.stringify(error));
        }
    }

    async reset(): Promise<void> {
        const settlement: Settlement[] = await this.findAll();
        settlement.forEach(async (item) => {
            await settlementRepository.delete(item);
        });
    }
}

export default SettlementService;
