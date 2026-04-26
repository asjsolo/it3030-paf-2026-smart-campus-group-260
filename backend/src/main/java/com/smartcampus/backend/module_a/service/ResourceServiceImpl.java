package com.smartcampus.backend.module_a.service;

import com.smartcampus.backend.module_a.dto.ResourceRequestDTO;
import com.smartcampus.backend.module_a.dto.ResourceResponseDTO;
import com.smartcampus.backend.module_a.entity.Resource;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import com.smartcampus.backend.module_a.exception.ResourceNotFoundException;
import com.smartcampus.backend.module_a.repository.ResourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // -------------------------------------------------------------------------
    // CREATE
    // -------------------------------------------------------------------------

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO dto) {
        Resource resource = mapRequestToEntity(dto);
        Resource saved = resourceRepository.save(resource);
        return mapEntityToResponse(saved);
    }

    // -------------------------------------------------------------------------
    // READ
    // -------------------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public ResourceResponseDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return mapEntityToResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable)
                .map(this::mapEntityToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResourceResponseDTO> searchResources(
            ResourceType type,
            String location,
            Integer minCapacity,
            ResourceStatus status,
            Pageable pageable) {
        return resourceRepository.searchResources(type, location, minCapacity, status, pageable)
                .map(this::mapEntityToResponse);
    }

    // -------------------------------------------------------------------------
    // UPDATE
    // -------------------------------------------------------------------------

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        // Note: status is not updated here; use updateStatus() for status changes

        Resource saved = resourceRepository.save(resource);
        return mapEntityToResponse(saved);
    }

    @Override
    public ResourceResponseDTO updateStatus(Long id, ResourceStatus newStatus) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        resource.setStatus(newStatus);
        Resource saved = resourceRepository.save(resource);
        return mapEntityToResponse(saved);
    }

    // -------------------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------------------

    @Override
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        resourceRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    // Private Mapping Helpers
    // -------------------------------------------------------------------------

    private Resource mapRequestToEntity(ResourceRequestDTO dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        resource.setStatus(ResourceStatus.ACTIVE); // default on creation
        return resource;
    }

    private ResourceResponseDTO mapEntityToResponse(Resource resource) {
        ResourceResponseDTO dto = new ResourceResponseDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setStatus(resource.getStatus());
        dto.setDescription(resource.getDescription());
        dto.setAvailabilityWindows(resource.getAvailabilityWindows());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setUpdatedAt(resource.getUpdatedAt());
        return dto;
    }
}
