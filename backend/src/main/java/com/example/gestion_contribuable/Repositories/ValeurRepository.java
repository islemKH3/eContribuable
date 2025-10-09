package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Valeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ValeurRepository extends JpaRepository<Valeur, Long> {
}
