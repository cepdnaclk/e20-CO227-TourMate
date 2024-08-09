package com.mapa.restapi.exm;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class NearbyAttractionsFinderTest {

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Test
    public void test(){
        System.out.println(passwordEncoder.encode("test"));
    }



}