package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class Valeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_val")
    private Long idVal;

    @ManyToOne
    @JoinColumn (name="id_pj")
    private Piece_jointe pieceJointe;

    private String attribut;
    private String valeur;
}
