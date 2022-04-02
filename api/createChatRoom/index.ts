import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.bindings.documentOut = JSON.stringify(req.body);
    context.res = {
      status: 200, /* Defaults to 200 */
      body: JSON.stringify(req.body),
      headers: {
          'Content-Type': 'application/json'
      }
  }
};

export default httpTrigger;