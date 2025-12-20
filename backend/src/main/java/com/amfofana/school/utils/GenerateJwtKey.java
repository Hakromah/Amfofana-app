//package com.amfofana.school.utils;
//
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import io.jsonwebtoken.io.Encoders;
//
//public class GenerateJwtKey {
//    public static void main(String[] args) {
//        var key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
//        System.out.println(Encoders.BASE64.encode(key.getEncoded()));
//    }
//}