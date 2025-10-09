package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.DTO.AdminStatDTO;
import com.example.gestion_contribuable.DTO.AgentStatDTO;
import com.example.gestion_contribuable.DTO.ClientStatDTO;
import com.example.gestion_contribuable.Entities.ClientFiscal;
import com.example.gestion_contribuable.Enums.StatusRec;
import com.example.gestion_contribuable.Repositories.*;
import org.springframework.stereotype.Service;

@Service
public class StaticService {

    private final AdministrateurRepository administrateurRepository;
    private final ReclamationRepository reclamationRepository;
    private final AgentFiscalRepository agentFiscalRepository;
    private final ClientFiscalRepository clientFiscalRepository;
    private final InputRepository inputRepository;
    private final UtilisateurRepository utilisateurRepository;

    public StaticService(UtilisateurRepository utilisateurRepository, InputRepository inputRepository, ClientFiscalRepository clientFiscalRepository, AgentFiscalRepository agentFiscalRepository, AdministrateurRepository administrateurRepository, ReclamationRepository reclamationRepository ) {
        this.administrateurRepository = administrateurRepository;
        this.reclamationRepository = reclamationRepository;
        this.agentFiscalRepository = agentFiscalRepository;
        this.clientFiscalRepository = clientFiscalRepository;
        this.inputRepository = inputRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public AdminStatDTO getAdminStat() {
        AdminStatDTO adminStatDTO = new AdminStatDTO();
        adminStatDTO.setNb_tot_user(utilisateurRepository.count());
        adminStatDTO.setNb_contribuable(clientFiscalRepository.count());
        adminStatDTO.setNb_admin(administrateurRepository.count());
        adminStatDTO.setNb_agent(agentFiscalRepository.count());

        adminStatDTO.setNb_rec(reclamationRepository.count());
        adminStatDTO.setNb_rec_non_t(reclamationRepository.countByStatus(StatusRec.NON_TRAITEE));
        adminStatDTO.setNb_inter(inputRepository.count());

        return adminStatDTO;
    }

    public AgentStatDTO getAgentStat() {
        AgentStatDTO agentStatDTO = new AgentStatDTO();

        agentStatDTO.setNb_rec(reclamationRepository.count());
        agentStatDTO.setNb_rec_non_t(reclamationRepository.countByStatus(StatusRec.NON_TRAITEE));
        agentStatDTO.setNb_rec_acc(reclamationRepository.countByStatus(StatusRec.ACCEPTEE));
        agentStatDTO.setNb_rec_ref(reclamationRepository.countByStatus(StatusRec.REFUSEE));

        return agentStatDTO;
    }

    public ClientStatDTO getClientStat (long userId) {
        ClientStatDTO clientStatDTO = new ClientStatDTO();
        ClientFiscal client = clientFiscalRepository.getByIdUtilisateur(userId);

        clientStatDTO.setNb_rec(reclamationRepository.countByClientFisc(client));
        clientStatDTO.setNb_rec_ref(reclamationRepository.countByStatusAndClientFisc(StatusRec.REFUSEE, client));
        clientStatDTO.setNb_rec_acc(reclamationRepository.countByStatusAndClientFisc(StatusRec.ACCEPTEE, client));
        clientStatDTO.setNb_rec_non_t(reclamationRepository.countByStatusAndClientFisc(StatusRec.NON_TRAITEE, client));

        return clientStatDTO;
    }

}
