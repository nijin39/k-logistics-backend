export class Company {
    PK: string; //Partition key
    SK: string; //Range Key
    id: string;
    companyName: string;
    companyArea: string;

    constructor(PK: string, SK: string, id: string, companyName: string, companyArea: string) {
        this.PK = PK;
        this.SK = SK;
        this.id = id;
        this.companyName = companyName;
        this.companyArea = companyArea;
    }
}
