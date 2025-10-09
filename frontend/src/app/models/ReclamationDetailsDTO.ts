import { FileDetailsDTO } from './FileDetailsDTO';

export interface ReclamationDetailsDTO {
    id: number;
    objet: string;
    contenu: string;
    status: string;
    raison?: string;
    agent?: string;
    fichiers: FileDetailsDTO[];
}