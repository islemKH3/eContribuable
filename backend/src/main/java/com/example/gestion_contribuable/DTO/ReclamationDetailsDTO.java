package com.example.gestion_contribuable.DTO;

import com.example.gestion_contribuable.Enums.StatusRec;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ReclamationDetailsDTO {
    private Long id;
    private String objet;
    private String contenu;
    private StatusRec status;
    private String raison;
    private String agent;
    private List<FileDetailsDTO> fichiers = new ArrayList<>();
}
