package com.resolveit.repository;

import com.resolveit.model.Grievance;
import com.resolveit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByEmployee(User employee);
    List<Grievance> findByAssignedTo(User assignedTo);
    List<Grievance> findAllByOrderByCreatedAtDesc();
}

