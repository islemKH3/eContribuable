package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type_contribuable", discriminatorType=DiscriminatorType.STRING)
public class Contribuable {
    @Id
    private Long nif;
    private String adresse;

    @Column(name = "regime_fisc")
    private String regimeFisc;

    @Column(name = "num_tel")
    private Long numTel;

    @Column(name = "email_ctr")
    private String emailCtr;

    @Column(name="matricule_fisc")
    private String matriculeFisc;

    @OneToOne (mappedBy = "contribuable")
    private ClientFiscal clientFiscal;

    @OneToOne
    @JoinColumn (name="id_uea")
    private UtilisateurEnAttente compteEnAttente;

    public String getType() {
        return this.getClass().getSimpleName();
    }
}
