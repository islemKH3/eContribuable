package com.example.gestion_contribuable.Repositories;
import com.example.gestion_contribuable.Entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    long count();
    boolean existsByEmailUser(String email);
    Utilisateur getUtilisateurByIdUtilisateur(Long id);
    Utilisateur findByEmailUser(String email);
}
