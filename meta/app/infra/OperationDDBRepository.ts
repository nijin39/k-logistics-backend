import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Operation } from '../domain/Operation';
import { OperationRepository } from '../domain/OperationRepository';
import moment from 'moment';

const agent = new https.Agent({
    keepAlive: true,
});

const serviceLocalConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: String(process.env.LOCAL_DYNAMODB_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.LOCAL_DYNAMODB_SECRET_ACESS_KEY),
};

const serviceConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
    httpOptions: {
        agent,
    },
};

if (process.env.AWS_SAM_LOCAL) {
    AWS.config.update(serviceLocalConfigOptions);
} else {
    AWS.config.update(serviceConfigOptions);
}

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const MetaTable = String(process.env.META_TABLE);

interface OperationSaveRequest {
    id: string;
    terminalArrival: string;
    terminalArrivalAreaCode: string;
    arrivalTime: string;
    terminalDeparture: string;
    terminalDepartureAreaCode: string;
    departureTime: string;
    carType: number;
}

class OperationDDBRepository implements OperationRepository {
    private static instance: OperationDDBRepository;

    private constructor() {
        OperationDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!OperationDDBRepository.instance) {
            OperationDDBRepository.instance = new OperationDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<Operation[]> {
        const today = moment();

        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'OPERATION',
                ':sk': today.format('YYYYMMDD') + '#',
            },
        };

        console.log('Params :', param);

        try {
            const result = await dynamoDbClient.query(param).promise();
            console.log(JSON.stringify(result.Items));
            return result.Items as Operation[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async save(operationSaveRequest: OperationSaveRequest) {
        const today = moment();

        const param = {
            TableName: MetaTable,
            Item: {
                PK: 'OPERATION',
                SK: today.format('YYYYMMDD') + '#' + operationSaveRequest.id,
                id: operationSaveRequest.id,
                terminalArrival: operationSaveRequest.terminalArrival,
                terminalArrivalAreaCode: operationSaveRequest.terminalArrivalAreaCode,
                arrivalTime: operationSaveRequest.arrivalTime,
                terminalDeparture: operationSaveRequest.terminalDeparture,
                terminalDepartureAreaCode: operationSaveRequest.terminalDepartureAreaCode,
                departureTime: operationSaveRequest.departureTime,
                carType: operationSaveRequest.carType,
            },
        };

        try {
            await dynamoDbClient.put(param).promise();
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }
}

export default OperationDDBRepository;
