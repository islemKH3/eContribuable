package com.example.gestion_contribuable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "com.example.gestion_contribuable")
@EntityScan("com.example.gestion_contribuable.Entities")
public class GestionContribuableApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionContribuableApplication.class, args);
    }

}
