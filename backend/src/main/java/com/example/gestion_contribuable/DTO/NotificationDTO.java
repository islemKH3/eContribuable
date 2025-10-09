package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class NotificationDTO {
    private Long id;
    private LocalDateTime date;
    private String type;
    private String content;
    private String status;
    private String utilisateur;
}
