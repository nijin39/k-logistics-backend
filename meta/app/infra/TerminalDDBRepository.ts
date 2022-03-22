import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Terminal } from '../domain/Terminal';
import { TerminalRepository } from '../domain/TerminalRepository';

const serviceLocalConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
    endpoint: 'http://dynamodb-local:8000',
    accessKeyId: String(process.env.LOCAL_DYNAMODB_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.LOCAL_DYNAMODB_SECRET_ACESS_KEY),
};

const serviceConfigOptions: ServiceConfigurationOptions = {
    region: 'ap-northeast-2',
};

if (process.env.AWS_SAM_LOCAL) {
    AWS.config.update(serviceLocalConfigOptions);
} else {
    AWS.config.update(serviceConfigOptions);
}

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const MetaTable = String(process.env.META_TABLE);

class TerminalDDBRepository implements TerminalRepository {
    private static instance: TerminalDDBRepository;

    private constructor() {
        TerminalDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!TerminalDDBRepository.instance) {
            TerminalDDBRepository.instance = new TerminalDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<Terminal[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'META#TERMINAL',
            },
        };

        console.log('Params :', param);

        try {
            const result = await dynamoDbClient.query(param).promise();
            console.log(JSON.stringify(result.Items));
            return result.Items as Terminal[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }
}

export default TerminalDDBRepository;
