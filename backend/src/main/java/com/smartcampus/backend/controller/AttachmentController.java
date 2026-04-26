package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Attachment;
import com.smartcampus.backend.service.AttachmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows React to talk to this API
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    // 1. Endpoint to UPLOAD an image to a ticket
    // React will send a POST request with form-data to http://localhost:8082/api/tickets/{ticketId}/attachments
    @PostMapping("/tickets/{ticketId}/attachments")
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file) {
        try {
            Attachment savedAttachment = attachmentService.uploadAttachment(ticketId, file);
            return new ResponseEntity<>(savedAttachment, HttpStatus.CREATED);
        } catch (Exception e) {
            // If they try to upload a 4th image, the Service throws an error, and we send that error text back here
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 2. Endpoint to VIEW or DOWNLOAD the image
    // React can use this URL directly in an <img src="..."> tag!
    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<byte[]> getAttachment(@PathVariable Long attachmentId) {
        Attachment attachment = attachmentService.getAttachment(attachmentId);

        return ResponseEntity.ok()
                // Tells the browser "this is a JPEG" or "this is a PNG"
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                // "inline" means display it in the browser. "attachment" would force a download.
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + attachment.getFileName() + "\"")
                .body(attachment.getData()); // The raw image bytes!
    }
}