import { Reclamation } from "./Reclamation";

export interface RecAgentStatsDTO {
    agentId: number;
    nom: string;
    prenom: string;
    totalTraite: number;
    totalAccepte: number;
    totalRefuse: number;
    reclamations_accept: Reclamation[];
    reclamations_refuse: Reclamation[];
}