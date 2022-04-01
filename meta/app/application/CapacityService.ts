import { Capacity } from '../domain/Capacity';
import { CapacityRepository } from '../domain/CapacityRepository';
import CapacityDDBRepository from '../infra/CapacityDDBRepository';

const capacityRepository: CapacityRepository = CapacityDDBRepository.getInstance;

class CapacityService {
    private static instance: CapacityService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<Capacity[]> {
        try {
            const capacities = await capacityRepository.findAll();
            return capacities;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async save(distance: number, capacity: number) {
        try {
            await capacityRepository.save(distance, capacity);
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default CapacityService;
