package com.example.gestion_contribuable.Controllers;

import com.example.gestion_contribuable.DTO.RecAgentStatsDTO;
import com.example.gestion_contribuable.Entities.AgentFiscal;
import com.example.gestion_contribuable.Repositories.AgentFiscalRepository;
import com.example.gestion_contribuable.Services.RecAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class AgentStatsController {

    @Autowired
    private RecAgentService recAgentService;

    @Autowired
    private AgentFiscalRepository agentFiscalRepository;

    @GetMapping("/agents/stats")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<RecAgentStatsDTO>> getAgentStats() {
        List<RecAgentStatsDTO> stats = recAgentService.getAllAgentsStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/agent/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<String> getAgentResponsable(@PathVariable Long id){
        AgentFiscal agentFiscal = agentFiscalRepository.getByIdUtilisateur(id);
        return ResponseEntity.ok(agentFiscal.getTypeAgent().toString());
    }
}
