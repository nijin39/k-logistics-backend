export class Capacity {
    PK: string; //Partition key
    SK: string; //Range Key
    distance: number;
    capacity: number;
    price: number;

    constructor(PK: string, SK: string, distance: number, capacity: number, price: number) {
        this.PK = PK;
        this.SK = SK;
        this.distance = distance;
        this.capacity = capacity;
        this.price = price;
    }
}
