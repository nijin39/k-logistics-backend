export class TerminalArea {
    PK: string; //Partition key
    SK: string; //Range Key
    billingCompany: string;
    area: string;

    constructor(PK: string, SK: string, billingCompany: string, area: string) {
        this.PK = PK;
        this.SK = SK;
        this.billingCompany = billingCompany;
        this.area = area;
    }
}
