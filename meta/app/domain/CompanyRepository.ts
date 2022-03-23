import { Company } from './Company';

export interface CompanyRepository {
    findAll(): Promise<Company[]>;
}
