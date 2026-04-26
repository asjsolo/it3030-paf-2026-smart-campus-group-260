package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.IncidentTicket;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.IncidentTicketRepository;
import com.smartcampus.notification.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final IncidentTicketRepository ticketRepository;
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository,
                          IncidentTicketRepository ticketRepository,
                          NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.notificationService = notificationService;
    }

    /**
     * Add a comment to a ticket. The caller's email is passed in so we can avoid
     * notifying users about their own comments.
     */
    public Comment addComment(Long ticketId, Comment comment, String commenterEmail) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        comment.setIncidentTicket(ticket);
        Comment saved = commentRepository.save(comment);

        // Only notify if the comment is from someone other than the ticket creator.
        String ownerEmail = ticket.getCreatedByEmail();
        if (ownerEmail != null && !ownerEmail.equalsIgnoreCase(commenterEmail)) {
            notificationService.notifyTicketComment(
                    ownerEmail, ticket.getId(), ticket.getTitle(), comment.getAuthor());
        }
        return saved;
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    public Comment editComment(Long commentId, String newContent) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        existingComment.setContent(newContent);
        return commentRepository.save(existingComment);
    }
}
