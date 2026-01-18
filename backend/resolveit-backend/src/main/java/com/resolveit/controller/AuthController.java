package com.resolveit.controller;

import com.resolveit.model.User;
import com.resolveit.repository.UserRepository;
import com.resolveit.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String name = request.get("name");
            String role = request.get("role");
            
            if (email == null || password == null || name == null || role == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }
            
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }
            
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setName(name);
            user.setRole(User.Role.valueOf(role.toUpperCase()));
            
            userRepository.save(user);
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
            }
            
            User user = userOpt.get();
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



