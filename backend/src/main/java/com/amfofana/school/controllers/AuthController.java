package com.amfofana.school.controllers;

import com.amfofana.school.dto.JwtResponseDTO;
import com.amfofana.school.dto.LoginRequestDTO;
import com.amfofana.school.dto.RegisterRequestDTO;
import com.amfofana.school.dto.UserDTO;
import com.amfofana.school.entities.User;
import com.amfofana.school.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody RegisterRequestDTO registerRequest) {
        return ResponseEntity.ok(authService.registerUser(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest, HttpServletResponse response) {
        JwtResponseDTO jwtResponse = authService.loginUser(loginRequest);

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", jwtResponse.getAccessToken())
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .build();

        ResponseCookie userRoleCookie = ResponseCookie.from("userRole", authService.getRoleFromToken(jwtResponse.getAccessToken()))
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, userRoleCookie.toString());

        return ResponseEntity.ok().body("Login successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        ResponseCookie userRoleCookie = ResponseCookie.from("userRole", "")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, userRoleCookie.toString());

        return ResponseEntity.ok().body("Logout successful");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.convertToUserDTO(user));
    }
}
