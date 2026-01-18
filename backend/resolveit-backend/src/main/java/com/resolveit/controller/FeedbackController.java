package com.resolveit.controller;

import com.resolveit.model.Feedback;
import com.resolveit.model.Grievance;
import com.resolveit.model.User;
import com.resolveit.repository.FeedbackRepository;
import com.resolveit.repository.GrievanceRepository;
import com.resolveit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private GrievanceRepository grievanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/add")
    public ResponseEntity<?> addFeedback(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            String message = request.get("message");
            Long grievanceId = Long.parseLong(request.get("grievanceId"));
            
            if (message == null || grievanceId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message and grievance ID are required"));
            }
            
            Optional<Grievance> grievanceOpt = grievanceRepository.findById(grievanceId);
            if (grievanceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Grievance not found"));
            }
            
            Grievance grievance = grievanceOpt.get();
            
            // Only allow feedback on accepted complaints
            if (grievance.getStatus() != Grievance.Status.ACCEPT) {
                return ResponseEntity.badRequest().body(Map.of("error", "Feedback can only be provided for accepted complaints"));
            }
            
            Feedback feedback = new Feedback();
            feedback.setMessage(message);
            feedback.setGrievance(grievance);
            feedback.setUser(user);
            feedback.setCreatedAt(LocalDateTime.now());
            
            feedbackRepository.save(feedback);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback added successfully");
            response.put("feedback", Map.of(
                "id", feedback.getId(),
                "message", feedback.getMessage(),
                "createdAt", feedback.getCreatedAt().toString()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/grievance/{grievanceId}")
    public ResponseEntity<?> getFeedbacksByGrievance(@PathVariable Long grievanceId, Authentication authentication) {
        try {
            Optional<Grievance> grievanceOpt = grievanceRepository.findById(grievanceId);
            if (grievanceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Grievance not found"));
            }
            
            List<Feedback> feedbacks = feedbackRepository.findByGrievanceOrderByCreatedAtDesc(grievanceOpt.get());
            
            List<Map<String, Object>> feedbackList = feedbacks.stream().map(f -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", f.getId());
                map.put("message", f.getMessage());
                map.put("createdAt", f.getCreatedAt().toString());
                map.put("userName", f.getUser().getName());
                map.put("userEmail", f.getUser().getEmail());
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of("feedbacks", feedbackList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

