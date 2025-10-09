package com.example.gestion_contribuable.Controllers;

import com.example.gestion_contribuable.DTO.NotificationDTO;
import com.example.gestion_contribuable.Enums.StatusNotif;
import com.example.gestion_contribuable.Enums.TypeNotif;
import com.example.gestion_contribuable.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // --- Mark a notification as read ---
    @PutMapping("/{notifId}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long notifId) {
        notificationService.readNotif(notifId);
        return ResponseEntity.ok("Notification marked as read.");
    }

    // --- Get notifications by user and status ---
    @GetMapping("/user/{type}/{status}/{id}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUser(
            @PathVariable String type,
            @PathVariable StatusNotif status,
            @PathVariable Long id) {
        List<NotificationDTO> notifications = notificationService.getSpecNotifs(TypeNotif.valueOf(type), status, id);
        return ResponseEntity.ok(notifications);
    }
}
