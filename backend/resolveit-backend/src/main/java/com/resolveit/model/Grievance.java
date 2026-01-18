package com.resolveit.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "grievances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grievance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 500)
    private String description;
    
    @Column(nullable = false)
    private String category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Column(length = 500)
    private String imagePath;
    
    @Column(length = 100)
    private String updatedBy;
    
    @Column(length = 50)
    private String updatedByRole; // ADMIN or TEAM_LEAD
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;
    
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
    
    public enum Status {
        OPEN,
        IN_PROGRESS,
        REJECT,
        ACCEPT
    }
}



