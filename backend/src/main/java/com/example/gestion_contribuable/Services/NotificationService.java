package com.example.gestion_contribuable.Services;

import com.example.gestion_contribuable.DTO.NotificationDTO;
import com.example.gestion_contribuable.DTO.UtilisateurDTO;
import com.example.gestion_contribuable.Entities.*;
import com.example.gestion_contribuable.Enums.StatusNotif;
import com.example.gestion_contribuable.Enums.TypeNotif;
import com.example.gestion_contribuable.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private AdministrateurRepository administrateurRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private AgentFiscalRepository agentFiscalRepository;
    @Autowired
    private ClientFiscalRepository clientFiscalRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public void notifyAdminsOfNewSignup(){
        List<Administrateur> admins = administrateurRepository.findAll();

        for (Administrateur admin: admins) {
            Notification notif = new Notification();
            notif.setType(TypeNotif.NOUV_INSCRIPTION);
            notif.setStatus(StatusNotif.UNREAD);
            notif.setDateNotif(LocalDateTime.now());
            notif.setNotifContent("Nouvelle demande d'inscription reçue.");
            notif.setUtilisateur(admin);

            notificationRepository.save(notif);
        }
    }

    public void notifyAgentsOfNewRec(){
        List<AgentFiscal> agents = agentFiscalRepository.findAll();

        for (AgentFiscal agent: agents) {
            Notification notif = new Notification();
            notif.setType(TypeNotif.NOUV_RECLAMATION);
            notif.setStatus(StatusNotif.UNREAD);
            notif.setDateNotif(LocalDateTime.now());
            notif.setNotifContent("Nouvelle réclamation soumise.");
            notif.setUtilisateur(agent);

            notificationRepository.save(notif);
        }
    }

    public void notifyClientOfRejectedRec(){
        List<ClientFiscal> clients = clientFiscalRepository.findAll();

        for (ClientFiscal client: clients) {
            Notification notif = new Notification();
            notif.setType(TypeNotif.RECLAMATION_REFU);
            notif.setStatus(StatusNotif.UNREAD);
            notif.setDateNotif(LocalDateTime.now());
            notif.setNotifContent("Réclamation refusée.");
            notif.setUtilisateur(client);

            notificationRepository.save(notif);
        }
    }

    public void notifyClientOfAcceptedRec(){
        List<ClientFiscal> clients = clientFiscalRepository.findAll();

        for (ClientFiscal client: clients) {
            Notification notif = new Notification();
            notif.setType(TypeNotif.RECLAMATION_APPROUV);
            notif.setStatus(StatusNotif.UNREAD);
            notif.setDateNotif(LocalDateTime.now());
            notif.setNotifContent("Réclamation acceptée.");
            notif.setUtilisateur(client);

            notificationRepository.save(notif);
        }
    }

    public void readNotif(Long notif_id){
        Notification notif= notificationRepository.getNotificationByIdNotif(notif_id);
        notif.setStatus(StatusNotif.READ);
        notificationRepository.save(notif);
    }

    public List<NotificationDTO> getSpecNotifs (TypeNotif type, StatusNotif status, Long id){

        Utilisateur user = utilisateurRepository.getUtilisateurByIdUtilisateur(id);
        List<Notification> notifs= notificationRepository.getNotificationByStatusAndTypeAndUtilisateur(status, type, user);
        List<NotificationDTO> dtos= new ArrayList<>();

        for (Notification notif: notifs) {
            NotificationDTO dto = new NotificationDTO();
            dto.setId(notif.getIdNotif());
            dto.setType(notif.getType().toString());
            dto.setDate(notif.getDateNotif());
            dto.setContent(notif.getNotifContent());
            dto.setStatus(status.toString());
            if (notif.getUtilisateur().getNature().equals("CLIENT")){
                ClientFiscal c= (ClientFiscal) notif.getUtilisateur();
                Contribuable cont= c.getContribuable();
                if (cont.getType().equals("PersonneMorale")){
                    PersonneMorale p= (PersonneMorale) cont;
                    dto.setUtilisateur(p.getRaisonSociale());
                } else {
                    PersonnePhysique p= (PersonnePhysique) cont;
                    dto.setUtilisateur(p.getNom()+" "+p.getPrenom());
                }
            } else if (notif.getUtilisateur().getNature().equals("AGENT")){
                AgentFiscal agent = (AgentFiscal) notif.getUtilisateur();
                dto.setUtilisateur(agent.getNom()+" "+agent.getPrenom());
            } else {
                Administrateur admin = (Administrateur) notif.getUtilisateur();
                dto.setUtilisateur(admin.getNom()+" "+admin.getPrenom());
            }
            dtos.add(dto);
        }

        return dtos;
    }


}
