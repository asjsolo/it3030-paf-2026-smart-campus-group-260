package com.smartcampus.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "incident_tickets")
public class IncidentTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The type of issue (e.g., "Hardware", "Network", "Plumbing")
    private String category;

    // Detailed explanation of the issue
    @Column(columnDefinition = "TEXT")
    private String description;

    // E.g., "High", "Medium", "Low"
    private String priority;

    // Phone number or email of the person reporting it
    private String preferredContact;

    // The specific resource or room (e.g., "Room 101" or "Projector A")
    private String location;

    // If status is REJECTED, the admin explains why here
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    // Workflow: OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    private String status = "OPEN"; 

    // The ID or name of the staff member assigned to fix it
    private String assignedTechnician;

    // Notes added by the technician when resolving the issue
    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    // --- The Relationship to Comments ---
    // One ticket can have Many comments. 
    @OneToMany(mappedBy = "incidentTicket", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Comment> comments = new java.util.ArrayList<>();

    // --- The Relationship to Attachments ---
    // One ticket can have up to 3 attachments (we will enforce the limit of 3 in the Service later).
    @OneToMany(mappedBy = "incidentTicket", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Attachment> attachments = new java.util.ArrayList<>();

    // --- Constructors ---
    public IncidentTicket() {
    }

    // --- Getters and Setters ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getPreferredContact() { return preferredContact; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedTechnician() { return assignedTechnician; }
    public void setAssignedTechnician(String assignedTechnician) { this.assignedTechnician = assignedTechnician; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public java.util.List<Comment> getComments() { return comments; }
    public void setComments(java.util.List<Comment> comments) { this.comments = comments; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public java.util.List<Attachment> getAttachments() { return attachments; }
    public void setAttachments(java.util.List<Attachment> attachments) { this.attachments = attachments; }
}