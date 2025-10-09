package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class ConversationDTO {
    private Long id;
    private Long utilisateur;
    private String nom;
    private String prenom;
    private LocalDateTime date;
    private List<InputDTO> input = new ArrayList<>();
}
