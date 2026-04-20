package com.smartcampus.backend.module_a.service;

import com.smartcampus.backend.module_a.dto.ResourceRequestDTO;
import com.smartcampus.backend.module_a.dto.ResourceResponseDTO;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResourceService {

    /** Create a new resource. Admin only. */
    ResourceResponseDTO createResource(ResourceRequestDTO dto);

    /** Get a single resource by its ID. Throws ResourceNotFoundException if not found. */
    ResourceResponseDTO getResourceById(Long id);

    /** Get all resources, paginated. */
    Page<ResourceResponseDTO> getAllResources(Pageable pageable);

    /**
     * Search resources with optional filters.
     * Any parameter can be null to skip that filter.
     */
    Page<ResourceResponseDTO> searchResources(
            ResourceType type,
            String location,
            Integer minCapacity,
            ResourceStatus status,
            Pageable pageable
    );

    /** Update all fields of an existing resource. Admin only. */
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto);

    /** Update only the status of a resource. Admin only. */
    ResourceResponseDTO updateStatus(Long id, ResourceStatus newStatus);

    /** Delete a resource. Admin only. */
    void deleteResource(Long id);
}
