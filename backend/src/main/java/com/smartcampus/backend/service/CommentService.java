package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final IncidentTicketRepository ticketRepository;

    // We inject BOTH repositories because we need to look up the ticket before saving the comment
    public CommentService(CommentRepository commentRepository, IncidentTicketRepository ticketRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
    }

    // --- Business Logic Methods ---

    // 1. Add a new comment to an existing ticket
    public Comment addComment(Long ticketId, Comment comment) {
        // Step A: Find the ticket in the database. If it doesn't exist, throw an error.
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
        
        // Step B: Attach the ticket to this new comment
        comment.setIncidentTicket(ticket);
        
        // Step C: Save the comment to the database
        return commentRepository.save(comment);
    }
    
    // 2. Delete a comment (Module requirement: "edit/delete as appropriate")
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    // 3. Edit an existing comment
    public Comment editComment(Long commentId, String newContent) {
        // Step A: Find the existing comment in the database
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Step B: Update the text content of the comment
        existingComment.setContent(newContent);
        
        // Step C: Save the updated comment back to the database
        return commentRepository.save(existingComment);
    }
}