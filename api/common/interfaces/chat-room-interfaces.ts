export interface IChatRoom {
    id: string;
    users?: IParticipant[];
}

export interface IParticipant {
    alias: string;
    active: boolean;
}