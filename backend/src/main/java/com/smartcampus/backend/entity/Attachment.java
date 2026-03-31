package com.smartcampus.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ticket_attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The original name of the file (e.g., "broken_projector.png")
    private String fileName;

    // The type of file (e.g., "image/jpeg" or "image/png")
    private String fileType;

    // This is where the actual image data lives!
    // @Lob tells the database this is a "Large Object" 
    // LONGBLOB allows us to store images up to 4GB in MySQL
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;

    // --- The Relationship to IncidentTicket ---
    // Many attachments can belong to One ticket
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore // Prevents the infinite loop crash, just like we did in the Comments!
    private IncidentTicket incidentTicket;

    // --- Constructors ---
    public Attachment() {
    }

    public Attachment(String fileName, String fileType, byte[] data, IncidentTicket incidentTicket) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
        this.incidentTicket = incidentTicket;
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }

    public IncidentTicket getIncidentTicket() { return incidentTicket; }
    public void setIncidentTicket(IncidentTicket incidentTicket) { this.incidentTicket = incidentTicket; }
}