package com.smartcampus.backend.module_a.controller;

import com.smartcampus.backend.module_a.dto.ResourceRequestDTO;
import com.smartcampus.backend.module_a.dto.ResourceResponseDTO;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import com.smartcampus.backend.module_a.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Module A – Facilities & Assets Catalogue.
 *
 * Base URL: /api/resources
 *
 * Public endpoints  (no auth required yet — Module E will add security later):
 *   GET  /api/resources           - paginated list of all resources
 *   GET  /api/resources/{id}      - single resource detail
 *   GET  /api/resources/search    - filtered search (type, location, minCapacity, status)
 *
 * Admin-only endpoints  (Module E will guard these with @PreAuthorize("hasRole('ADMIN')")):
 *   POST   /api/resources              - create resource
 *   PUT    /api/resources/{id}         - full update
 *   PATCH  /api/resources/{id}/status  - status-only update
 *   DELETE /api/resources/{id}         - delete resource
 *
 * Port: 8082 (see application.properties)
 * Frontend dev origin: http://localhost:5173 (Vite)
 */
@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // -------------------------------------------------------------------------
    // PUBLIC ENDPOINTS
    // -------------------------------------------------------------------------

    /**
     * GET /api/resources
     * Returns a paginated list of all resources.
     * Default: page=0, size=12, sorted by name ascending.
     */
    @GetMapping
    public ResponseEntity<Page<ResourceResponseDTO>> getAllResources(
            @PageableDefault(size = 12, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(resourceService.getAllResources(pageable));
    }

    /**
     * GET /api/resources/{id}
     * Returns a single resource by ID.
     * Returns 404 if not found.
     *
     * NOTE: This endpoint is also called by Module B and Module C backends.
     * Do NOT change the URL or response shape.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    /**
     * GET /api/resources/search?type=LAB&location=Block+C&minCapacity=30&status=ACTIVE
     * All query params are optional. Paginated.
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ResourceResponseDTO>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) ResourceStatus status,
            @PageableDefault(size = 12, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(
                resourceService.searchResources(type, location, minCapacity, status, pageable)
        );
    }

    // -------------------------------------------------------------------------
    // ADMIN-ONLY ENDPOINTS
    // (Module E will add @PreAuthorize("hasRole('ADMIN')") here once auth is ready)
    // -------------------------------------------------------------------------

    /**
     * POST /api/resources
     * Creates a new resource. Request body must pass @Valid checks.
     */
    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(
            @Valid @RequestBody ResourceRequestDTO dto) {
        ResourceResponseDTO created = resourceService.createResource(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/resources/{id}
     * Fully updates an existing resource (except status — use PATCH for that).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO dto) {
        return ResponseEntity.ok(resourceService.updateResource(id, dto));
    }

    /**
     * PATCH /api/resources/{id}/status?status=OUT_OF_SERVICE
     * Updates only the status of a resource.
     * Module B should re-check status before confirming bookings.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        return ResponseEntity.ok(resourceService.updateStatus(id, status));
    }

    /**
     * DELETE /api/resources/{id}
     * Deletes a resource. Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
