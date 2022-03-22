export class Terminal {
    PK: string; //Partition key
    SK: string; //Range Key
    terminalName: string;
    terminalGeo: string;

    constructor(PK: string, SK: string, terminalName: string, terminalGeo: string) {
        this.PK = PK;
        this.SK = SK;
        this.terminalName = terminalName;
        this.terminalGeo = terminalGeo;
    }
}
