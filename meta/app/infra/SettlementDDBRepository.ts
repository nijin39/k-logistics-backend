import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { SettlementRepository } from '../domain/SettlementRepository';
import { Settlement } from '../domain/Settlement';

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

class SettlementDDBRepository implements SettlementRepository {
    private static instance: SettlementDDBRepository;

    private constructor() {
        SettlementDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!SettlementDDBRepository.instance) {
            SettlementDDBRepository.instance = new SettlementDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<Settlement[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'SETTLEMENT',
            },
        };

        console.log('Params :', param);

        try {
            const result = await dynamoDbClient.query(param).promise();
            console.log(JSON.stringify(result.Items));
            return result.Items as Settlement[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }
}

export default SettlementDDBRepository;
