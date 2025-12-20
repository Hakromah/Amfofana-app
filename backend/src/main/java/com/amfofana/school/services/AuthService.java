package com.amfofana.school.services;

import com.amfofana.school.dto.JwtResponseDTO;
import com.amfofana.school.dto.LoginRequestDTO;
import com.amfofana.school.dto.RegisterRequestDTO;
import com.amfofana.school.dto.UserDTO;
import com.amfofana.school.entities.Role;
import com.amfofana.school.entities.User;
import com.amfofana.school.repositories.UserRepository;
import com.amfofana.school.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-token-expiration}")
    private int refreshTokenExpiration;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    public UserDTO registerUser(RegisterRequestDTO registerRequest) {
        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRole(Role.STUDENT);

        User savedUser = userRepository.save(newUser);
        return convertToUserDTO(savedUser);
    }

    public JwtResponseDTO loginUser(LoginRequestDTO loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String accessToken = jwtUtil.generateToken(userDetails);
        final String refreshToken = jwtUtil.generateRefreshToken(userDetails, refreshTokenExpiration);
        return new JwtResponseDTO(accessToken, refreshToken);
    }

    public String getRoleFromToken(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(jwtUtil.extractUsername(token));
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        if (authorities != null && !authorities.isEmpty()) {
            return authorities.iterator().next().getAuthority().replace("ROLE_", "");
        }
        return null;
    }

    public UserDTO convertToUserDTO(User user) {
        if (user == null) return null;
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setCreatedAt(user.getCreatedAt());
        return userDTO;
    }
}
