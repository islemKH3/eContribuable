package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.DTO.FileDetailsDTO;
import com.example.gestion_contribuable.DTO.ReclamationDTO;
import com.example.gestion_contribuable.DTO.ReclamationDetailsDTO;
import com.example.gestion_contribuable.Entities.*;
import com.example.gestion_contribuable.Enums.StatusRec;
import com.example.gestion_contribuable.Repositories.*;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import static com.fasterxml.jackson.databind.type.LogicalType.Map;

@Service
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final ClientFiscalRepository clientFiscalRepository;
    private final Piece_jointeRepository pieceJointeRepository;
    private final ValeurRepository valeurRepository;

    @Autowired
    public ReclamationService(ClientFiscalRepository clientFiscalRepository, ReclamationRepository reclamationRepository, Piece_jointeRepository pieceJointeRepository, ValeurRepository valeurRepository) {
        this.clientFiscalRepository = clientFiscalRepository;
        this.reclamationRepository = reclamationRepository;
        this.pieceJointeRepository = pieceJointeRepository;
        this.valeurRepository = valeurRepository;
    }

    public Reclamation creerReclamationAvecFichiers(ReclamationDTO dto, MultipartFile[] files, String[] ocrText) throws IOException, TesseractException {

        Reclamation reclamation = new Reclamation();
        reclamation.setObjet(dto.objet);
        reclamation.setContenuRec(dto.contenu_rec);
        reclamation.setClientFisc(clientFiscalRepository.getByIdUtilisateur(dto.id_utilisateur));
        reclamation.setDateRec(LocalDateTime.now());
        reclamation.setStatus(StatusRec.NON_TRAITEE);

        Reclamation savedRec = reclamationRepository.save(reclamation);

        if (files != null) {
            for (int i=0; i<files.length; i++) {
                MultipartFile file = files[i];
                String text = (ocrText != null && i < ocrText.length) ? ocrText[i] : "";

                Piece_jointe p= new Piece_jointe();
                p.setContenuPj(file.getBytes());
                p.setContenuExtrait(text);
                p.setExtension(getExtension(file.getOriginalFilename()));
                p.setTitre(file.getOriginalFilename());
                p.setReclamation(savedRec);
                pieceJointeRepository.save(p);

                if (!text.isBlank()) {
                    savedExtractedValues(p, text);
                }
            }
        }

        return savedRec;
    }

    private String getExtension(String filename) {
        return (filename != null && filename.contains("."))
                ? filename.substring(filename.lastIndexOf(".") + 1)
                : "";
    }

    private void savedExtractedValues (Piece_jointe p, String text) {
        String [] lines = text.split("\\r?\\n");

        for (String line : lines) {
            if (line.contains(":")) {
                String [] parts = line.split(":", 2);
                if (parts.length == 2) {
                    Valeur val = new Valeur();
                    val.setAttribut(parts[0].trim());
                    val.setValeur(parts[1].trim());
                    val.setPieceJointe(p);
                    valeurRepository.save(val);
                }
            }
        }
    }

    public List<Reclamation> getReclamationsByUser (ClientFiscal user) {
        return reclamationRepository.findByClientFisc(user);
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public List<Reclamation> filterReclamations(ClientFiscal user, LocalDateTime startDate, LocalDateTime endDate) {
        return reclamationRepository.findByUserIdAndDateRange(user, startDate, endDate);
    }

    public List<ReclamationDTO> convertToDtoList(List<Reclamation> reclamations) {
        return reclamations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ReclamationDTO convertToDto(Reclamation r) {

        ReclamationDTO dto = new ReclamationDTO();
        dto.id = r.getIdRec();
        dto.objet = r.getObjet();
        dto.contenu_rec = r.getContenuRec();
        dto.date_reclamation = r.getDateRec();
        dto.id_utilisateur = r.getClientFisc().getIdUtilisateur();
        if (r.getAgentFisc()!= null)
            dto.id_agent = r.getAgentFisc().getIdUtilisateur();
        dto.status = r.getStatus();

        if (dto.status.equals(StatusRec.REFUSEE)) {
            dto.raison_refus = r.getRaisonRefus();
        }

        if (r.getClientFisc().getContribuable().getType().equals("PersonnePhysique")) {
            PersonnePhysique p = (PersonnePhysique) r.getClientFisc().getContribuable();
            dto.nom = p.getNom();
            dto.prenom = p.getPrenom();
        } else if (r.getClientFisc().getContribuable().getType().equals("PersonneMorale")) {
            PersonneMorale p = (PersonneMorale) r.getClientFisc().getContribuable();
            dto.raison_sociale = p.getRaisonSociale();
        }

        return dto;
    }

    public void acceptRec(Reclamation r, AgentFiscal agentFisc) {
        r.setStatus(StatusRec.ACCEPTEE);
        r.setAgentFisc(agentFisc);
        reclamationRepository.save(r);
    }

    public void rejectRec (Reclamation r, AgentFiscal agentFisc, String raison) {
        r.setStatus(StatusRec.REFUSEE);
        r.setRaisonRefus(raison);
        r.setAgentFisc(agentFisc);
        reclamationRepository.save(r);
    }

    public ReclamationDetailsDTO getReclamationDetails(Long id) {
        Reclamation r = reclamationRepository.findByIdRec(id);
        ReclamationDetailsDTO dto = new ReclamationDetailsDTO();
        dto.setId(r.getIdRec());
        dto.setObjet(r.getObjet());
        dto.setContenu(r.getContenuRec());
        if (r.getAgentFisc()!= null)
            dto.setAgent(r.getAgentFisc().getNom() + " " + r.getAgentFisc().getPrenom());
        dto.setStatus (r.getStatus());

        if (dto.getStatus().equals(StatusRec.REFUSEE)) {
            dto.setRaison (r.getRaisonRefus());
        }

        List<Piece_jointe> pieces = pieceJointeRepository.findByReclamation(r);
        if (!pieces.isEmpty()) {
            List<FileDetailsDTO> fdto = pieces.stream().map (p -> new FileDetailsDTO(
                    p.getIdPj(),
                    p.getTitre(),
                    p.getExtension(),
                    p.getContenuPj(),
                    p.getContenuExtrait(),
                    convertValeursListToMap(p.getValeurs())
            )).toList();
            dto.setFichiers(fdto);
        }

        return dto;
    }

    private Map<String, String> convertValeursListToMap (List<Valeur> valeursList) {
        if (valeursList == null) return new HashMap<>();
        return  valeursList.stream()
                .collect(Collectors.toMap(
                        Valeur::getAttribut,
                        Valeur::getValeur
                ));
    }

    public FileDetailsDTO getFileDetails(Long fileId) {
        Piece_jointe p = pieceJointeRepository.findByIdPj(fileId);
        return new FileDetailsDTO(
                p.getIdPj(),
                p.getTitre(),
                p.getExtension(),
                p.getContenuPj(),
                p.getContenuExtrait(),
                convertValeursListToMap(p.getValeurs())
        );
    }

}