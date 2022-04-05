export class TruckingSchedule {
    PK: string; //Partition key
    SK: string; //Range Key
    truckingId: string;
    departureName: string;
    departureId: string;
    arrivalName: string;
    arrivalId: string;
    carType: string;
    truckingIndex: number;
    status: string;
    departureDateTime: string;
    arrivalDateTime: string;

    constructor(
        PK: string,
        SK: string,
        truckingId: string,
        departureName: string,
        departureId: string,
        arrivalName: string,
        arrivalId: string,
        carType: string,
        truckingIndex: number,
        status: string,
        departureDateTime: string,
        arrivalDateTime: string,
    ) {
        this.PK = PK;
        this.SK = SK;
        this.truckingId = truckingId;
        this.departureName = departureName;
        this.departureId = departureId;
        this.arrivalName = arrivalName;
        this.arrivalId = arrivalId;
        this.carType = carType;
        this.truckingIndex = truckingIndex;
        this.status = status;
        this.departureDateTime = departureDateTime;
        this.arrivalDateTime = arrivalDateTime;
    }
}
