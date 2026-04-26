package com.smartcampus.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String email;
    private String role;
    private String password; // optional — if blank/null, password stays unchanged
}
