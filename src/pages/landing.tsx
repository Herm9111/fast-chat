import { Container, TextField, Button, Stack, Divider, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { nanoid } from 'nanoid'
import { useNavigate } from "react-router-dom";
import { IChatRoom } from "../../api/common/interfaces/chat-room-interfaces";
import FastChatClient from '../clients/fast-chat-client';

const Landing = () => {
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();
    const fastChatClient = useMemo(()=> new FastChatClient(),[]);

    const handleTextChange = (e: any) => {
        setRoomId(e.target.value);
    }

    const handleTextEnterKey = (e: any) => {
        if (e.key === "Enter") {
            navigate(`/${roomId}`);
        }
    }

    const createRoom = () => {
        const id = nanoid(5);
        const gameRoom: IChatRoom = {
            id,
            users:[]
        }
        fastChatClient.createGameRoom(gameRoom)
        .then((room) => {
            navigate(`/${roomId}`);
        });
    }
    return (
        <Container maxWidth="sm">
            <Stack maxWidth="sm" spacing={1}>
                <Typography variant="h1" component="h1" align="center">Welcome to FastChat</Typography>
                <Grid container spacing={1}>
                    <Grid item xs={9}>
                        <TextField
                            size="small"
                            fullWidth
                            id="room-id-input"
                            label="Room ID"
                            variant="outlined"
                            onChange={handleTextChange}
                            value={roomId}
                            onKeyUp={handleTextEnterKey} />
                    </Grid>
                    <Grid item xs={3}>
                        <Button fullWidth size="large" variant="text" href={`/${roomId}`}>Go</Button>
                    </Grid>
                </Grid>
                <Divider>OR</Divider>
                <Button size="large" variant="contained" onClick={createRoom}>Create Room</Button>
            </Stack>
        </Container>
    );
};

export default Landing;