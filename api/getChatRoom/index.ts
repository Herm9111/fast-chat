import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { IChatRoom } from "../common/interfaces/chat-room-interfaces";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, inputDocument: IChatRoom): Promise<void> {
    if (inputDocument) {
        context.res = {
            status: 200, /* Defaults to 200 */
            body: inputDocument
        };
    } else {
        context.res = {
            status: 404
        };
    }
    

};

export default httpTrigger;