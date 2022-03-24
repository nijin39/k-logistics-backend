import * as AWS from 'aws-sdk';
import https from 'https';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { CompanyRateRepository } from '../domain/CompanyRateRepository';
import { CompanyRate } from '../domain/CompanyRate';

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

class CompanyRateDDBRepository implements CompanyRateRepository {
    private static instance: CompanyRateDDBRepository;

    private constructor() {
        CompanyRateDDBRepository.instance = this;
    }

    static get getInstance() {
        if (!CompanyRateDDBRepository.instance) {
            CompanyRateDDBRepository.instance = new CompanyRateDDBRepository();
        }

        return this.instance;
    }

    async findAll(): Promise<CompanyRate[]> {
        const param = {
            TableName: MetaTable,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'META#COMPANYRATE',
            },
        };

        try {
            const result = await dynamoDbClient.query(param).promise();
            return result.Items as CompanyRate[];
        } catch (error) {
            console.log(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
    }

    async save(fromTo: string, companyName: string, rate: number) {
        const param = {
            TableName: MetaTable,
            Item: {
                PK: 'META#COMPANYRATE',
                SK: 'COMPANYRATE#' + fromTo,
                companyName: companyName,
                rate: rate,
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

export default CompanyRateDDBRepository;
