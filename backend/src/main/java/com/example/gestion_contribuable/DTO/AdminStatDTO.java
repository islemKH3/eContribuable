package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminStatDTO {

    private long nb_tot_user;
    private long nb_contribuable;
    private long nb_agent;
    private long nb_admin;

    private long nb_rec;
    private long nb_rec_non_t;
    private long nb_inter;
}
