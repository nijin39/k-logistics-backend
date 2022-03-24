//import { Request, Response } from 'lambda-api';

import { Company } from '../domain/Company';
import { CompanyRepository } from '../domain/CompanyRepository';
import { CompanyRateRepository } from '../domain/CompanyRateRepository';
import CompanyDDBRepository from '../infra/CompanyDDBRepository';
import CompanyRateDDBRepository from '../infra/CompanyRateDDBRepository';
import { CompanyRate } from '../domain/CompanyRate';

const companyRepository: CompanyRepository = CompanyDDBRepository.getInstance;
const companyRateRepository: CompanyRateRepository = CompanyRateDDBRepository.getInstance;

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

    async findAllCompanyRate(): Promise<CompanyRate[]> {
        try {
            const companyRates = await companyRateRepository.findAll();
            return companyRates;
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }

    async companyRateSave(fromTo: string, companyName: string, rate: number) {
        try {
            await companyRateRepository.save(fromTo, companyName, rate);
        } catch (error) {
            console.error('Error');
            throw new Error('DDB');
        }
    }
}

export default CompanyService;
