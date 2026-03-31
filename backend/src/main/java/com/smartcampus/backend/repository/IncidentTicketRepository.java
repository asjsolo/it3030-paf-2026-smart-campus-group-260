package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {
}