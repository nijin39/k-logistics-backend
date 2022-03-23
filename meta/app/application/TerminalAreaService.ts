//import { Request, Response } from 'lambda-api';
import { TerminalArea } from '../domain/TerminalArea';
import TerminalAreaDDBRepository from '../infra/TerminalAreaDDBRepository';

const terminalAreaRepository = TerminalAreaDDBRepository.getInstance;

class TerminalAreaService {
    private static instance: TerminalAreaService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<TerminalArea[]> {
        try {
            const terminals = await terminalAreaRepository.findAll();
            return terminals;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async save(billingCompany: string, area: string) {
        try {
            await terminalAreaRepository.save(billingCompany, area);
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default TerminalAreaService;
