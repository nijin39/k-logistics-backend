import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { TerminalDistanceRepository } from '../domain/TerminalDistanceRepository';
import { TerminalDistance } from '../domain/TerminalDistance';

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

class TerminalDistanceDDBRepository implements TerminalDistanceRepository {
    private static instance: TerminalDistanceDDBRepository;

    private constructor() {
        TerminalDistanceDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!TerminalDistanceDDBRepository.instance) {
            TerminalDistanceDDBRepository.instance = new TerminalDistanceDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<TerminalDistance[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'META#TERMINALDISTANCE',
            },
        };

        try {
            const result = await dynamoDbClient.query(param).promise();
            return result.Items as TerminalDistance[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async save(departure: string, arrival: string, distance: number) {
        const param = {
            TableName: 'Meta',
            Item: {
                PK: 'META#TERMINALDISTANCE',
                SK: 'TERMINALDISTANCE#' + departure + '#' + arrival,
                departure: departure,
                arrival: arrival,
                distance: distance,
            },
        };

        try {
            await dynamoDbClient.put(param).promise();
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async findByFromTo(departure: string, arrival: string): Promise<TerminalDistance> {
        const params = {
            TableName: MetaTable,
            Key: {
                PK: 'META#TERMINALDISTANCE',
                SK: 'TERMINALDISTANCE#' + departure + '#' + arrival,
            },
        };
        try {
            const result = await dynamoDbClient.get(params).promise();
            return result.Item as TerminalDistance;
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }
}

export default TerminalDistanceDDBRepository;
