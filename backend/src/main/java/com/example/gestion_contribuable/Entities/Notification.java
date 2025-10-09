package com.example.gestion_contribuable.Entities;

import com.example.gestion_contribuable.Enums.StatusNotif;
import com.example.gestion_contribuable.Enums.TypeNotif;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notif")
    private Long idNotif;

    @Enumerated(EnumType.STRING)
    private TypeNotif type;

    @Column(name = "date_notif")
    private LocalDateTime dateNotif;

    @Column(name = "notif_content")
    private String notifContent;

    @Enumerated (EnumType.STRING)
    private StatusNotif status;

    @ManyToOne
    @JoinColumn(name="utilisateur_id")
    private Utilisateur utilisateur;
}
