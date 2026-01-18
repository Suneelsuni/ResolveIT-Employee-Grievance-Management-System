package com.resolveit.controller;

import com.resolveit.model.User;
import com.resolveit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            String name = request.get("name");
            String newEmail = request.get("email");
            
            if (name != null && !name.trim().isEmpty()) {
                user.setName(name);
            }
            
            if (newEmail != null && !newEmail.trim().isEmpty() && !newEmail.equals(email)) {
                // Check if new email already exists
                if (userRepository.existsByEmail(newEmail)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
                }
                user.setEmail(newEmail);
            }
            
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "user", Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");
            
            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Old password and new password are required"));
            }
            
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Old password is incorrect"));
            }
            
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 6 characters"));
            }
            
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

