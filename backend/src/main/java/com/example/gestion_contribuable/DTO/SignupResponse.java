package com.example.gestion_contribuable.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupResponse {
    private String message;

    public SignupResponse(String message) {
        this.message = message;
    }
}
