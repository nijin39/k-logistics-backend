import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import API from 'lambda-api';
import CompanyService from './app/application/CompanyService';
import OperationService from './app/application/OperationService';
import TerminalAreaService from './app/application/TerminalAreaService';
import TerminalService from './app/application/TerminalService';
import SettlementService from './app/application/SettlementService';
import { TerminalArea } from './app/domain/TerminalArea';
import TerminalDistanceService from './app/application/TerminalDistanceService';
import { TerminalDistance } from './app/domain/TerminalDistance';
import CapacityService from './app/application/CapacityService';
import { Capacity } from './app/domain/Capacity';
import TruckingService from './app/application/TruckingService';
import TruckingScheduleService from './app/application/TruckingScheduleService';

const api = API({});
const terminalService = TerminalService.getInstance();
const terminalAreaService = TerminalAreaService.getInstance();
const terminalDistanceService = TerminalDistanceService.getInstance();
const companyService = CompanyService.getInstance();
const operationService = OperationService.getInstance();
const settlementService = SettlementService.getInstance();
const capacityService = CapacityService.getInstance();
const truckingService = TruckingService.getInstance();
const truckingScheduleService = TruckingScheduleService.getInstance();

api.get('/terminal', async (req, res) => {
    const terminals = await terminalService.findAll();
    res.cors({}).send({
        terminals: terminals,
    });
});

api.post('/terminal-area', async (req, res) => {
    const { billingCompany, area } = JSON.parse(JSON.stringify(req.body));
    await terminalAreaService.save(billingCompany, area);
    res.cors({}).send({ status: 'saved success' });
});

api.get('/terminal-area', async (req, res) => {
    const terminalArea: TerminalArea[] = await terminalAreaService.findAll();
    res.cors({}).send({ terminalAreas: terminalArea });
});

api.post('/company-rate', async (req, res) => {
    console.log(JSON.stringify(req.body));
    const { fromTo, companyName, rate } = JSON.parse(JSON.stringify(req.body));
    try {
        await companyService.companyRateSave(fromTo, companyName, rate);
    } catch (error) {
        console.log('Error :', error);
    }
    const updatedRate = await companyService.findAllCompanyRate();
    res.cors({ headers: 'content-type, x-api-key', origin: '*' }).send({ companyRates: updatedRate });
});

api.get('/terminal-distance', async (req, res) => {
    const terminalDistance: TerminalDistance[] = await terminalDistanceService.findAll();
    res.cors({}).send({ terminalDistances: terminalDistance });
});

api.post('/terminal-distance', async (req, res) => {
    console.log(JSON.stringify(req.body));
    const { departure, arrival, distance } = JSON.parse(JSON.stringify(req.body));
    try {
        await terminalDistanceService.save(departure, arrival, Number(distance));
    } catch (error) {
        console.log('Error :', error);
    }
    //const updatedTerminalDistances = await terminalDistanceService.findAll();
    res.cors({ headers: 'content-type, x-api-key', origin: '*' }).send({ status: 'Success' });
});

api.post('/capacity', async (req, res) => {
    const { distance, capacity, price } = JSON.parse(JSON.stringify(req.body));
    try {
        await capacityService.save(Number(distance), Number(capacity), Number(price));
    } catch (error) {
        console.log('Error :', error);
    }
    //const updatedTerminalDistances = await terminalDistanceService.findAll();
    res.cors({ headers: 'content-type, x-api-key', origin: '*' }).send({ status: 'Success' });
});

api.get('/capacity', async (req, res) => {
    const capacities: Capacity[] = await capacityService.findAll();
    res.cors({}).send({ capacities: capacities });
});

api.get('/company-rate', async (req, res) => {
    const companyRates = await companyService.findAllCompanyRate();
    res.cors({}).send({ companyRates: companyRates });
});

api.get('/operation', async (req, res) => {
    const operations = await operationService.findAll();
    res.cors({}).send({ operations: operations });
});

api.get('/settlement', async (req, res) => {
    const settlements = await settlementService.findAll();
    res.cors({}).send({ settlements: settlements });
});

api.post('/trucking', async (req, res) => {
    const truckingRequest: TruckingRequest = JSON.parse(JSON.stringify(req.body));
    try {
        await truckingService.save(truckingRequest);
    } catch (error) {
        console.log('Error :', error);
    }
    //const updatedTerminalDistances = await terminalDistanceService.findAll();
    res.cors({ headers: 'content-type, x-api-key', origin: '*' }).send({ status: 'Success' });
});

api.get('/trucking', async (req, res) => {
    const truckings = await truckingService.findAll();
    res.cors({}).send({ truckings: truckings });
});

api.delete('/trucking', async (req, res) => {
    //const truckings = await truckingService.findAll();
    const deleteParams: string[] = JSON.parse(JSON.stringify(req.body));
    try {
        await truckingService.delete(deleteParams);
        return res.cors({}).send({ result: 'Success all trucking' });
    } catch (error) {
        return res.cors({}).status(500);
    }
});

api.post('/trucking-all-request', async (req, res) => {
    try {
        await truckingService.truckingRequestAll();
    } catch (error) {
        console.log('Error :', error);
    }
    //const updatedTerminalDistances = await terminalDistanceService.findAll();
    res.cors({ headers: 'content-type, x-api-key', origin: '*' }).send({ status: 'Success' });
});

api.get('/trucking-all-request', async (req, res) => {
    const truckingSchedule = await truckingScheduleService.findAll();
    //const updatedTerminalDistances = await terminalDistanceService.findAll();
    res.cors({ headers: 'content-type, x-api-key', origin: '*' }).send({ truckingSchedules: truckingSchedule });
});

api.delete('/trucking-schedule', async (req, res) => {
    const deleteParams: string[] = JSON.parse(JSON.stringify(req.body));

    try {
        await truckingScheduleService.delete(deleteParams);
        return res.cors({}).send({ result: 'Success all trucking' });
    } catch (error) {
        return res.cors({}).status(500);
    }
});

api.put('/trucking-verify', async (req, res) => {
    const verifyParams: string[] = JSON.parse(JSON.stringify(req.body.data));

    try {
        await truckingScheduleService.verify(verifyParams);
        return res.cors({}).send({ result: 'Success all trucking' });
    } catch (error) {
        console.log('API Error', error);
        return res.cors({}).status(500);
    }
});

api.put('/trucking-assign', async (req, res) => {
    const assignTrucking: AssignTrucking = JSON.parse(JSON.stringify(req.body));

    try {
        await truckingScheduleService.assignTruck(assignTrucking);
        return res.cors({}).send({ result: 'Success all trucking' });
    } catch (error) {
        console.log('API Error', error);
        return res.cors({}).status(500);
    }
});

api.post('/settlement', async (req, res) => {
    const settlements = await settlementService.settlement();
    res.cors({}).send({ settlements: settlements });
});

api.delete('/settlement', async (req, res) => {
    await settlementService.reset();
    res.cors({}).send({ result: 'Success all settlement' });
});

api.get('/all', async (req, res) => {
    const terminals = await terminalService.findAll();
    res.cors({}).send(terminals);
});

api.get('/company', async (req, res) => {
    const companies = await companyService.findAll();
    res.cors({}).send({ companies: companies });
});

interface TruckingRequest {
    truckingId: string;
    departureName: string;
    departureId: string;
    arrivalName: string;
    arrivalId: string;
    carType: string;
    truckingCount: number;
}

interface AssignTrucking {
    truckingId: string;
    value: string;
}

exports.lambdaHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    return await api.run(event, context);
};
