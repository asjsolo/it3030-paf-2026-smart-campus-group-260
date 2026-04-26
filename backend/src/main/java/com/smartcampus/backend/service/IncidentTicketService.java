package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import com.smartcampus.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class IncidentTicketService {

    private final IncidentTicketRepository repository;
    private final NotificationService notificationService;

    public IncidentTicketService(IncidentTicketRepository repository,
                                 NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    // 1. Create a brand new ticket
    public IncidentTicket createTicket(IncidentTicket ticket) {
        ticket.setStatus("OPEN");
        IncidentTicket saved = repository.save(ticket);
        log.info("Ticket {} created by {}", saved.getId(), saved.getCreatedByEmail());
        return saved;
    }

    // 2. Retrieve all tickets for a specific user by email
    public List<IncidentTicket> getUserTickets(String userEmail) {
        return repository.findByCreatedByEmail(userEmail);
    }

    // 2. Retrieve all tickets
    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }

    // 3. Find a specific ticket by its ID
    public IncidentTicket getTicketById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    // 4. Update status + resolution notes — notifies the ticket creator if status actually changed
    public IncidentTicket updateTicketStatusAndNotes(Long id, String newStatus, String notes) {
        IncidentTicket existingTicket = getTicketById(id);
        String previousStatus = existingTicket.getStatus();

        existingTicket.setStatus(newStatus);
        if (notes != null && !notes.isEmpty()) {
            existingTicket.setResolutionNotes(notes);
        }
        IncidentTicket saved = repository.save(existingTicket);

        log.info("Ticket {} status updated from {} to {}. CreatedByEmail: {}", 
                id, previousStatus, newStatus, saved.getCreatedByEmail());

        if (newStatus != null && !newStatus.equals(previousStatus)) {
            log.info("Sending notification to {} for ticket {}", saved.getCreatedByEmail(), id);
            notificationService.notifyTicketStatusChanged(
                    saved.getCreatedByEmail(), saved.getId(), saved.getTitle(), newStatus);
        }
        return saved;
    }

    // 5. Assign a Technician
    public IncidentTicket assignTechnician(Long id, String technician) {
        IncidentTicket ticket = getTicketById(id);
        String previousStatus = ticket.getStatus();

        ticket.setAssignedTechnician(technician);
        if ("OPEN".equals(previousStatus)) {
            ticket.setStatus("IN_PROGRESS");
        }
        IncidentTicket saved = repository.save(ticket);

        if (!saved.getStatus().equals(previousStatus)) {
            notificationService.notifyTicketStatusChanged(
                    saved.getCreatedByEmail(), saved.getId(), saved.getTitle(), saved.getStatus());
        }
        return saved;
    }

    // 6. Reject a Ticket
    public IncidentTicket rejectTicket(Long id, String reason) {
        IncidentTicket ticket = getTicketById(id);

        ticket.setStatus("REJECTED");
        ticket.setRejectionReason(reason);
        IncidentTicket saved = repository.save(ticket);

        notificationService.notifyTicketStatusChanged(
                saved.getCreatedByEmail(), saved.getId(), saved.getTitle(), "REJECTED");
        return saved;
    }
}
