package com.example.gestion_contribuable.Entities;

import com.example.gestion_contribuable.Enums.StatusRec;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rec")
    private Long idRec;

    @ManyToOne
    @JoinColumn(name="id_utilisateur")
    private ClientFiscal clientFisc;

    @ManyToOne
    @JoinColumn(name="Age_id_utilisateur")
    private AgentFiscal agentFisc;

    @Column(name="raison_refus")
    private String raisonRefus;

    @Column(name = "date_rec")
    private LocalDateTime dateRec;
    private String objet;

    @Column(name = "contenu_rec", columnDefinition = "TEXT")
    private String contenuRec;

    @Enumerated(EnumType.STRING)
    private StatusRec status;

    @OneToMany (mappedBy ="reclamation" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Piece_jointe> piecesJointes;

}
