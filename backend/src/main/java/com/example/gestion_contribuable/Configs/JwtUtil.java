package com.example.gestion_contribuable.Configs;
import com.example.gestion_contribuable.Entities.Utilisateur;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(Utilisateur utilisateur) {
        String token = Jwts.builder()
                .setSubject(utilisateur.getEmailUser())
                .claim("roles", utilisateur.getNature())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h expiration
                .signWith(secretKey)
                .compact();

        System.out.println("Generated token: " + token);
        return token;
    }


    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)  // Use the same key for validation
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    public boolean validateToken(String token){
        return !isTokenExpired(token);
    }
    private Date extractExpirationDate(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
