package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.Configs.JwtUtil;
import com.example.gestion_contribuable.DTO.LoginResponse;
import com.example.gestion_contribuable.DTO.UtilisateurDTO;
import com.example.gestion_contribuable.Entities.*;
import com.example.gestion_contribuable.Repositories.ClientFiscalRepository;
import com.example.gestion_contribuable.Repositories.ContribuableRepository;
import com.example.gestion_contribuable.Repositories.UtilisateurEnAttenteRepository;
import com.example.gestion_contribuable.Repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ContribuableRepository contribuableRepository;
    private final ClientFiscalRepository clientFiscalRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UtilisateurEnAttenteRepository utilisateurEnAttenteRepository;

    @Autowired
    public AuthService(UtilisateurRepository utilisateurRepository, ContribuableRepository contribuableRepository, ClientFiscalRepository clientFiscalRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, UtilisateurEnAttenteRepository utilisateurEnAttenteRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.contribuableRepository = contribuableRepository;
        this.clientFiscalRepository = clientFiscalRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.utilisateurEnAttenteRepository = utilisateurEnAttenteRepository;
    }

    public void signup(Long nif, String email, String mdp) {

        if (!contribuableRepository.existsByNif(nif)) {
            throw new IllegalArgumentException("Vous devez fournir un NIF valide.");
        }
        Contribuable contribuable = contribuableRepository.findByNif(nif);
        if (clientFiscalRepository.existsByContribuable(contribuable)){
            throw new IllegalArgumentException("Ce contribuable est déjà inscrit.");
        }
        if(clientFiscalRepository.existsByEmailUser(email)){
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }
        if(utilisateurEnAttenteRepository.existsByEmailUser(email)){
            throw new IllegalArgumentException("Une demande d'inscription a été déjà envoyée. Veuillez attendre l'approbation des admins.");
        }

        UtilisateurEnAttente utilisateur= new UtilisateurEnAttente();
        utilisateur.setEmailUser(email);
        utilisateur.setMdp(passwordEncoder.encode(mdp));
        utilisateur.setDateInscrip(LocalDateTime.now());

        utilisateurEnAttenteRepository.save(utilisateur);
        contribuable.setCompteEnAttente(utilisateur);
        contribuableRepository.save(contribuable);
    }

    public LoginResponse login(String email, String mdp) {

        if(!utilisateurRepository.existsByEmailUser(email) && !utilisateurEnAttenteRepository.existsByEmailUser(email)) {
            throw new IllegalArgumentException("Cet utilisateur n'existe pas.");
        }
        if (utilisateurEnAttenteRepository.existsByEmailUser(email)){
            throw new IllegalArgumentException("Ce compte n'est pas ecore accepté. Veuillez attendre l'approbation des admins.");
        }
        Utilisateur utilisateur = utilisateurRepository.findByEmailUser(email);
        if(!passwordEncoder.matches(mdp, utilisateur.getMdp())){
            throw new IllegalArgumentException("Mot de passe incorrect.");
        }

        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getIdUtilisateur());
        dto.setEmail(utilisateur.getEmailUser());
        if (utilisateur.getNature().equals("CLIENT")) {
            ClientFiscal client = (ClientFiscal) utilisateur;
            dto.setDate_approuv(client.getDateApprouv().toString());
            dto.setNature("CLIENT");
            Contribuable contribuable = client.getContribuable();
            if (contribuable.getType().equals("PersonnePhysique")) {
                PersonnePhysique personnePhysique = (PersonnePhysique) contribuable;
                dto.setNom(personnePhysique.getNom());
                dto.setPrenom(personnePhysique.getPrenom());
                dto.setDate_naissance(personnePhysique.getDateNaissance().toString());
                dto.setCin(personnePhysique.getCin());
                dto.setType("PersonnePhysique");
            } else {
                PersonneMorale personneMorale = (PersonneMorale) contribuable;
                dto.setRaison_sociale(personneMorale.getRaisonSociale());
                dto.setDate_creation(personneMorale.getDateCreation().toString());
                dto.setRegistre_commerce(personneMorale.getRegistreCommerce());
                dto.setType("PersonneMorale");
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
            dto.setCin(agent.getCin());
            dto.setMatricule_agent(agent.getMatriculeAgent().toString());
            dto.setBureau_affectation(agent.getBureauAffectation());
            dto.setNature("AGENT");
        }

        String token = jwtUtil.generateToken(utilisateur);

        LoginResponse response = new LoginResponse();
        response.setToken(token);

        if (dto.getNature().equals("CLIENT")){
            response.setMessage("Redirection vers client/home");
        } else if (dto.getNature().equals("ADMIN")){
            response.setMessage("Redirection vers admin/home");
        } else if (dto.getNature().equals("AGENT")){
            response.setMessage("Redirection vers agent/home");
        }
        response.setUtilisateur(dto);

        return response;
    }
}
