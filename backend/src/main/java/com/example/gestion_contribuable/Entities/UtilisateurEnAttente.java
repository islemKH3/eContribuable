package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class UtilisateurEnAttente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_uea")
    private Long idUea;

    @OneToOne (mappedBy="compteEnAttente")
    private Contribuable contribuable;

    @Column(name = "email_user")
    private String emailUser;
    private String mdp;

    @Column(name = "date_inscrip")
    private LocalDateTime dateInscrip;
}
