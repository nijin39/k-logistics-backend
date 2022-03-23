import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { TerminalArea } from '../domain/TerminalArea';
import { TerminalAreaRepository } from '../domain/TerminalAreaRepository';

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

class TerminalAreaDDBRepository implements TerminalAreaRepository {
    private static instance: TerminalAreaDDBRepository;

    private constructor() {
        TerminalAreaDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!TerminalAreaDDBRepository.instance) {
            TerminalAreaDDBRepository.instance = new TerminalAreaDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<TerminalArea[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'META#TERMINALAREA',
            },
        };

        try {
            const result = await dynamoDbClient.query(param).promise();
            console.log(JSON.stringify(result.Items));
            return result.Items as TerminalArea[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async save(terminalArea: string, area: string) {
        const param = {
            TableName: 'Meta',
            Item: {
                PK: 'META#TERMINALAREA',
                SK: 'TERMINALAREA#' + terminalArea,
                billingCompany: terminalArea,
                area: area,
            },
        };

        try {
            console.log('Param ', param);
            await dynamoDbClient.put(param).promise();
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }
}

export default TerminalAreaDDBRepository;
