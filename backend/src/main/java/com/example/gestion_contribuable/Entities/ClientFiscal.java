package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@DiscriminatorValue("CLIENT")
public class ClientFiscal extends Utilisateur{
    @OneToOne
    @JoinColumn(name="nif")
    private Contribuable contribuable;

    @OneToMany (mappedBy="clientFisc")
    private List<Reclamation> reclamations;

    @OneToOne
    @JoinColumn(name="id_chat")
    private Conversation conversation;

    @Column(name="date_approuv")
    private LocalDateTime dateApprouv;

    @Override
    public String getNature() {
        return "CLIENT";
    }
}
