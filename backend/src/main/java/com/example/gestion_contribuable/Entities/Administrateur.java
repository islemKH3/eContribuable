package com.example.gestion_contribuable.Entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

@Entity
@DiscriminatorValue("ADMIN")
public class Administrateur extends Utilisateur{
    private String cin;
    private String nom;
    private String prenom;

    @Override
    public String getNature() {
        return "ADMIN";
    }
}
