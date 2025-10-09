package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.AgentFiscal;
import com.example.gestion_contribuable.Entities.Reclamation;
import com.example.gestion_contribuable.Entities.ClientFiscal;
import com.example.gestion_contribuable.Enums.StatusRec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByClientFisc(ClientFiscal clientFiscal);
    List<Reclamation> findAll();
    long countByStatus(StatusRec status);
    long countByClientFisc(ClientFiscal clientFiscal);
    long countByStatusAndClientFisc(StatusRec status, ClientFiscal clientFiscal);
    Reclamation findByIdRec(long id);

    @Query("SELECT r FROM Reclamation r WHERE " +
            "(:user IS NULL OR r.clientFisc = :userId) AND " +
            "(:startDate IS NULL OR r.dateRec >= :startDate) AND " +
            "(:endDate IS NULL OR r.dateRec <= :endDate)")
    List<Reclamation> findByUserIdAndDateRange(
            @Param("user") ClientFiscal user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    List<Reclamation> findByAgentFisc(AgentFiscal agentFiscal);
}
