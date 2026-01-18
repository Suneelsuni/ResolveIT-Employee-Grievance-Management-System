package com.resolveit.controller;

import com.resolveit.model.Grievance;
import com.resolveit.model.User;
import com.resolveit.repository.GrievanceRepository;
import com.resolveit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private GrievanceRepository grievanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            Map<String, Object> stats = new HashMap<>();
            
            if (user.getRole() == User.Role.ADMIN) {
                // Admin sees all complaints
                List<Grievance> allGrievances = grievanceRepository.findAll();
                long total = allGrievances.size();
                long open = allGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.OPEN).count();
                long inProgress = allGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.IN_PROGRESS).count();
                long accepted = allGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.ACCEPT).count();
                long rejected = allGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.REJECT).count();
                
                stats.put("totalComplaints", total);
                stats.put("openComplaints", open);
                stats.put("inProgressComplaints", inProgress);
                stats.put("acceptedComplaints", accepted);
                stats.put("rejectedComplaints", rejected);
                stats.put("myComplaints", 0L);
            } else if (user.getRole() == User.Role.TEAM_LEAD) {
                // Team Lead sees assigned complaints
                List<Grievance> assignedGrievances = grievanceRepository.findByAssignedTo(user);
                long total = assignedGrievances.size();
                long open = assignedGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.OPEN).count();
                long inProgress = assignedGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.IN_PROGRESS).count();
                long accepted = assignedGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.ACCEPT).count();
                long rejected = assignedGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.REJECT).count();
                
                stats.put("totalComplaints", total);
                stats.put("openComplaints", open);
                stats.put("inProgressComplaints", inProgress);
                stats.put("acceptedComplaints", accepted);
                stats.put("rejectedComplaints", rejected);
                stats.put("myComplaints", 0L);
            } else {
                // Employee sees own complaints
                List<Grievance> myGrievances = grievanceRepository.findByEmployee(user);
                long total = myGrievances.size();
                long open = myGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.OPEN).count();
                long inProgress = myGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.IN_PROGRESS).count();
                long accepted = myGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.ACCEPT).count();
                long rejected = myGrievances.stream().filter(g -> g.getStatus() == Grievance.Status.REJECT).count();
                
                stats.put("totalComplaints", total);
                stats.put("openComplaints", open);
                stats.put("inProgressComplaints", inProgress);
                stats.put("acceptedComplaints", accepted);
                stats.put("rejectedComplaints", rejected);
                stats.put("myComplaints", total);
            }
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

