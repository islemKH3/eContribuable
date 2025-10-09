package com.example.gestion_contribuable.Entities;

import com.example.gestion_contribuable.Enums.TypeAgent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

@Entity
@DiscriminatorValue("AGENT")
public class AgentFiscal extends Utilisateur{
    private String cin;
    private String nom;
    private String prenom;

    @Column(name="matricule_agent")
    private Long matriculeAgent;

    @Column(name="bureau_affectation")
    private String bureauAffectation;

    @OneToMany(mappedBy="agentFisc")
    private List<Reclamation> reclamationsTriatées;

    @Enumerated(EnumType.STRING)
    private TypeAgent typeAgent;

    @Override
    public String getNature() {
        return "AGENT";
    }
}
