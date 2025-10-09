import { InputDTO } from "./InputDTO";

export interface Chatbot {
    utilisateur: number;
    nif: number;
    date: string;
    input: InputDTO[];
}