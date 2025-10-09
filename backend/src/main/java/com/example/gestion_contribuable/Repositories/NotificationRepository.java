package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Notification;
import com.example.gestion_contribuable.Entities.Utilisateur;
import com.example.gestion_contribuable.Enums.StatusNotif;
import com.example.gestion_contribuable.Enums.TypeNotif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List <Notification> getNotificationByStatusAndTypeAndUtilisateur(StatusNotif statusNotif, TypeNotif type, Utilisateur user);
    Notification getNotificationByIdNotif(Long id);
}
