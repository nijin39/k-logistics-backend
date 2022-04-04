import { Trucking } from '../domain/Trucking';
import { TruckingRepository } from '../domain/TruckingRepository';
import TruckingDDBRepository from '../infra/TruckingDDBRepository';

const truckingRepository: TruckingRepository = TruckingDDBRepository.getInstance;

interface TruckingRequest {
    truckingId: string;
    departureName: string;
    departureId: string;
    arrivalName: string;
    arrivalId: string;
    carType: string;
    truckingCount: number;
}

class TruckingService {
    private static instance: TruckingService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<Trucking[]> {
        try {
            const truckings = await truckingRepository.findAll();
            return truckings;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async save(truckingRequest: TruckingRequest) {
        try {
            for (let index = 0; index < truckingRequest.truckingCount; index++) {
                const trucking: Trucking = Object.assign({}, { ...truckingRequest, truckingIndex: index });
                await truckingRepository.save({
                    ...trucking,
                    truckingId: trucking.departureId + trucking.arrivalId + String(index).padStart(4, '0'),
                });
            }
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async delete(truckingIds: string[]) {
        try {
            await Promise.all(
                truckingIds.map(async (id) => {
                    await truckingRepository.delete(id);
                }),
            );
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default TruckingService;
