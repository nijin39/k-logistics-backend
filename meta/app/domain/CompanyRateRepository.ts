import { CompanyRate } from './CompanyRate';

export interface CompanyRateRepository {
    findAll(): Promise<CompanyRate[]>;
    save(fromTo: string, companyName: string, rate: number): void;
}
