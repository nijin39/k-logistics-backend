export default class LambdaResponse {
    headers: {
        'Access-Control-Allow-Headers': string;
        'Access-Control-Allow-Origin': string; // Allow from anywhere
        'Access-Control-Allow-Methods': string;
    };
    statusCode: number;
    body: string;

    constructor(statusCode: number, body: string) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*', // Allow from anywhere
            'Access-Control-Allow-Methods': 'GET', // Allow only GET request
        };
    }
}
