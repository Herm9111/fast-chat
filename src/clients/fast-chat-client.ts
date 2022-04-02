import { IChatRoom } from '../../api/common/interfaces/chat-room-interfaces';
import { IPubSubConnection } from '../../api/common/interfaces/pub-sub-interfaces';


class FastChatClient {
    private endPointBase = '/api'

    createGameRoom(gameRoomData: IChatRoom): Promise<IChatRoom> {
        const uri = `${this.endPointBase}/createChatRoom`
        return new Promise((resolve) => {
            fetch(uri, { method: "POST", body: JSON.stringify(gameRoomData) })
            .then(response => {
                return response.json()}
                )
            .then(json => resolve(json));
        });   
    }

    getGameData(roomId: string): Promise<string> {
        const uri = `${this.endPointBase}/getChatRoom/${roomId}`
        return new Promise((resolve) => {
            fetch(uri, { method: "GET"})
            .then(response => {
                return response.json()}
                )
            .then(json => resolve(json));
        });   
    }

    getPubSubConnection(): Promise<IPubSubConnection> {
        let uri = `${this.endPointBase}/getPubSubConnection`
        return new Promise((resolve) => {
            fetch(uri, { method: "GET"})
            .then(response => {
                return response.json()}
                )
            .then(json => resolve(json));
        });   
    }
}

export default FastChatClient;
