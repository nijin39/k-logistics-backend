import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import API from 'lambda-api';
import CompanyService from './app/application/CompanyService';
import TerminalService from './app/application/TerminalService';

const api = API({});
const terminalService = TerminalService.getInstance();
const companyService = CompanyService.getInstance();

api.get('/terminal', async (req, res) => {
    const terminals = await terminalService.findAll();
    res.cors({}).send({ terminals: terminals });
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
    console.log('EVENT :', JSON.stringify(event));
    return await api.run(event, context);
};
