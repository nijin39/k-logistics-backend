import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { TruckingRepository } from '../domain/TruckingRepository';
import { Trucking } from '../domain/Trucking';

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

class TruckingDDBRepository implements TruckingRepository {
    private static instance: TruckingDDBRepository;

    private constructor() {
        TruckingDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!TruckingDDBRepository.instance) {
            TruckingDDBRepository.instance = new TruckingDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<Trucking[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'META#TRUCKING',
            },
        };

        try {
            const result = await dynamoDbClient.query(param).promise();
            return result.Items as Trucking[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async save(trucking: Trucking) {
        const param = {
            TableName: 'Meta',
            Item: {
                PK: 'META#TRUCKING',
                SK:
                    'TRUCKING#' +
                    trucking.departureId +
                    trucking.arrivalId +
                    String(trucking.truckingIndex).padStart(4, '0'),
                departureName: trucking.departureName,
                departureId: trucking.departureId,
                arrivalName: trucking.arrivalName,
                arrivalId: trucking.arrivalId,
                truckingId: trucking.truckingId,
                truckingIndex: trucking.truckingIndex,
                carType: trucking.carType,
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

export default TruckingDDBRepository;
