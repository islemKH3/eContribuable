package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.Entities.ClientFiscal;
import com.example.gestion_contribuable.Entities.Utilisateur;
import com.example.gestion_contribuable.Repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (!utilisateurRepository.existsByEmailUser(email))
            throw new UsernameNotFoundException("utilisateur introuvable.");
        Utilisateur utilisateur = utilisateurRepository.findByEmailUser(email);

        String role ="ROLE_"+ utilisateur.getNature();
        return new org.springframework.security.core.userdetails.User(
                utilisateur.getEmailUser(),
                utilisateur.getMdp(),
                Collections.singleton(new SimpleGrantedAuthority(role))
        );
    }
}
