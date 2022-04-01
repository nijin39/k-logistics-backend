export class Capacity {
    PK: string; //Partition key
    SK: string; //Range Key
    distance: string;
    capacity: number;

    constructor(PK: string, SK: string, distance: string, capacity: number) {
        this.PK = PK;
        this.SK = SK;
        this.distance = distance;
        this.capacity = capacity;
    }
}
