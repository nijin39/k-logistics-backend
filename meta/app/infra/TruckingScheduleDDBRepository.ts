import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { TruckingScheduleRepository } from '../domain/TruckingScheduleRepository';
import { TruckingSchedule } from '../domain/TruckingSchedule';
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

class TruckingScheduleDDBRepository implements TruckingScheduleRepository {
    private static instance: TruckingScheduleDDBRepository;

    private constructor() {
        TruckingScheduleDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!TruckingScheduleDDBRepository.instance) {
            TruckingScheduleDDBRepository.instance = new TruckingScheduleDDBRepository();
        }

        return this.instance;
    }

    async verify(truckingId: string) {
        const today = moment();

        const getParam = {
            TableName: 'Meta',
            Key: {
                PK: 'MAILLINE#TRUCKINGREQUEST',
                SK: 'TRUCKINGREQUEST#' + today.format('YYYYMMDD') + '#' + truckingId,
            },
        };

        console.log('PARAM :', getParam);

        const truckingSchedule = await dynamoDbClient.get(getParam).promise();
        const truckingScheduleResult = truckingSchedule.Item as TruckingSchedule;

        console.log('RESULT :', getParam);

        try {
            const param = {
                TableName: 'Meta',
                Item: { ...truckingScheduleResult, status: 'Verify' },
            };

            console.log('param:', param);

            await dynamoDbClient.put(param).promise();
        } catch (error) {
            console.log('DDB Error', error);
            throw new Error(JSON.stringify(error));
        }
    }

    async findAll(): Promise<TruckingSchedule[]> {
        const today = moment();

        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'MAILLINE#TRUCKINGREQUEST',
                ':sk': 'TRUCKINGREQUEST#' + today.format('YYYYMMDD'),
            },
        };

        try {
            const result = await dynamoDbClient.query(param).promise();
            return result.Items as TruckingSchedule[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async delete(truckingId: string) {
        const today = moment();

        const params = {
            TableName: MetaTable,
            Key: {
                PK: 'MAILLINE#TRUCKINGREQUEST',
                SK: 'TRUCKINGREQUEST#' + today.format('YYYYMMDD') + '#' + truckingId,
            },
        };

        try {
            await dynamoDbClient.delete(params).promise();
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }
}

export default TruckingScheduleDDBRepository;
