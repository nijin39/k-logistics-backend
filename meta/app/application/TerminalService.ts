import { Request, Response } from 'lambda-api';
import { Terminal } from '../domain/Terminal';
import TerminalDDBRepository from '../infra/TerminalDDBRepository';

const terminalRepository = TerminalDDBRepository.getInstance;

class TerminalService {
    private static instance: TerminalService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<Terminal[]> {
        try {
            const terminals = await terminalRepository.findAll();
            console.log('TERMINALS :', JSON.stringify(terminals));
            return terminals;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    getAllTerminals() {
        return {
            terminals: [
                {
                    id: 1,
                    terminalName: '서울',
                    terminalGeo: 'Seoul',
                },
                {
                    id: 2,
                    terminalName: '부산',
                    terminalGeo: 'Busan',
                },
            ],
        };
    }
}

export default TerminalService;
