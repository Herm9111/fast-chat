import { HttpRequestHeaders } from "@azure/functions";
const https = require('https')

export async function get<T>(hostname:string, path: string, headers: HttpRequestHeaders): Promise<T> {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port:443,
            path,
            method:'GET',
            headers
        }

        const req = https.request(options, res => {
            const statusCode = res.statusCode;
            let error;

            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            }

            if (error) {
                console.log(error.message);
                reject(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }


            res.on('data', (d) => {
                resolve(d)});
        })

       req.on('error', (e) => {
            reject(`Got error: ${e.message}`);
        });

        req.end();
    });

}