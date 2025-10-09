package com.example.gestion_contribuable.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter

@Entity
@DiscriminatorValue("PersonnePhysique")
public class PersonnePhysique extends Contribuable{
    private String nom;
    private String prenom;

    @Column(name="date_naissance")
    private LocalDate dateNaissance;

    private String cin;

    @Override
    public String getType(){
        return "PersonnePhysique";
    }
}
