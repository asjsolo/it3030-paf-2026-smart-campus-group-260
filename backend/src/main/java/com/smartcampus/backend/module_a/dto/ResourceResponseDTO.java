package com.smartcampus.backend.module_a.dto;

import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;

import java.time.LocalDateTime;

/**
 * DTO for returning Resource data in API responses.
 *
 * CONTRACT: This shape is consumed by:
 *   - Module A frontend (CataloguePage, ResourceDetailPage)
 *   - Module B backend  (GET /api/resources/{id} to validate resource before booking)
 *   - Module C backend  (GET /api/resources/{id} to validate resource before ticketing)
 *
 * WARNING: Do NOT rename, remove, or change the type of any existing field.
 * If new fields are needed, ADD them — never remove existing ones.
 */
public class ResourceResponseDTO {

    private Long id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private ResourceStatus status;
    private String description;
    private String availabilityWindows;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAvailabilityWindows() {
        return availabilityWindows;
    }

    public void setAvailabilityWindows(String availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
