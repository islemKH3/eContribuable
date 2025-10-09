package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Contribuable;
import com.example.gestion_contribuable.Entities.UtilisateurEnAttente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilisateurEnAttenteRepository extends JpaRepository<UtilisateurEnAttente, Long> {
    boolean existsByEmailUser(String Email);

    UtilisateurEnAttente findByIdUea(Long id);
    @Override
    List<UtilisateurEnAttente> findAll();
    void deleteById(Long id);
}
