import * as router from 'aws-lambda-router';
import { Context } from 'aws-lambda';
import { RouterEvent } from 'aws-lambda-router';
import { ProxyIntegrationResult } from 'aws-lambda-router/lib/proxyIntegration';
import LambdaResponse from './util/LambdaResponse';

export const lambdaHandler: <TContext extends Context>(event: RouterEvent, context: TContext) => Promise<any> =
    router.handler({
        proxyIntegration: {
            routes: [
                {
                    path: '/terminals',
                    method: 'GET',
                    action: async (request) => {
                        const response: LambdaResponse = new LambdaResponse(
                            200,
                            JSON.stringify({
                                terminals: [
                                    {
                                        id: 1,
                                        terminalName: '서울',
                                        terminalGeo: 'Seoul',
                                    },
                                    {
                                        id: 2,
                                        terminalName: '부산',
                                        terminalGeo: 'Busan',
                                    },
                                ],
                            }),
                        );
                        console.log('CREATE CUSTOM', request);
                        return response as ProxyIntegrationResult;
                    },
                },
            ],
        },
    });

// export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     let response: APIGatewayProxyResult;
//     console.log(event);
//     try {
//         response = {
//             statusCode: 200,
//             headers: {
//                 'Access-Control-Allow-Headers': 'Content-Type',
//                 'Access-Control-Allow-Origin': '*', // Allow from anywhere
//                 'Access-Control-Allow-Methods': 'GET', // Allow only GET request
//             },
//             body: JSON.stringify({
//                 terminals: [
//                     {
//                         id: 1,
//                         terminalName: '서울',
//                         terminalGeo: 'Seoul',
//                     },
//                     {
//                         id: 2,
//                         terminalName: '부산',
//                         terminalGeo: 'Busan',
//                     },
//                 ],
//             }),
//         };
//     } catch (err) {
//         console.log(err);
//         response = {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'some error happened',
//             }),
//         };
//     }

//     return response;
// };
