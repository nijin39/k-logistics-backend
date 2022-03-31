export class TerminalDistance {
    PK: string; //Partition key
    SK: string; //Range Key
    departure: string;
    arrival: string;
    distance: number;

    constructor(PK: string, SK: string, departure: string, arrival: string, distance: number) {
        this.PK = PK;
        this.SK = SK;
        this.departure = departure;
        this.arrival = arrival;
        this.distance = distance;
    }
}
