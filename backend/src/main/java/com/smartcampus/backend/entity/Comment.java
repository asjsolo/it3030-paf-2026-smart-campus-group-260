package com.smartcampus.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The person who wrote the comment (e.g., "Student ID" or "Staff Name")
    private String author;

    // The actual text of the comment
    @Column(columnDefinition = "TEXT")
    private String content;

    // Automatically records exactly when the comment was made
    private LocalDateTime timestamp = LocalDateTime.now();

    // --- The Relationship to IncidentTicket ---
    // Many comments can belong to One ticket
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore // This prevents an infinite loop when sending data to the React frontend
    private IncidentTicket incidentTicket;

    // --- Constructors ---
    public Comment() {
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public IncidentTicket getIncidentTicket() { return incidentTicket; }
    public void setIncidentTicket(IncidentTicket incidentTicket) { this.incidentTicket = incidentTicket; }
}