package com.example.gestion_contribuable.Controllers;

import com.example.gestion_contribuable.DTO.*;
import com.example.gestion_contribuable.Repositories.UtilisateurRepository;
import com.example.gestion_contribuable.Services.AuthService;
import com.example.gestion_contribuable.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final NotificationService notificationService;

    @Autowired
    public AuthController(AuthService authService, NotificationService notificationService) {
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signUp(@RequestBody SignUpRequest request) {
        try{
            authService.signup(request.getNif(), request.getEmail(), request.getMdp());
            notificationService.notifyAdminsOfNewSignup();
            return ResponseEntity.ok(new SignupResponse("Demande d'inscription envoyée."));
        } catch (IllegalArgumentException e){
            return ResponseEntity
                    .badRequest()
                    .body(new SignupResponse(e.getMessage()));
        }

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try{
            LoginResponse response=authService.login(request.getEmail(), request.getMdp());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(e.getMessage(), "pas de token", null));
        }
    }
}
