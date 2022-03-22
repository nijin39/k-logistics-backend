//import { Request, Response } from 'lambda-api';

class CompanyService {
    private static instance: CompanyService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    getAllCompanies() {
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

export default CompanyService;
