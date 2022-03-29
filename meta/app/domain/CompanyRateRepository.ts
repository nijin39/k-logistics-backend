import { CompanyRate } from './CompanyRate';

export interface CompanyRateRepository {
    findAll(): Promise<CompanyRate[]>;
    findByFromTo(fromTo: string): Promise<CompanyRate>;
    save(fromTo: string, companyName: string, rate: number): void;
}
