//import { Request, Response } from 'lambda-api';

import { Company } from '../domain/Company';
import { CompanyRepository } from '../domain/CompanyRepository';
import CompanyDDBRepository from '../infra/CompanyDDBRepository';

const companyRepository: CompanyRepository = CompanyDDBRepository.getInstance;

class CompanyService {
    private static instance: CompanyService;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async findAll(): Promise<Company[]> {
        try {
            const companies = await companyRepository.findAll();
            console.log('COMPANIES :', JSON.stringify(companies));
            return companies;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
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
