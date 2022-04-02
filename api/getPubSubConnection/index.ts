import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { get } from "../common/http-clients/base-client";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const header = req.headers['x-ms-client-principal'];
    const encoded = Buffer.from(header, 'base64');
    const decoded = JSON.parse(encoded.toString('ascii'));
    let downheaders = {}
    downheaders['x-ms-client-principal-name'] = decoded.userDetails;
    const dataResponse = await get<any>('fast-chat-api.azurewebsites.net', '/api/getpubsubconnection', downheaders);
    context.res = {
        status: 200, /* Defaults to 200 */
        body: dataResponse
    };

};

export default httpTrigger;