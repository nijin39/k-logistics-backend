export class CompanyRate {
    PK: string; //Partition key
    SK: string; //Range Key
    fromTo: string;
    companyName: string;
    rate: number;

    constructor(PK: string, SK: string, fromTo: string, companyName: string, rate: number) {
        this.PK = PK;
        this.SK = SK;
        this.fromTo = fromTo;
        this.companyName = companyName;
        this.rate = rate;
    }
}
