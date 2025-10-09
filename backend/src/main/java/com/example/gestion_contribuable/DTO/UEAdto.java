package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UEAdto {
    private Long id;
    private Long nif;
    private String email;
    private String mdp;
    private String nom;
    private String prenom;
    private String raison_sociale;
    private String date_naissance;
    private String cin;
    private String registre_commerce;
    private String date_creation;
    private String type;
}
