import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { CapacityRepository } from '../domain/CapacityRepository';
import { Capacity } from '../domain/Capacity';

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

class CapacityDDBRepository implements CapacityRepository {
    private static instance: CapacityDDBRepository;

    private constructor() {
        CapacityDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!CapacityDDBRepository.instance) {
            CapacityDDBRepository.instance = new CapacityDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<Capacity[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'META#CAPACITY',
            },
        };

        try {
            const result = await dynamoDbClient.query(param).promise();
            return result.Items as Capacity[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async save(distance: number, capacity: number) {
        const param = {
            TableName: 'Meta',
            Item: {
                PK: 'META#CAPACITY',
                SK: 'CAPACITY#' + capacity + '#' + distance,
                distance: distance,
                capacity: capacity,
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

export default CapacityDDBRepository;
