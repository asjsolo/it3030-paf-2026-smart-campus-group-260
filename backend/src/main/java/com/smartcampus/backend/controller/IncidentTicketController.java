package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.service.IncidentTicketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@Slf4j
public class IncidentTicketController {

    private final IncidentTicketService service;

    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
    }

    // 1. Create a new ticket — creator's email is taken from the JWT principal
    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("priority") String priority,
            @RequestParam("preferredContact") String preferredContact,
            @RequestParam("location") String location,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal String email) {

        log.info("Creating ticket for user: {}", email);

        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setPreferredContact(preferredContact);
        ticket.setLocation(location);
        ticket.setCreatedByEmail(email);

        IncidentTicket createdTicket = service.createTicket(ticket);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets(@AuthenticationPrincipal String email) {
        boolean isTechnician = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_TECHNICIAN"));
        
        List<IncidentTicket> tickets = isTechnician 
                ? service.getAllTickets() 
                : service.getUserTickets(email);
        
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        return new ResponseEntity<>(service.getTicketById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        return new ResponseEntity<>(service.updateTicketStatusAndNotes(id, status, notes), HttpStatus.OK);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<IncidentTicket> assignTechnician(
            @PathVariable Long id,
            @RequestParam String technician) {
        return new ResponseEntity<>(service.assignTechnician(id, technician), HttpStatus.OK);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<IncidentTicket> rejectTicket(
            @PathVariable Long id,
            @RequestParam String reason) {
        return new ResponseEntity<>(service.rejectTicket(id, reason), HttpStatus.OK);
    }
}
