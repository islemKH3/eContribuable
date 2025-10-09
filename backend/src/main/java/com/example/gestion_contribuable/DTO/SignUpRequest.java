package com.example.gestion_contribuable.DTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class SignUpRequest {
    private Long nif;
    private String email;
    private String mdp;
}
