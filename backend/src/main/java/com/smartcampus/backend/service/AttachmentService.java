package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Attachment;
import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.repository.AttachmentRepository;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final IncidentTicketRepository ticketRepository;

    public AttachmentService(AttachmentRepository attachmentRepository, IncidentTicketRepository ticketRepository) {
        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
    }

    // --- Business Logic for File Uploads ---
    
    public Attachment uploadAttachment(Long ticketId, MultipartFile file) throws IOException {
        // Step A: Find the ticket in the database
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        // Step B: ENFORCE THE RUBRIC RULE - Maximum 3 attachments!
        if (ticket.getAttachments().size() >= 3) {
            throw new RuntimeException("Maximum limit reached: A ticket can only have up to 3 attachments.");
        }

        // Step C: Extract the data from the uploaded file and link it to the ticket
        Attachment attachment = new Attachment(
                file.getOriginalFilename(),
                file.getContentType(),
                //This converts the physical image file into the raw byte code that your LONGBLOB database column requires.
                file.getBytes(),
                ticket
        );

        // Step D: Save it to the database
        return attachmentRepository.save(attachment);
    }
    
    // Quick method to retrieve the file later so your React frontend can display it
    public Attachment getAttachment(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + attachmentId));
    }
}