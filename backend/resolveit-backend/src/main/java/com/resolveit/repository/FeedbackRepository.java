package com.resolveit.repository;

import com.resolveit.model.Feedback;
import com.resolveit.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByGrievance(Grievance grievance);
    List<Feedback> findByGrievanceOrderByCreatedAtDesc(Grievance grievance);
}

