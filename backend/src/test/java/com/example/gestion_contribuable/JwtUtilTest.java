package com.example.gestion_contribuable;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

import com.example.gestion_contribuable.Configs.JwtUtil;
import com.example.gestion_contribuable.Entities.Utilisateur;
import org.testng.annotations.Test;

public class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil();

    @Test
    public void testTokenValid() {
        Utilisateur user = new Utilisateur();
        user.setEmailUser("user@example.com");
        String token = jwtUtil.generateToken(user);
        assertTrue(jwtUtil.validateToken(token), "Le token devrait être valide");
    }

    @Test
    public void testTokenInvalid() {
        String fakeToken = "abc.def.ghi";
        assertFalse(jwtUtil.validateToken(fakeToken), "Le token devrait être invalide");
    }
}
