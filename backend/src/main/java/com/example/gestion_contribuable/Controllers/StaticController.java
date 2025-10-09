package com.example.gestion_contribuable.Controllers;

import com.example.gestion_contribuable.DTO.AdminStatDTO;
import com.example.gestion_contribuable.DTO.AgentStatDTO;
import com.example.gestion_contribuable.DTO.ClientStatDTO;
import com.example.gestion_contribuable.Services.StaticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stat")
public class StaticController {

    @Autowired
    private StaticService staticService;

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/client/{userId}")
    public ClientStatDTO getClientStat(@PathVariable int userId) {
        return staticService.getClientStat(userId);
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/agent")
    public AgentStatDTO getAgentStat() {
        return staticService.getAgentStat();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public AdminStatDTO getAdminStat() {
        return staticService.getAdminStat();
    }
}
