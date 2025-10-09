package com.example.gestion_contribuable.DTO;
import com.example.gestion_contribuable.Enums.StatusRec;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

public class ReclamationDTO {

    public Long id;
    public String objet;
    public String contenu_rec;
    @Enumerated(EnumType.STRING)
    public StatusRec status;
    public LocalDateTime date_reclamation;
    public Long id_utilisateur;
    public Long id_agent;
    public String nom;
    public String prenom;
    public String raison_sociale;
    public String raison_refus;

    public ReclamationDTO() {}
}
