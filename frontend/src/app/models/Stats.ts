export interface AdminStatDTO {
    nb_tot_user: number;
    nb_contribuable: number;
    nb_agent: number;
    nb_admin: number;

    nb_rec: number;
    nb_rec_non_t:number;
    nb_inter: number;
}

export interface StatDTO {
    nb_rec: number;
    nb_rec_ref: number;
    nb_rec_acc: number;
    nb_rec_non_t: number;
}