package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository repository;

    // Constructor Injection: This tells Spring Boot to automatically provide the Repository we just made
    public IncidentTicketService(IncidentTicketRepository repository) {
        this.repository = repository;
    }

    // --- Business Logic Methods ---

    // 1. Create a brand new ticket
    public IncidentTicket createTicket(IncidentTicket ticket) {
        // Enforce the rule: All new tickets must start as OPEN
        ticket.setStatus("OPEN");
        return repository.save(ticket);
    }

    // 2. Retrieve all tickets (for an admin or technician dashboard)
    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    // 3. Find a specific ticket by its ID
    public IncidentTicket getTicketById(Long id) {
        // If the ticket doesn't exist, throw an error
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    // 4. Update a ticket's status and add resolution notes (for technicians)
    public IncidentTicket updateTicketStatusAndNotes(Long id, String newStatus, String notes) {
        IncidentTicket existingTicket = getTicketById(id);
        
        existingTicket.setStatus(newStatus);
        
        // Only update notes if they are provided
        if (notes != null && !notes.isEmpty()) {
            existingTicket.setResolutionNotes(notes);
        }
        
        return repository.save(existingTicket);
    }
}