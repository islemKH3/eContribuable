export interface UtilisateurDTO {
    id: number;
    nif?: number;
    nom?: string;
    prenom?: string;
    raison_sociale?: string;
    email: string;
    nature: string;
    type?: string;
    date_approuv?: string;
    date_naissance?: string;
    cin?: string;
    registre_commerce?: string;
    date_creation?: string;
    matricule_agent?: string;
    bureau_affectation?: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    utilisateur: UtilisateurDTO;
}