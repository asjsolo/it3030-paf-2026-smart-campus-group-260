package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows your React frontend to communicate with this API
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // 1. Endpoint to ADD a new comment to a specific ticket
    // React will send a POST request to http://localhost:8082/api/tickets/{ticketId}/comments
    @PostMapping("/tickets/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long ticketId, 
            @RequestBody Comment comment) {
        
        Comment savedComment = commentService.addComment(ticketId, comment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }

    // 2. Endpoint to DELETE a specific comment
    // React will send a DELETE request to http://localhost:8082/api/comments/{commentId}
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content is standard for a successful delete
    }

    // 3. Endpoint to EDIT a specific comment
    // React will send a PUT request to http://localhost:8082/api/comments/{commentId}
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable Long commentId,
            @RequestBody java.util.Map<String, String> payload) {
        
        // We use a Map to easily grab just the "content" string from the JSON body
        String newContent = payload.get("content");
        
        // Pass it to the Service we just updated
        Comment updatedComment = commentService.editComment(commentId, newContent);
        
        // Return the fresh, updated comment back to the frontend
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }
}