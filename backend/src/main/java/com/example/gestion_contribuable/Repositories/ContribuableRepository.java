package com.example.gestion_contribuable.Repositories;
import com.example.gestion_contribuable.Entities.Contribuable;
import com.example.gestion_contribuable.Entities.UtilisateurEnAttente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContribuableRepository extends JpaRepository<Contribuable, Long> {
    Contribuable findByNif(Long nif);
    boolean existsByNif(Long nif);
    Contribuable findByCompteEnAttente(UtilisateurEnAttente compteEnAttente);
}