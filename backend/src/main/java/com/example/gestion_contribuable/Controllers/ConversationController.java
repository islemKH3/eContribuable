package com.example.gestion_contribuable.Controllers;
import com.example.gestion_contribuable.DTO.AskRequestDTO;
import com.example.gestion_contribuable.DTO.ConversationDTO;
import com.example.gestion_contribuable.DTO.InputDTO;
import com.example.gestion_contribuable.Services.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody AskRequestDTO askRequestDTO) {
        try {
            String output = conversationService.handleUserQuestion(askRequestDTO.getUserId(), askRequestDTO.getQuestion());
            return ResponseEntity.ok(output);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InputDTO>> getUserThread(@PathVariable Long userId) {
        List<InputDTO> inputs = conversationService.getUserChatHistory(userId);
        return ResponseEntity.ok(inputs);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<List<ConversationDTO>> getAllThreads() {
        return ResponseEntity.ok(conversationService.getAllThreads());
    }
}