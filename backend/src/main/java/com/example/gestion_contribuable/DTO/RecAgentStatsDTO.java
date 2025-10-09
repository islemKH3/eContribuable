package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecAgentStatsDTO {
    private Long agentId;
    private String nom;
    private String prenom;
    private Long totalTraite;
    private Long totalAccepte;
    private Long totalRefuse;
    private List<ReclamationDTO> reclamations_accept;
    private List<ReclamationDTO> reclamations_refuse;

    public RecAgentStatsDTO(Long idUtilisateur, String nom, String prenom, long totalTraite, long totalAccepte, long totalRefuse, List<ReclamationDTO> recAccept, List<ReclamationDTO> recRefuse) {
        this.agentId = idUtilisateur;
        this.nom = nom;
        this.prenom = prenom;
        this.totalTraite = totalTraite;
        this.totalAccepte = totalAccepte;
        this.totalRefuse = totalRefuse;
        this.reclamations_accept = recAccept;
        this.reclamations_refuse = recRefuse;
    }
}
