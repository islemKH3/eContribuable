export interface Reclamation{
    id: number;
    objet: string;
    contenu_rec: string;
    status: string;
    date_reclamation: string;
    id_utilisateur: number;
    id_agent?: number;
    nom?: string;
    prenom?: string;
    raison_sociale?: string;
    raison_refus?: string;
}