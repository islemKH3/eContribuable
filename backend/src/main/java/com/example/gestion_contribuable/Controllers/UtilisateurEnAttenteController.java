package com.example.gestion_contribuable.Controllers;

import com.example.gestion_contribuable.DTO.UEAdto;
import com.example.gestion_contribuable.DTO.UtilisateurDTO;
import com.example.gestion_contribuable.Entities.UtilisateurEnAttente;
import com.example.gestion_contribuable.Services.UtilisateurEnAttenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/utilisateurs")
public class UtilisateurEnAttenteController {
    @Autowired
    private UtilisateurEnAttenteService ueService;

    @GetMapping("/utilisateurs-attente")
    public ResponseEntity<List<UEAdto>> getAll() {
        List<UEAdto> result= ueService.getAllUtilisateurs();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/inscris")
    public ResponseEntity<List<UtilisateurDTO>> getAllClient() {
        List<UtilisateurDTO> result = ueService.getAllClientFisc();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<String> approveUser(@PathVariable Long id) {
        try {
            ueService.approveUser(id);
            return ResponseEntity.ok("User approved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error approving user."+e.getMessage());
        }
    }

    @DeleteMapping("/{id}/refuse")
    public ResponseEntity<String> refuseUser(@PathVariable Long id) {
        try {
            ueService.refuseUser(id);
            return ResponseEntity.ok("User refused and deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error refusing user."+e.getMessage());
        }
    }

}

