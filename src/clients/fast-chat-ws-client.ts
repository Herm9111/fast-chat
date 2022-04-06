import { IPubSubConnection } from "../../api/common/interfaces/pub-sub-interfaces";

class FastChatWSClient {
    baseUrl: string;
    url: string;
    accessToken: string;
    wsClient: WebSocket;
    ackId = 0;
    roomId: string;
    messageQueue: { [key: number]: any } = {};

    constructor(connection: IPubSubConnection, roomId: string) {
        this.roomId = roomId;
        this.baseUrl = connection.baseUrl;
        this.url = connection.url;
        this.accessToken = connection.accessToken;
        this.wsClient = new WebSocket(this.url, 'json.webpubsub.azure.v1');
        this.wsClient.onopen = () => {
            this.joinGroup();
        };

    }

    setMessageReceiver(callback: (data: any) => void) {
        this.wsClient.onmessage = (event) => {
            let message = JSON.parse(event.data);
            if (message.type === 'message') {
                message.data['fromUserId'] = message.fromUserId;
                message.data['receivedOn'] = new Date().toISOString();
                callback(message.data);
            }

            if (message.type === 'ack') {
                if (message.success || message.error.name === 'Duplicate') {
                    delete this.messageQueue[message.ackId];
                }
                else {
                    this.wsClient && this.wsClient.send(
                        JSON.stringify(this.messageQueue[message.ackId]));
                }
            }
        }
    }

    private joinGroup() {
        let ackId = ++this.ackId
        let message = {
            type: 'joinGroup',
            group: this.roomId,
            ackId
        }
        this.messageQueue[ackId] = message;

        this.wsClient && this.wsClient.send(
            JSON.stringify(message));
    }

    sendToGroup<T>(data: T) {
        let ackId = ++this.ackId
        let message = {
            type: 'sendToGroup',
            group: this.roomId,
            ackId,
            dataType: "json",
            data
        }
        this.messageQueue[ackId] = message;

        this.wsClient && this.wsClient.send(
            JSON.stringify(message));
    }
}

export default FastChatWSClient;
