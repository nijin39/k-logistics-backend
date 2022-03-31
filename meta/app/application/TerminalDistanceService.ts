import { TerminalDistance } from '../domain/TerminalDistance';
import { TerminalDistanceRepository } from '../domain/TerminalDistanceRepository';
import TerminalDistanceDDBRepository from '../infra/TerminalDistanceDDBRepository';

const terminalDistanceRepository: TerminalDistanceRepository = TerminalDistanceDDBRepository.getInstance;

class TerminalDistanceService {
    private static instance: TerminalDistanceService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<TerminalDistance[]> {
        try {
            const terminals = await terminalDistanceRepository.findAll();
            return terminals;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async save(departure: string, arrival: string, distance: number) {
        try {
            await terminalDistanceRepository.save(departure, arrival, distance);
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default TerminalDistanceService;
