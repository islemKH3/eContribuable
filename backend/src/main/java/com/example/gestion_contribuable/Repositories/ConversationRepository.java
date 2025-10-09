package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Conversation;
import com.example.gestion_contribuable.Entities.ClientFiscal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Conversation findByClientFiscal(ClientFiscal user);
    boolean existsByClientFiscal(ClientFiscal user);
}
