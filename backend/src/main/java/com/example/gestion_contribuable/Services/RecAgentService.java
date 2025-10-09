package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.DTO.RecAgentStatsDTO;
import com.example.gestion_contribuable.DTO.ReclamationDTO;
import com.example.gestion_contribuable.Entities.AgentFiscal;
import com.example.gestion_contribuable.Entities.Reclamation;
import com.example.gestion_contribuable.Enums.StatusRec;
import com.example.gestion_contribuable.Repositories.AgentFiscalRepository;
import com.example.gestion_contribuable.Repositories.ReclamationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecAgentService {

    @Autowired
    private ReclamationRepository reclamationRepository;

    @Autowired
    private AgentFiscalRepository agentFiscalRepository;

    @Autowired
    private ReclamationService reclamationService;

    public List<RecAgentStatsDTO> getAllAgentsStats() {
        List<AgentFiscal> agents = agentFiscalRepository.findAll();
        List<RecAgentStatsDTO> statsList = new ArrayList<>();

        for (AgentFiscal agent: agents) {
            List<Reclamation> recs = reclamationRepository.findByAgentFisc(agent);

            long totalTraite = recs.size();

            List<Reclamation> accept = recs.stream()
                    .filter(r -> r.getStatus() == StatusRec.ACCEPTEE)
                    .toList();
            long totalAccepte = accept.size();

            List<Reclamation> refus = recs.stream()
                    .filter(r -> r.getStatus() == StatusRec.REFUSEE)
                    .toList();
            long totalRefuse = refus.size();

            List<ReclamationDTO> recAccept = reclamationService.convertToDtoList(accept);
            List<ReclamationDTO> recRefuse = reclamationService.convertToDtoList(refus);

            statsList.add(new RecAgentStatsDTO(
                    agent.getIdUtilisateur(),
                    agent.getNom(),
                    agent.getPrenom(),
                    totalTraite,
                    totalAccepte,
                    totalRefuse,
                    recAccept,
                    recRefuse
            ));
        }

        return statsList;
    }
}
