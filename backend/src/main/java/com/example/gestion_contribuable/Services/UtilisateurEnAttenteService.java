package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.DTO.UEAdto;
import com.example.gestion_contribuable.DTO.UtilisateurDTO;
import com.example.gestion_contribuable.Entities.*;
import com.example.gestion_contribuable.Repositories.ClientFiscalRepository;
import com.example.gestion_contribuable.Repositories.ContribuableRepository;
import com.example.gestion_contribuable.Repositories.UtilisateurEnAttenteRepository;
import com.example.gestion_contribuable.Repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UtilisateurEnAttenteService {
    @Autowired
    private UtilisateurEnAttenteRepository utilisateurEnAttenteRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private ContribuableRepository contribuableRepository;
    @Autowired
    private ClientFiscalRepository clientFiscalRepository;
    @Autowired
    private utilisateurService uService;


    public List<UEAdto> getAllUtilisateurs() {
        List<UtilisateurEnAttente> users=utilisateurEnAttenteRepository.findAll();
        List<UEAdto> utilisateurs = new ArrayList<>();
        for (UtilisateurEnAttente user : users) {
            UEAdto utilisateur = new UEAdto();
            utilisateur.setId(user.getIdUea());
            utilisateur.setNif(user.getContribuable().getNif());
            utilisateur.setEmail(user.getEmailUser());
            utilisateur.setMdp(user.getMdp());
            Contribuable contribuable =user.getContribuable();
            if (contribuable.getType().equals("PersonnePhysique")) {
                PersonnePhysique personnePhysique = (PersonnePhysique) contribuable;
                utilisateur.setNom(personnePhysique.getNom());
                utilisateur.setPrenom(personnePhysique.getPrenom());
                utilisateur.setDate_naissance(personnePhysique.getDateNaissance().toString());
                utilisateur.setCin(personnePhysique.getCin());
                utilisateur.setType("Personne physique");
            } else {
                PersonneMorale personneMorale = (PersonneMorale) contribuable;
                utilisateur.setRaison_sociale(personneMorale.getRaisonSociale());
                utilisateur.setDate_creation(personneMorale.getDateCreation().toString());
                utilisateur.setRegistre_commerce(personneMorale.getRegistreCommerce());
                utilisateur.setType("Personne morale");
            }

            utilisateurs.add(utilisateur);
        }

        return utilisateurs;
    }

    public List<UtilisateurDTO> getAllClientFisc() {
        List<ClientFiscal> users = clientFiscalRepository.findAll();
        List<UtilisateurDTO> utilisateurs = new ArrayList<>();

        for (ClientFiscal user : users) {
            UtilisateurDTO utilisateur = uService.getUser(user.getIdUtilisateur());
            utilisateurs.add(utilisateur);
        }

        return utilisateurs;
    }


    public void approveUser(Long id){
        UtilisateurEnAttente u= utilisateurEnAttenteRepository.findByIdUea(id);

        Contribuable contribuable = contribuableRepository
                .findById(u.getContribuable().getNif()) // or appropriate ID getter
                .orElseThrow(() -> new RuntimeException("Contribuable not found"));

        contribuable.setCompteEnAttente(null);

        ClientFiscal user= new ClientFiscal();
        user.setEmailUser(u.getEmailUser());
        user.setMdp(u.getMdp());
        user.setContribuable(contribuable);
        user.setDateApprouv(LocalDateTime.now());

        utilisateurRepository.save(user);

        utilisateurEnAttenteRepository.deleteById(id);
    }

    public void refuseUser(Long id){

        UtilisateurEnAttente u= utilisateurEnAttenteRepository.findByIdUea(id);
        Contribuable contribuable = contribuableRepository
                .findById(u.getContribuable().getNif()) // or appropriate ID getter
                .orElseThrow(() -> new RuntimeException("Contribuable not found"));

        contribuable.setCompteEnAttente(null);
        utilisateurEnAttenteRepository.deleteById(id);
    }
}
