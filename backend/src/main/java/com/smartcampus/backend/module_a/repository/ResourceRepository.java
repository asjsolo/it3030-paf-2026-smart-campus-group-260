package com.smartcampus.backend.module_a.repository;

import com.smartcampus.backend.module_a.entity.Resource;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Multi-criteria search query for the catalogue filter feature.
     * All parameters are optional — passing null skips that filter.
     *
     * @param type        filter by resource type (or null for any)
     * @param location    partial, case-insensitive match on location (or null for any)
     * @param minCapacity minimum capacity required (or null for any)
     * @param status      filter by status (or null for any)
     * @param pageable    pagination settings
     */
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity IS NOT NULL AND r.capacity >= :minCapacity) AND " +
           "(:status IS NULL OR r.status = :status)")
    Page<Resource> searchResources(
            @Param("type") ResourceType type,
            @Param("location") String location,
            @Param("minCapacity") Integer minCapacity,
            @Param("status") ResourceStatus status,
            Pageable pageable
    );
}
