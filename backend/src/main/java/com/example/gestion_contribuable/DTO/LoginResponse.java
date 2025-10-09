package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String message;
    private String token;
    private UtilisateurDTO utilisateur;

    public LoginResponse() {}
    public LoginResponse(String message, String token, UtilisateurDTO utilisateur) {
        this.setMessage(message);
        this.setToken(token);
        this.setUtilisateur(utilisateur);
    }
}
