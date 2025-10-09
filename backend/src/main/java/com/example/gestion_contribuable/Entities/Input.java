package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Input {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_input")
    private Long idInput;

    @ManyToOne
    @JoinColumn(name="id_chat")
    private Conversation conversation;

    @OneToOne
    @JoinColumn(name="id_output")
    private Output reponseAi;

    @Column(name = "msg_input", columnDefinition = "TEXT")
    private String msgInput;

    @Column(name = "date_input")
    private LocalDateTime dateInput;
}
