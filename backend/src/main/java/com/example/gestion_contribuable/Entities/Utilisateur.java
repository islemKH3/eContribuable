package com.example.gestion_contribuable.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name= "type_utilisateur", discriminatorType = DiscriminatorType.STRING)
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Long idUtilisateur;

    @Column(name = "email_user")
    private String emailUser;
    private String mdp;

    @OneToMany (mappedBy="utilisateur")
    private List<Notification> notifications;

    public String getNature() {
        return this.getClass().getSimpleName();
    }
}
