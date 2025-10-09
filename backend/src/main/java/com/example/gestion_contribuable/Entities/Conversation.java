package com.example.gestion_contribuable.Entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chat")
    private Long idChat;

    @OneToOne (mappedBy="conversation")
    private ClientFiscal clientFiscal;

    @Column(name = "date_chat")
    private LocalDateTime dateChat;

    @OneToMany(mappedBy="conversation", cascade = CascadeType.ALL)
    private List<Input> questions;
}