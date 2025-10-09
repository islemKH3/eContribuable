package com.example.gestion_contribuable.Repositories;

import com.example.gestion_contribuable.Entities.Output;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutputRepository extends JpaRepository  <Output, Long> {
}
