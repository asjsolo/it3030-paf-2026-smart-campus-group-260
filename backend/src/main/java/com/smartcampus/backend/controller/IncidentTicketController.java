package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.service.IncidentTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") // Allows your React frontend to communicate with this API
public class IncidentTicketController {

    private final IncidentTicketService service;

    // Constructor Injection for the Service
    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
    }

    // 1. Endpoint to CREATE a new ticket
    // React will send a POST request to http://localhost:8080/api/tickets
    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(@RequestBody IncidentTicket ticket) {
        IncidentTicket createdTicket = service.createTicket(ticket);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    // 2. Endpoint to GET ALL tickets
    // React will send a GET request to http://localhost:8080/api/tickets
    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        List<IncidentTicket> tickets = service.getAllTickets();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    // 3. Endpoint to GET a SPECIFIC ticket by its ID
    // React will send a GET request to http://localhost:8080/api/tickets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        IncidentTicket ticket = service.getTicketById(id);
        return new ResponseEntity<>(ticket, HttpStatus.OK);
    }

    // 4. Endpoint to UPDATE a ticket's status and notes (for technicians)
    // React will send a PUT request to http://localhost:8080/api/tickets/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
            
        IncidentTicket updatedTicket = service.updateTicketStatusAndNotes(id, status, notes);
        return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
    }
}