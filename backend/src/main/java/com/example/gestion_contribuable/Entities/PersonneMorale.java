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
@DiscriminatorValue("PersonneMorale")
public class PersonneMorale extends Contribuable {

    @Column(name="raison_sociale")
    private String raisonSociale;

    @Column(name="registre_commerce")
    private String registreCommerce;

    @Column(name="date_creation")
    private LocalDate dateCreation;

    @Override
    public String getType(){
        return "PersonneMorale";
    }
}
