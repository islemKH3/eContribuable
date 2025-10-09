package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
public class Piece_jointe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pj")
    private Long idPj;

    @ManyToOne
    @JoinColumn(name="id_rec")
    private Reclamation reclamation;

    private String titre;

    @Column(name = "contenu_pj", columnDefinition = "BYTEA")
    private byte[] contenuPj;

    private String extension;

    @Column(name = "contenu_extrait")
    private String contenuExtrait;

    @OneToMany(mappedBy = "pieceJointe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Valeur> valeurs;
}
