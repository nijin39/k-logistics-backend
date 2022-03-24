import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import API from 'lambda-api';
import CompanyService from './app/application/CompanyService';
import TerminalAreaService from './app/application/TerminalAreaService';
import TerminalService from './app/application/TerminalService';
import { TerminalArea } from './app/domain/TerminalArea';

const api = API({});
const terminalService = TerminalService.getInstance();
const terminalAreaService = TerminalAreaService.getInstance();
const companyService = CompanyService.getInstance();

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
    const { fromTo, companyName, rate } = JSON.parse(JSON.stringify(req.body));
    await companyService.companyRateSave(fromTo, companyName, rate);
    res.cors({}).send({ status: 'saved success' });
});

api.get('/company-rate', async (req, res) => {
    const companyRates = await companyService.findAllCompanyRate();
    res.cors({}).send({ companyRates: companyRates });
});

api.get('/all', async (req, res) => {
    const terminals = await terminalService.findAll();
    res.cors({}).send(terminals);
});

api.get('/company', async (req, res) => {
    const companies = await companyService.findAll();
    res.cors({}).send({ companies: companies });
});

exports.lambdaHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    return await api.run(event, context);
};
