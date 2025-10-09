package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Output {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_output")
    private Long idOutput;

    @Column(columnDefinition = "TEXT", name = "msg_output")
    private String msgOutput;

    @OneToOne (mappedBy ="reponseAi")
    private Input question;
}
