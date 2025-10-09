package com.example.gestion_contribuable.Controllers;

import com.example.gestion_contribuable.DTO.FileDetailsDTO;
import com.example.gestion_contribuable.DTO.ReclamationDTO;
import com.example.gestion_contribuable.DTO.ReclamationDetailsDTO;
import com.example.gestion_contribuable.Entities.AgentFiscal;
import com.example.gestion_contribuable.Entities.Reclamation;
import com.example.gestion_contribuable.Entities.ClientFiscal;
import com.example.gestion_contribuable.Repositories.AgentFiscalRepository;
import com.example.gestion_contribuable.Repositories.ClientFiscalRepository;
import com.example.gestion_contribuable.Repositories.ReclamationRepository;
import com.example.gestion_contribuable.Repositories.UtilisateurRepository;
import com.example.gestion_contribuable.Services.NotificationService;
import com.example.gestion_contribuable.Services.ReclamationService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {

    @Autowired
    private ReclamationService reclamationService;
    @Autowired
    private ReclamationRepository reclamationRepository;
    @Autowired
    private ClientFiscalRepository clientFiscalRepository;
    @Autowired
    private AgentFiscalRepository agentFiscalRepository;
    @Autowired
    private NotificationService notificationService;

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping(value = "/create-with-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> creerReclamation(
            @RequestPart("reclamation") ReclamationDTO dto,
            @RequestPart(value="files", required = false) MultipartFile[] files,
            @RequestParam(value = "ocrText", required = false) String[] ocrText
    ) throws IOException, TesseractException {
        try{
            reclamationService.creerReclamationAvecFichiers(dto, files, ocrText);
            notificationService.notifyAgentsOfNewRec();
            return ResponseEntity.ok("Réclamation enregistrée avec ID ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du traitement de l'enregistrement" + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReclamationByUser(@PathVariable Long userId) {
        ClientFiscal user = clientFiscalRepository.getByIdUtilisateur(userId);
        List<Reclamation> reclamations= reclamationService.getReclamationsByUser(user);
        List<ReclamationDTO> results=reclamationService.convertToDtoList(reclamations);
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllReclamation() {
        List<Reclamation> reclamations= reclamationService.getAllReclamations();
        List<ReclamationDTO> results=reclamationService.convertToDtoList(reclamations);
        return ResponseEntity.ok(results);
    }


    @PreAuthorize("hasRole('AGENT')")
    @PostMapping("/{id_rec}/{id_agent}/approve")
    public ResponseEntity<String> approveRec(@PathVariable Long id_rec, @PathVariable Long id_agent) {
        try {
            Reclamation r=reclamationRepository.findByIdRec(id_rec);
            AgentFiscal agent = agentFiscalRepository.getByIdUtilisateur(id_agent);
            reclamationService.acceptRec(r, agent);
            notificationService.notifyClientOfAcceptedRec();
            return ResponseEntity.ok("Réclamation approuvée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error approving reclamation."+e.getMessage());
        }
    }

    @PreAuthorize("hasRole('AGENT')")
    @PostMapping("/{id_rec}/{id_agent}/refuse")
    public ResponseEntity<String> rejectRec(@PathVariable Long id_rec, @PathVariable Long id_agent, @RequestParam String raison) {
        try {
            Reclamation r=reclamationRepository.findByIdRec(id_rec);
            AgentFiscal agent = agentFiscalRepository.getByIdUtilisateur(id_agent);
            reclamationService.rejectRec(r, agent, raison);
            notificationService.notifyClientOfRejectedRec();
            return ResponseEntity.ok("Réclamation refusée avec succés.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error refusing Reclamation."+e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'AGENT')")
    @GetMapping("/{id}/details")
    public ResponseEntity<ReclamationDetailsDTO> getReclamationDetails(@PathVariable Long id){
        ReclamationDetailsDTO dto = reclamationService.getReclamationDetails(id);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'AGENT')")
    @GetMapping("/files/{fileId}/download")
    public ResponseEntity<byte[]> downloadFile (@PathVariable Long fileId){
        FileDetailsDTO file = reclamationService.getFileDetails(fileId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file.getFileData());
    }

}
