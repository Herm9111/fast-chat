import { Box, Container, Paper, TextField, Stack, Button, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUser } from "../../api/common/interfaces/user-interface";
import FastChatClient from "../clients/fast-chat-client";
import FastChatWSClient from "../clients/fast-chat-ws-client";

type Props = {
    userData: IUser;
};

type message = {
    fromUserId: string
    message: string
    receivedOn: Date
    sentOn: Date
}

const FastChat = ({ userData }: Props) => {
    let { roomId } = useParams();
    const navigate = useNavigate();

    const fastChatClient = useMemo(() => new FastChatClient(), []);
    const wsClient = useRef<FastChatWSClient>();
    const messagesContainer = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState<string>("");
    const [messages, setMessages] = useState<message[]>([]);

    useEffect(() => {
        if (messagesContainer) {
            messagesContainer.current!.addEventListener('DOMNodeInserted', (event: any) => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])

    useEffect(() => {
        roomId && fastChatClient.getGameData(roomId)
            .catch(e => {
                navigate(`/`);
            });
    }, [fastChatClient, roomId, navigate]);

    useEffect(() => {
        fastChatClient.getPubSubConnection()
            .then((connection) => wsClient.current = new FastChatWSClient(connection, roomId!))
            .then(() => {
                if (wsClient.current && wsClient.current.wsClient)
                    wsClient.current.setMessageReceiver(messageReceivedHandler);
            });
    }, [fastChatClient, roomId]);

    const messageReceivedHandler = (data: message) => {
        let parseData = data;
        parseData.receivedOn = new Date(data.receivedOn);
        parseData.sentOn = new Date(data.sentOn);
        setMessages(old => [...old, data])
    }

    const handleTextEnterKey = (e: any) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    const sendMessage = () => {
        if (wsClient.current && wsClient.current.wsClient && inputText) {
            let message = {
                "sentOn": new Date(),
                "message": inputText
            }
            wsClient.current.sendToGroup(message);
            setInputText("");
        }
    }


    return (
        <Container maxWidth="sm">
            <Typography variant="h2" component="h1" align="center">Welcome to FastChat</Typography>
            <Typography variant="h3" component="h2" align="center">Room: {roomId}</Typography>
            <Stack spacing={2}>
                <Paper>
                    <Box component="div" sx={{ height: '30em', overflowY: 'auto' }} ref={messagesContainer}>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <Typography variant="body1" component="span" align="center">{`[${message.receivedOn.toISOString().substr(11)}]${message.fromUserId}: ${message.message}`}</Typography>
                            </div>
                        ))}
                    </Box>
                </Paper>
                <Grid container spacing={1}>
                    <Grid item xs={9}>
                        <TextField
                            fullWidth
                            id="message-input"
                            variant="outlined"
                            onChange={e => setInputText(e.target.value)}
                            value={inputText}
                            onKeyUp={handleTextEnterKey} />
                    </Grid>
                    <Grid item xs={3}>
                        <Button fullWidth size="large" variant="text" onClick={sendMessage}>Send</Button>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
};

export default FastChat;