import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IPubSubConnection } from "../../api/common/interfaces/pub-sub-interfaces";
import { IUser } from "../../api/common/interfaces/user-interface";
import FastChatClient from "../clients/fast-chat-client";

type Props = {
    userData: IUser;
  };

const FastChat = ({ userData }: Props) => {
    let { roomId } = useParams();
    const navigate = useNavigate();
    const fastChatClient = useMemo(()=> new FastChatClient(),[]);
    const [pubSubConnection, setPubSubConnection] = useState<IPubSubConnection>();
    
    useEffect(()=> {
        roomId && fastChatClient.getGameData(roomId)
        .catch(e => {
            navigate(`/`);
        });
    },[fastChatClient, roomId, navigate]);

    useEffect(() =>{
        fastChatClient.getPubSubConnection()
        .then(setPubSubConnection);
    },[fastChatClient])

    useEffect(() => {
        console.log(pubSubConnection);
    },[pubSubConnection]);
    return <>
        <h1>Welcome to FastChat</h1>
        <h2>Room: {roomId}</h2>
    </>;
};

export default FastChat;