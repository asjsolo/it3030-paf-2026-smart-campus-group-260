package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/tickets/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long ticketId,
            @RequestBody Comment comment,
            @AuthenticationPrincipal String email) {

        Comment savedComment = commentService.addComment(ticketId, comment, email);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable Long commentId,
            @RequestBody java.util.Map<String, String> payload) {
        String newContent = payload.get("content");
        Comment updatedComment = commentService.editComment(commentId, newContent);
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }
}
