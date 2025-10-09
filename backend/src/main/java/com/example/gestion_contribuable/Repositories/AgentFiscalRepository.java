package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.AgentFiscal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentFiscalRepository extends JpaRepository<AgentFiscal, Long> {

    AgentFiscal getByIdUtilisateur(Long agentId);

    long count();
    @Override
    List<AgentFiscal> findAll();
}
