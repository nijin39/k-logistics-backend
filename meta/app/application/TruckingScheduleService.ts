import { TruckingSchedule } from '../domain/TruckingSchedule';
import { TruckingScheduleRepository } from '../domain/TruckingScheduleRepository';
import TruckingScheduleDDBRepository from '../infra/TruckingScheduleDDBRepository';

const truckingScheduleRepository: TruckingScheduleRepository = TruckingScheduleDDBRepository.getInstance;

class TruckingScheduleService {
    private static instance: TruckingScheduleService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<TruckingSchedule[]> {
        try {
            const truckings = await truckingScheduleRepository.findAll();
            return truckings;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async delete(truckingIds: string[]) {
        try {
            await Promise.all(
                truckingIds.map(async (id) => {
                    await truckingScheduleRepository.delete(id);
                }),
            );
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async verify(truckingIds: string[]) {
        console.log('IDS', truckingIds);
        try {
            await Promise.all(
                truckingIds.map(async (id) => {
                    await truckingScheduleRepository.verify(id);
                }),
            );
        } catch (error) {
            console.error('Service Error', error);
            throw new Error('DDB');
        }
    }

    async assignTruck(assignTrucking: AssignTrucking) {
        try {
            const truckings = await truckingScheduleRepository.assignTruck(assignTrucking);
            return truckings;
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }

    async assignTruckDepartureDateTime(assignTrucking: AssignTrucking) {
        try {
            const departureDateTime = await truckingScheduleRepository.assignTruckDepartureDateTime(assignTrucking);
            return departureDateTime;
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }

    async assignTruckArrivalDateTime(assignTrucking: AssignTrucking) {
        try {
            const departureDateTime = await truckingScheduleRepository.assignTruckArrivalDateTime(assignTrucking);
            return departureDateTime;
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }
}

interface AssignTrucking {
    truckingId: string;
    value: string;
}

export default TruckingScheduleService;
