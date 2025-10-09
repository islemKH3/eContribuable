package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AskRequestDTO {
    private Long userId;
    private String question;

}