# Module A – Facilities & Assets Catalogue: Implementation Guide

> **Author:** Group 260 – Module A Developer
> **Project:** IT3030 Smart Campus System (2026)
> **Stack:** Java 21 · Spring Boot 3.5 · Spring Data JPA · MySQL · React + Vite
> **Last Updated:** 2026-04-10

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Scope & Boundaries](#2-scope--boundaries)
3. [Inter-Module Dependency Map](#3-inter-module-dependency-map)
4. [Dependency Management Strategy (Conflict Prevention)](#4-dependency-management-strategy-conflict-prevention)
5. [Backend Implementation](#5-backend-implementation)
   - [Package Structure](#51-package-structure)
   - [Database Schema](#52-database-schema)
   - [Entity Classes](#53-entity-classes)
   - [Repository Layer](#54-repository-layer)
   - [Service Layer](#55-service-layer)
   - [REST API Endpoints](#56-rest-api-endpoints)
   - [DTOs & Validation](#57-dtos--validation)
6. [Frontend Implementation](#6-frontend-implementation)
   - [Component Structure](#61-component-structure)
   - [API Service Layer](#62-api-service-layer)
   - [Pages & Routes](#63-pages--routes)
7. [Integration Contracts (Shared API Shapes)](#7-integration-contracts-shared-api-shapes)
8. [Git Workflow & Branch Strategy](#8-git-workflow--branch-strategy)
9. [Testing Plan](#9-testing-plan)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. Module Overview

**Module A – Facilities & Assets Catalogue** is the **foundational data module** for the entire Smart Campus System. It manages the master list of all bookable campus resources — lecture halls, labs, meeting rooms, and equipment (projectors, cameras, etc.).

### What This Module Does
- Maintains a catalogue of bookable resources with rich metadata.
- Exposes a searchable, filterable REST API that **other modules depend on**.
- Tracks resource status (`ACTIVE` / `OUT_OF_SERVICE`).

### Why It's Critical
> Module A is a **hard dependency** for both Module B (Booking) and Module C (Maintenance Ticketing). Both modules reference resources by `resourceId`. Without Module A's entities and APIs in place, Modules B and C **cannot function**.

---

## 2. Scope & Boundaries

### In Scope (Module A owns this)
| Area | Responsibility |
|---|---|
| `Resource` entity & table | Full CRUD ownership |
| Resource metadata | type, capacity, location, availabilityWindows, status |
| Search & filter API | by type, capacity, location |
| Resource status management | ACTIVE / OUT_OF_SERVICE transitions |
| Frontend catalogue page | browse, search, filter |
| Frontend resource detail page | view full resource details |

### Out of Scope (owned by other modules)
| Area | Owner |
|---|---|
| Booking a resource | Module B |
| Reporting incidents on a resource | Module C |
| Notifications about resource changes | Module D |
| Who can create/edit resources (auth guard) | Module E |
| User identity & JWT tokens | Module E |

---

## 3. Inter-Module Dependency Map

```
┌──────────────────────────────────────────────────────────┐
│              Module E – Auth & Authorization             │
│   (provides: JWT tokens, UserPrincipal, @PreAuthorize)   │
└──────────────────────┬───────────────────────────────────┘
                       │ guards all endpoints
          ┌────────────▼────────────┐
          │   Module A (YOU)        │
          │   Facilities Catalogue  │
          │   - Resource entity     │
          │   - resourceId (FK)     │
          └──────┬───────────┬──────┘
                 │           │
    resourceId FK│           │resourceId FK
          ┌──────▼──┐   ┌────▼──────┐
          │Module B │   │Module C   │
          │Booking  │   │Ticketing  │
          └────┬────┘   └─────┬─────┘
               │              │
       booking │     ticket   │
       events  │     events   │
          ┌────▼──────────────▼────┐
          │   Module D – Notifications                   │
          └───────────────────────────────────────────────┘
```

### Dependency Direction Summary
- **Module A depends on:** Module E (for auth guards on admin-only endpoints)
- **Module B depends on:** Module A (reads `resourceId` to create bookings)
- **Module C depends on:** Module A (reads `resourceId` to file incident tickets)
- **Module D depends on:** Module B & C (listens for events, does NOT touch Module A directly)

---

## 4. Dependency Management Strategy (Conflict Prevention)

This section is the most important for team coordination. Follow these rules strictly.

### 4.1 File Ownership Rules — "Who Owns What"

Each developer must **only modify files within their module's package**. Use the table below as the authoritative ownership map:

| Path | Owner |
|---|---|
| `backend/.../module_a/**` | **YOU (Module A)** |
| `backend/.../module_b/**` | Module B developer |
| `backend/.../module_c/**` | Module C developer |
| `backend/.../module_d/**` | Module D developer |
| `backend/.../module_e/**` | Module E developer |
| `frontend/src/modules/catalogue/**` | **YOU (Module A)** |
| `frontend/src/modules/booking/**` | Module B developer |
| `frontend/src/modules/tickets/**` | Module C developer |
| `frontend/src/App.jsx` | **SHARED — coordinate before editing** |
| `backend/src/main/resources/application.properties` | **SHARED — coordinate before editing** |
| `backend/pom.xml` | **SHARED — coordinate before editing** |

> **Rule:** Never edit a file owned by another developer without first opening a PR discussion or messaging them directly.

---

### 4.2 Shared File Coordination Protocol

Some files are shared across all modules. Follow this protocol to avoid conflicts:

#### `frontend/src/App.jsx` (React Router)
- Each developer adds **only their own routes**.
- Use a **feature branch** → open a **PR** → teammate merges their own route upon approval.
- Agreed route paths (do NOT reuse these):

| Route | Module | Owner |
|---|---|---|
| `/catalogue` | A | You |
| `/catalogue/:id` | A | You |
| `/bookings` | B | Module B dev |
| `/bookings/:id` | B | Module B dev |
| `/tickets` | C | Module C dev |
| `/tickets/:id` | C | Module C dev |
| `/notifications` | D | Module D dev |
| `/login`, `/oauth/callback` | E | Module E dev |
| `/admin/**` | E | Module E dev |

#### `backend/pom.xml`
- If you need to add a new Maven dependency, **notify the team on your group chat** before pushing.
- Only add dependencies needed by your module. Do not remove or change existing ones.
- Suggested new dependencies for Module A:
  ```xml
  <!-- Validation (if not already added by Module E) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
  <!-- Lombok (reduces boilerplate entity code - team should agree to use this) -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
  ```

#### `backend/src/main/resources/application.properties`
- Do not change DB credentials or server port.
- If you need a module-specific config key, prefix it with `module.a.` (e.g., `module.a.default-page-size=10`).

---

### 4.3 Shared Entity / Foreign Key Contract

Module B and Module C will reference your `Resource` entity via a foreign key. To avoid breaking their work:

1. **Lock the `Resource` primary key type early.** Use `Long id` — do not change it later.
2. **Never rename or drop the `resources` table** once it is agreed upon.
3. **Never remove or rename fields** that other modules depend on:
   - `id` — used by Module B & C as foreign key
   - `name` — displayed in booking and ticket summaries
   - `status` — used by Module B to check if resource is bookable
4. If you need to add a new column, just add it — it won't break existing code.
5. If you need to **change an existing column** (rename, type change), announce it in the group chat at least **one day before** pushing, so other developers can update their code.

---

### 4.4 API Contract Stability

Your REST API is consumed by the frontend (Module A pages), and the `GET /api/resources/{id}` endpoint will also be called by **Module B and Module C** backends to validate that a resource exists before creating a booking or ticket.

**Stable endpoints (do not change URL, method, or response shape once agreed):**

| Method | URL | Used by |
|---|---|---|
| `GET` | `/api/resources` | Module A frontend, Module B frontend |
| `GET` | `/api/resources/{id}` | Module A frontend, Module B backend, Module C backend |
| `GET` | `/api/resources/search` | Module A frontend |

> If you must change a response field name, **version the API** (e.g., `/api/v2/resources`) instead of breaking the original.

---

### 4.5 Git Branch Strategy

```
main
 └── develop          ← integration branch (all modules merge here)
      ├── feature/module-a-catalogue    ← YOUR branch
      ├── feature/module-b-booking      ← Module B dev's branch
      ├── feature/module-c-tickets      ← Module C dev's branch
      └── feature/module-e-auth         ← Module E dev's branch
```

**Rules:**
1. **Always branch from `develop`**, not `main`.
2. **Pull from `develop` daily** to stay up to date: `git pull origin develop`.
3. Open a **Pull Request into `develop`**, not `main`, for code review.
4. Merge to `main` only as a team when a milestone is complete.
5. **Never force-push** to `develop` or `main`.
6. Use descriptive commit messages: `feat(module-a): add Resource entity and repository`.

---

### 4.6 Stub / Mock Strategy for Independent Development

Since Module A's resource data is needed by other modules, **provide stubs early** so your team can develop independently:

**Step 1 (Week 1):** Agree on the `Resource` JSON shape (see [Section 7](#7-integration-contracts-shared-api-shapes)) and share it.

**Step 2:** You run your backend locally. Other modules can point their local env to your backend via the agreed API contract.

**Step 3:** If your backend isn't ready, provide a **mock JSON file** in the repo at `shared/mocks/resources.json` that other developers can use in their frontend until your API is live.

---

## 5. Backend Implementation

### 5.1 Package Structure

Create your files under the `module_a` sub-package to keep everything isolated:

```
com.smartcampus.backend
│
├── BackendApplication.java         (existing — do not modify)
│
├── module_a/                       ← YOUR PACKAGE
│   ├── entity/
│   │   └── Resource.java
│   ├── enums/
│   │   ├── ResourceType.java
│   │   └── ResourceStatus.java
│   ├── dto/
│   │   ├── ResourceRequestDTO.java
│   │   ├── ResourceResponseDTO.java
│   │   └── ResourceSearchDTO.java
│   ├── repository/
│   │   └── ResourceRepository.java
│   ├── service/
│   │   ├── ResourceService.java
│   │   └── ResourceServiceImpl.java
│   └── controller/
│       └── ResourceController.java
│
├── module_b/                       ← Module B developer's package
├── module_c/                       ← Module C developer's package (already has entity/controller)
├── module_d/                       ← Module D developer's package
└── module_e/                       ← Module E developer's package
```

> **Note:** The existing `controller/`, `entity/`, `repository/`, `service/` top-level packages belong to the current Module C starter code. Do **not** add your Module A files into those packages — use `module_a/` sub-packages instead for clean isolation.

---

### 5.2 Database Schema

```sql
CREATE TABLE resources (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,
    type            VARCHAR(50)     NOT NULL,   -- LECTURE_HALL | LAB | MEETING_ROOM | EQUIPMENT
    capacity        INT             NULL,        -- NULL for equipment (no capacity concept)
    location        VARCHAR(200)    NOT NULL,
    status          VARCHAR(30)     NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | OUT_OF_SERVICE
    description     TEXT            NULL,
    availability_windows VARCHAR(500) NULL,      -- JSON string e.g. [{"day":"MON","start":"08:00","end":"18:00"}]
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

> ⚠️ **Share this schema with Module B & C developers immediately.** They need the `resources` table to exist before they can define their foreign key relationships.

---

### 5.3 Entity Classes

**`Resource.java`**
```java
package com.smartcampus.backend.module_a.entity;

import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ResourceType type;

    @Column
    private Integer capacity; // nullable for equipment

    @Column(nullable = false, length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ResourceStatus status = ResourceStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "availability_windows", length = 500)
    private String availabilityWindows; // stored as JSON string

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    // (generate with IDE or use Lombok @Data)
}
```

**`ResourceType.java`**
```java
package com.smartcampus.backend.module_a.enums;

public enum ResourceType {
    LECTURE_HALL,
    LAB,
    MEETING_ROOM,
    EQUIPMENT
}
```

**`ResourceStatus.java`**
```java
package com.smartcampus.backend.module_a.enums;

public enum ResourceStatus {
    ACTIVE,
    OUT_OF_SERVICE
}
```

---

### 5.4 Repository Layer

```java
package com.smartcampus.backend.module_a.repository;

import com.smartcampus.backend.module_a.entity.Resource;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Search by type
    Page<Resource> findByType(ResourceType type, Pageable pageable);

    // Search by status
    Page<Resource> findByStatus(ResourceStatus status, Pageable pageable);

    // Combined filter query
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%',:location,'%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:status IS NULL OR r.status = :status)")
    Page<Resource> searchResources(
        @Param("type") ResourceType type,
        @Param("location") String location,
        @Param("minCapacity") Integer minCapacity,
        @Param("status") ResourceStatus status,
        Pageable pageable
    );
}
```

---

### 5.5 Service Layer

**`ResourceService.java` (interface)**
```java
package com.smartcampus.backend.module_a.service;

import com.smartcampus.backend.module_a.dto.ResourceRequestDTO;
import com.smartcampus.backend.module_a.dto.ResourceResponseDTO;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResourceService {
    ResourceResponseDTO createResource(ResourceRequestDTO dto);
    ResourceResponseDTO getResourceById(Long id);
    Page<ResourceResponseDTO> getAllResources(Pageable pageable);
    Page<ResourceResponseDTO> searchResources(ResourceType type, String location, 
                                               Integer minCapacity, ResourceStatus status, 
                                               Pageable pageable);
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO dto);
    ResourceResponseDTO updateStatus(Long id, ResourceStatus newStatus);
    void deleteResource(Long id);
}
```

---

### 5.6 REST API Endpoints

**`ResourceController.java`**

```java
package com.smartcampus.backend.module_a.controller;

import com.smartcampus.backend.module_a.dto.ResourceRequestDTO;
import com.smartcampus.backend.module_a.dto.ResourceResponseDTO;
import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import com.smartcampus.backend.module_a.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173") // Vite dev server
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // PUBLIC: List all resources (paginated)
    @GetMapping
    public ResponseEntity<Page<ResourceResponseDTO>> getAllResources(Pageable pageable) {
        return ResponseEntity.ok(resourceService.getAllResources(pageable));
    }

    // PUBLIC: Get single resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // PUBLIC: Search and filter
    @GetMapping("/search")
    public ResponseEntity<Page<ResourceResponseDTO>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) ResourceStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(
            resourceService.searchResources(type, location, minCapacity, status, pageable)
        );
    }

    // ADMIN ONLY: Create resource (Module E will protect with @PreAuthorize)
    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(
            @Valid @RequestBody ResourceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.createResource(dto));
    }

    // ADMIN ONLY: Update resource
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO dto) {
        return ResponseEntity.ok(resourceService.updateResource(id, dto));
    }

    // ADMIN ONLY: Update resource status only
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        return ResponseEntity.ok(resourceService.updateStatus(id, status));
    }

    // ADMIN ONLY: Delete resource
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
```

**Full API Summary:**

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/resources` | No | List all resources (paginated) |
| `GET` | `/api/resources/{id}` | No | Get resource by ID |
| `GET` | `/api/resources/search` | No | Filter by type, location, capacity, status |
| `POST` | `/api/resources` | ADMIN | Create new resource |
| `PUT` | `/api/resources/{id}` | ADMIN | Update resource |
| `PATCH` | `/api/resources/{id}/status` | ADMIN | Change status only |
| `DELETE` | `/api/resources/{id}` | ADMIN | Delete resource |

---

### 5.7 DTOs & Validation

**`ResourceRequestDTO.java`**
```java
package com.smartcampus.backend.module_a.dto;

import com.smartcampus.backend.module_a.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ResourceRequestDTO {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity; // optional for equipment

    @NotBlank(message = "Location is required")
    private String location;

    private String description;
    private String availabilityWindows;

    // Getters & Setters
}
```

**`ResourceResponseDTO.java`**
```java
package com.smartcampus.backend.module_a.dto;

import com.smartcampus.backend.module_a.enums.ResourceStatus;
import com.smartcampus.backend.module_a.enums.ResourceType;
import java.time.LocalDateTime;

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

    // Getters & Setters
}
```

---

## 6. Frontend Implementation

### 6.1 Component Structure

Create your frontend files under `frontend/src/modules/catalogue/`:

```
frontend/src/
├── App.jsx                            (SHARED — add ONLY your routes)
├── modules/
│   ├── catalogue/                     ← YOUR FRONTEND FOLDER
│   │   ├── pages/
│   │   │   ├── CataloguePage.jsx      (listing + search/filter)
│   │   │   └── ResourceDetailPage.jsx (single resource view)
│   │   ├── components/
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── ResourceSearchBar.jsx
│   │   │   └── ResourceFilterPanel.jsx
│   │   ├── services/
│   │   │   └── resourceApi.js         (all API calls for Module A)
│   │   └── index.js                   (exports for other modules to import)
│   ├── booking/                       (Module B dev's folder)
│   ├── tickets/                       (Module C dev's folder)
│   └── notifications/                 (Module D dev's folder)
```

---

### 6.2 API Service Layer

**`frontend/src/modules/catalogue/services/resourceApi.js`**

```javascript
const BASE_URL = 'http://localhost:8080/api/resources';

export const resourceApi = {

  // Fetch all resources (paginated)
  getAll: async (page = 0, size = 12) => {
    const res = await fetch(`${BASE_URL}?page=${page}&size=${size}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  // Fetch single resource
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Resource ${id} not found`);
    return res.json();
  },

  // Search with filters
  search: async ({ type, location, minCapacity, status, page = 0, size = 12 }) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    if (minCapacity) params.append('minCapacity', minCapacity);
    if (status) params.append('status', status);
    params.append('page', page);
    params.append('size', size);

    const res = await fetch(`${BASE_URL}/search?${params}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // Admin: Create resource
  create: async (resourceData, token) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(resourceData),
    });
    if (!res.ok) throw new Error('Failed to create resource');
    return res.json();
  },

  // Admin: Update resource
  update: async (id, resourceData, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(resourceData),
    });
    if (!res.ok) throw new Error('Failed to update resource');
    return res.json();
  },

  // Admin: Update status only
  updateStatus: async (id, status, token) => {
    const res = await fetch(`${BASE_URL}/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },
};
```

---

### 6.3 Pages & Routes

Add **only the following routes** to `App.jsx` when Module E's auth setup is in place:

```jsx
// Add these imports at the top of App.jsx
import CataloguePage from './modules/catalogue/pages/CataloguePage';
import ResourceDetailPage from './modules/catalogue/pages/ResourceDetailPage';

// Add these routes inside <Routes> in App.jsx
<Route path="/catalogue" element={<CataloguePage />} />
<Route path="/catalogue/:id" element={<ResourceDetailPage />} />
```

---

## 7. Integration Contracts (Shared API Shapes)

> **Share this section with all team members immediately.** These are the agreed JSON shapes that all modules must treat as stable.

### Resource Object (from `GET /api/resources/{id}`)

```json
{
  "id": 1,
  "name": "Lab 301 – Computer Lab",
  "type": "LAB",
  "capacity": 40,
  "location": "Block C, Level 3",
  "status": "ACTIVE",
  "description": "Equipped with 40 PCs running Ubuntu 22.04.",
  "availabilityWindows": "[{\"day\":\"MON\",\"start\":\"08:00\",\"end\":\"18:00\"}]",
  "createdAt": "2026-04-10T10:00:00",
  "updatedAt": "2026-04-10T10:00:00"
}
```

### Paginated List Response (from `GET /api/resources`)

```json
{
  "content": [ /* array of Resource objects */ ],
  "totalElements": 25,
  "totalPages": 3,
  "size": 12,
  "number": 0
}
```

### Resource Types Enum Values
```
LECTURE_HALL | LAB | MEETING_ROOM | EQUIPMENT
```

### Resource Status Enum Values
```
ACTIVE | OUT_OF_SERVICE
```

---

## 8. Git Workflow & Branch Strategy

### Day-to-Day Workflow

```bash
# 1. Start your day — pull latest from develop
git checkout feature/module-a-catalogue
git pull origin develop

# 2. Work on your code
# ... make changes ...

# 3. Commit with a clear message
git add .
git commit -m "feat(module-a): add ResourceRepository with search query"

# 4. Push your branch
git push origin feature/module-a-catalogue

# 5. When a feature is complete, open a PR to develop on GitHub
# 6. Request a teammate to review before merging
```

### Commit Message Convention

Use the following format for all commits:
```
<type>(module-a): <short description>

Types: feat | fix | refactor | docs | test | chore
```

**Examples:**
- `feat(module-a): add Resource entity and JPA repository`
- `feat(module-a): implement search/filter API endpoint`
- `feat(module-a): build CataloguePage component with filters`
- `fix(module-a): fix null pointer in capacity filter`
- `docs(module-a): update MODULE_A_IMPLEMENTATION_GUIDE.md`

### Merge Conflict Prevention Checklist
- [ ] Pulled from `develop` today before starting work?
- [ ] Only edited files in `module_a/` package (backend) and `modules/catalogue/` (frontend)?
- [ ] Notified team before editing `App.jsx`, `pom.xml`, or `application.properties`?
- [ ] Running `git status` before committing to confirm no accidental edits to other files?

---

## 9. Testing Plan

### Backend Tests

| Test | Type | Tool |
|---|---|---|
| Create resource with valid data → returns 201 | Integration | JUnit 5 + MockMvc |
| Create resource with missing name → returns 400 | Integration | JUnit 5 + MockMvc |
| Get resource by valid ID → returns resource | Integration | JUnit 5 + MockMvc |
| Get resource by invalid ID → returns 404 | Integration | JUnit 5 + MockMvc |
| Search by type=LAB → returns only LABs | Integration | JUnit 5 + MockMvc |
| Filter by minCapacity=30 → returns only capacity ≥ 30 | Integration | JUnit 5 + MockMvc |
| Update resource status to OUT_OF_SERVICE | Integration | JUnit 5 + MockMvc |

**Test class location:** `src/test/java/com/smartcampus/backend/module_a/`

### Manual Testing (Postman)

Import the following quick tests into Postman:
1. `GET http://localhost:8080/api/resources` → should return paginated list
2. `POST http://localhost:8080/api/resources` with body → should create resource
3. `GET http://localhost:8080/api/resources/search?type=LAB&minCapacity=30` → filtered results
4. `PATCH http://localhost:8080/api/resources/1/status?status=OUT_OF_SERVICE` → status update

### Frontend Testing

- Verify catalogue page loads and displays resource cards.
- Verify search bar filters results in real time.
- Verify clicking a resource card navigates to the detail page.
- Verify resource detail page shows all fields correctly.

---

## 10. Implementation Checklist

Use this to track your progress:

### Phase 1 – Foundation (Week 1)
- [ ] Create `module_a` package structure in backend
- [ ] Write `Resource` entity, `ResourceType` and `ResourceStatus` enums
- [ ] Write `ResourceRepository` with search query
- [ ] Write `ResourceRequestDTO` and `ResourceResponseDTO`
- [ ] Write `ResourceServiceImpl`
- [ ] Write `ResourceController`
- [ ] Run backend and test all endpoints with Postman
- [ ] **Share resource JSON contract with team**
- [ ] Create `shared/mocks/resources.json` mock file for other teams

### Phase 2 – Frontend (Week 2)
- [ ] Create `modules/catalogue/` folder structure
- [ ] Write `resourceApi.js` service
- [ ] Build `ResourceCard` component
- [ ] Build `ResourceSearchBar` and `ResourceFilterPanel` components
- [ ] Build `CataloguePage` with pagination and filters
- [ ] Build `ResourceDetailPage`
- [ ] Add routes to `App.jsx` (coordinate with team first)
- [ ] Test all frontend flows manually

### Phase 3 – Integration & Polish (Week 3)
- [ ] Integrate with Module E auth (add `Authorization` header to admin calls)
- [ ] Add loading states and error handling in UI
- [ ] Write JUnit integration tests for controller
- [ ] Handle `OUT_OF_SERVICE` resources visually (grey out in UI)
- [ ] Code review with a teammate
- [ ] Merge feature branch into `develop`

---

*Guide prepared for IT3030 PAF 2026 – Smart Campus Group 260 – Module A Developer.*
