package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {
    @Override
    List<Administrateur> findAll();

    @Override
    long count();
}
