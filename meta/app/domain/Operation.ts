export class Operation {
    PK: string; //Partition key
    SK: string; //Range Key
    id: string;
    terminalArrival: string;
    terminalArrivalAreaCode: string;
    arrivalTime: string;
    terminalDeparture: string;
    terminalDepartureAreaCode: string;
    departureTime: string;
    carType: number;

    constructor(
        PK: string,
        SK: string,
        id: string,
        terminalArrival: string,
        terminalArrivalAreaCode: string,
        arrivalTime: string,
        terminalDeparture: string,
        terminalDepartureAreaCode: string,
        departureTime: string,
        carType: number,
    ) {
        this.PK = PK;
        this.SK = SK;
        this.id = id;
        this.terminalArrival = terminalArrival;
        this.terminalArrivalAreaCode = terminalArrivalAreaCode;
        this.arrivalTime = arrivalTime;
        this.terminalDeparture = terminalDeparture;
        this.terminalDepartureAreaCode = terminalDepartureAreaCode;
        this.departureTime = departureTime;
        this.carType = carType;
    }
}
