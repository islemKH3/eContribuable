package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Piece_jointe;
import com.example.gestion_contribuable.Entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Piece_jointeRepository extends JpaRepository<Piece_jointe, Long> {
    List<Piece_jointe> findByReclamation(Reclamation r);
    Piece_jointe findByIdPj(long id);
}
