package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Conversation;
import com.example.gestion_contribuable.Entities.Input;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InputRepository extends JpaRepository<Input, Long> {
    long count();
    List<Input> findByConversationOrderByDateInputAsc(Conversation conversation);
}
