package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilisateurDTO {
    private Long id;
    private Long nif;
    private String nom;
    private String prenom;
    private String raison_sociale;
    private String email;
    private String nature;
    private String type;
    private String date_approuv;
    private String date_naissance;
    private String cin;
    private String registre_commerce;
    private String date_creation;
    private String matricule_agent;
    private String bureau_affectation;
}
