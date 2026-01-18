package com.resolveit.controller;

import com.resolveit.model.User;
import com.resolveit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User currentUser = userOpt.get();
            
            // Only admin can view all users
            if (currentUser.getRole() != User.Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only admin can view all users"));
            }
            
            List<User> users = userRepository.findAll();
            
            List<Map<String, Object>> userList = users.stream().map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("name", u.getName());
                map.put("email", u.getEmail());
                map.put("role", u.getRole().name());
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of("users", userList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

