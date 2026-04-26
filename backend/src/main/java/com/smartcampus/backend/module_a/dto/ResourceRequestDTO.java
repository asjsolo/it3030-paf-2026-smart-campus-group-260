package com.smartcampus.backend.module_a.dto;

import com.smartcampus.backend.module_a.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating or updating a Resource.
 * Used as the request body for POST /api/resources and PUT /api/resources/{id}.
 */
public class ResourceRequestDTO {

    @NotBlank(message = "Resource name is required")
    @Size(max = 150, message = "Resource name must be 150 characters or fewer")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be at least 1 if provided")
    private Integer capacity; // optional — leave null for equipment

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be 200 characters or fewer")
    private String location;

    @Size(max = 2000, message = "Description must be 2000 characters or fewer")
    private String description;

    /**
     * JSON string representing availability windows.
     * Example: [{"day":"MON","start":"08:00","end":"18:00"}]
     */
    @Size(max = 500, message = "Availability windows must be 500 characters or fewer")
    private String availabilityWindows;

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

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
}
