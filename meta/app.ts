import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import API from 'lambda-api';
import TerminalService from './app/application/TerminalService';

const api = API({});
const terminalService = TerminalService.getInstance();

api.get('/terminal', async (req, res) => {
    const terminals = await terminalService.findAll();
    res.cors({}).send({ terminals: terminals });
});

api.get('/all', async (req, res) => {
    const terminals = await terminalService.findAll();
    res.cors({}).send(terminals);
});

api.get('/company', (req, res) => {
    res.cors({
        maxAge: 84000000,
    }).send({
        companies: [
            {
                id: 1,
                companyName: '최고통운',
                companyNumber: '02-423-2341',
            },
            {
                id: 2,
                companyName: '민국통운',
                companyNumber: '044-211-2345',
            },
        ],
    });
});

exports.lambdaHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    console.log('EVENT :', JSON.stringify(event));
    return await api.run(event, context);
};
