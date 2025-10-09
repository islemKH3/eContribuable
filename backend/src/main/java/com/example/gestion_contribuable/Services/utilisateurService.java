package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.DTO.UtilisateurDTO;
import com.example.gestion_contribuable.Entities.*;
import com.example.gestion_contribuable.Repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class utilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public UtilisateurDTO getUser (Long id) {

        Utilisateur utilisateur = utilisateurRepository.getUtilisateurByIdUtilisateur(id);
        UtilisateurDTO dto= new UtilisateurDTO();

        dto.setId(utilisateur.getIdUtilisateur());
        dto.setEmail(utilisateur.getEmailUser());
        if (utilisateur.getNature().equals("CLIENT")) {
            ClientFiscal client = (ClientFiscal) utilisateur;
            dto.setDate_approuv(client.getDateApprouv().toString());
            dto.setNif(client.getContribuable().getNif());
            dto.setNature("CLIENT");
            Contribuable contribuable = client.getContribuable();
            if (contribuable.getType().equals("PersonnePhysique")) {
                PersonnePhysique personnePhysique = (PersonnePhysique) contribuable;
                dto.setNom(personnePhysique.getNom());
                dto.setPrenom(personnePhysique.getPrenom());
                dto.setDate_naissance(personnePhysique.getDateNaissance().toString());
                dto.setCin(personnePhysique.getCin());
                dto.setType("Personne physique");
            } else {
                PersonneMorale personneMorale = (PersonneMorale) contribuable;
                dto.setRaison_sociale(personneMorale.getRaisonSociale());
                dto.setDate_creation(personneMorale.getDateCreation().toString());
                dto.setRegistre_commerce(personneMorale.getRegistreCommerce());
                dto.setType("Personne morale");
            }
        } else if (utilisateur.getNature().equals("ADMIN")) {
            Administrateur admin = (Administrateur) utilisateur;
            dto.setCin(admin.getCin());
            dto.setNom(admin.getNom());
            dto.setPrenom(admin.getPrenom());
            dto.setNature("ADMIN");
        } else {
            AgentFiscal agent = (AgentFiscal) utilisateur;
            dto.setNom(agent.getNom());
            dto.setPrenom(agent.getPrenom());
            dto.setCin(agent.getCin().toString());
            dto.setMatricule_agent(agent.getMatriculeAgent().toString());
            dto.setBureau_affectation(agent.getBureauAffectation());
            dto.setNature("AGENT");
        }

        return dto;
    }
}
