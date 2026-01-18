package com.resolveit.controller;

import com.resolveit.model.Grievance;
import com.resolveit.model.User;
import com.resolveit.repository.GrievanceRepository;
import com.resolveit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "*")
public class GrievanceController {
    
    @Autowired
    private GrievanceRepository grievanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addGrievance(@RequestParam(value = "title", required = false) String title,
                                           @RequestParam(value = "description", required = false) String description,
                                           @RequestParam(value = "category", required = false) String category,
                                           @RequestParam(value = "image", required = false) MultipartFile image,
                                           Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User employee = userOpt.get();
            
            // Handle JSON request body (for backward compatibility)
            if (title == null && description == null && category == null) {
                // Try to get from request body if sent as JSON
                return ResponseEntity.badRequest().body(Map.of("error", "Title, description and category are required"));
            }
            
            if (title == null || description == null || category == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title, description and category are required"));
            }
            
            Grievance grievance = new Grievance();
            grievance.setTitle(title);
            grievance.setDescription(description);
            grievance.setCategory(category);
            grievance.setStatus(Grievance.Status.OPEN);
            grievance.setEmployee(employee);
            grievance.setCreatedAt(LocalDateTime.now());
            
            // Handle image upload
            if (image != null && !image.isEmpty()) {
                try {
                    String uploadDir = "uploads/complaints/";
                    File dir = new File(uploadDir);
                    if (!dir.exists()) {
                        dir.mkdirs();
                    }
                    
                    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get(uploadDir + fileName);
                    Files.write(filePath, image.getBytes());
                    
                    grievance.setImagePath("/uploads/complaints/" + fileName);
                } catch (IOException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload image: " + e.getMessage()));
                }
            }
            
            grievanceRepository.save(grievance);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Grievance submitted successfully");
            response.put("grievance", Map.of(
                "id", grievance.getId(),
                "title", grievance.getTitle(),
                "description", grievance.getDescription(),
                "category", grievance.getCategory(),
                "status", grievance.getStatus().name(),
                "imagePath", grievance.getImagePath() != null ? grievance.getImagePath() : ""
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/add-json")
    public ResponseEntity<?> addGrievanceJson(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User employee = userOpt.get();
            String title = request.get("title");
            String description = request.get("description");
            String category = request.get("category");
            String imagePath = request.get("imagePath");
            
            if (title == null || description == null || category == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Title, description and category are required"));
            }
            
            Grievance grievance = new Grievance();
            grievance.setTitle(title);
            grievance.setDescription(description);
            grievance.setCategory(category);
            grievance.setStatus(Grievance.Status.OPEN);
            grievance.setEmployee(employee);
            grievance.setCreatedAt(LocalDateTime.now());
            if (imagePath != null) {
                grievance.setImagePath(imagePath);
            }
            
            grievanceRepository.save(grievance);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Grievance submitted successfully");
            response.put("grievance", Map.of(
                "id", grievance.getId(),
                "title", grievance.getTitle(),
                "description", grievance.getDescription(),
                "category", grievance.getCategory(),
                "status", grievance.getStatus().name()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllGrievances(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            List<Grievance> grievances;
            
            if (user.getRole() == User.Role.ADMIN) {
                grievances = grievanceRepository.findAllByOrderByCreatedAtDesc();
            } else if (user.getRole() == User.Role.TEAM_LEAD) {
                grievances = grievanceRepository.findAllByOrderByCreatedAtDesc();
            } else {
                grievances = grievanceRepository.findByEmployee(user);
            }
            
            List<Map<String, Object>> grievanceList = grievances.stream().map(g -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", g.getId());
                map.put("title", g.getTitle() != null ? g.getTitle() : "");
                map.put("description", g.getDescription());
                map.put("category", g.getCategory());
                map.put("status", g.getStatus().name());
                map.put("createdAt", g.getCreatedAt().toString());
                map.put("updatedAt", g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : null);
                map.put("updatedBy", g.getUpdatedBy() != null ? g.getUpdatedBy() : null);
                map.put("updatedByRole", g.getUpdatedByRole() != null ? g.getUpdatedByRole() : null);
                map.put("imagePath", g.getImagePath() != null ? g.getImagePath() : null);
                map.put("employeeName", g.getEmployee().getName());
                map.put("employeeEmail", g.getEmployee().getEmail());
                map.put("assignedTo", g.getAssignedTo() != null ? g.getAssignedTo().getName() : null);
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of("grievances", grievanceList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateGrievance(@PathVariable Long id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Allow both ADMIN and TEAM_LEAD to update status
            if (user.getRole() != User.Role.ADMIN && user.getRole() != User.Role.TEAM_LEAD) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only Admin or Team Lead can update complaint status"));
            }
            
            Optional<Grievance> grievanceOpt = grievanceRepository.findById(id);
            if (grievanceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Grievance not found"));
            }
            
            Grievance grievance = grievanceOpt.get();
            String status = request.get("status");
            
            if (status != null) {
                try {
                    // Handle REJECTED -> REJECT mapping for backward compatibility
                    String statusUpper = status.toUpperCase();
                    if (statusUpper.equals("REJECTED")) {
                        statusUpper = "REJECT";
                    }
                    grievance.setStatus(Grievance.Status.valueOf(statusUpper));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid status. Valid options: IN_PROGRESS, REJECT, ACCEPT"));
                }
            }
            
            if (grievance.getAssignedTo() == null) {
                grievance.setAssignedTo(user);
            }
            
            grievance.setUpdatedAt(LocalDateTime.now());
            grievance.setUpdatedBy(user.getEmail());
            // Track who changed: Manager (ADMIN) or TL
            if (user.getRole() == User.Role.ADMIN) {
                grievance.setUpdatedByRole("Manager");
            } else if (user.getRole() == User.Role.TEAM_LEAD) {
                grievance.setUpdatedByRole("Team Lead");
            }
            grievanceRepository.save(grievance);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Grievance updated successfully");
            response.put("grievance", Map.of(
                "id", grievance.getId(),
                "description", grievance.getDescription(),
                "category", grievance.getCategory(),
                "status", grievance.getStatus().name()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getGrievanceById(@PathVariable Long id, Authentication authentication) {
        try {
            Optional<Grievance> grievanceOpt = grievanceRepository.findById(id);
            if (grievanceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Complaint not found"));
            }
            
            Grievance g = grievanceOpt.get();
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("title", g.getTitle() != null ? g.getTitle() : "");
            map.put("description", g.getDescription());
            map.put("category", g.getCategory());
            map.put("status", g.getStatus().name());
            map.put("createdAt", g.getCreatedAt().toString());
            map.put("updatedAt", g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : null);
            map.put("updatedBy", g.getUpdatedBy() != null ? g.getUpdatedBy() : null);
            map.put("updatedByRole", g.getUpdatedByRole() != null ? g.getUpdatedByRole() : null);
            map.put("imagePath", g.getImagePath() != null ? g.getImagePath() : null);
            map.put("employeeName", g.getEmployee().getName());
            map.put("employeeEmail", g.getEmployee().getEmail());
            map.put("assignedTo", g.getAssignedTo() != null ? g.getAssignedTo().getName() : null);
            
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



