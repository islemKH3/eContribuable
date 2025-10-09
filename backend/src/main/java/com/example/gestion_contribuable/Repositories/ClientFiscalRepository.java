package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.ClientFiscal;
import com.example.gestion_contribuable.Entities.Contribuable;
import com.example.gestion_contribuable.Entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientFiscalRepository extends JpaRepository<ClientFiscal, Long>  {
    boolean existsByEmailUser(String email);
    boolean existsByContribuable(Contribuable contribuable);

    ClientFiscal getByIdUtilisateur(Long userId);

    @Override
    long count();

    @Override
    List<ClientFiscal> findAll();
}
