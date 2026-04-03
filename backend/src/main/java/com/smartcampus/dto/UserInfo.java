package com.smartcampus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfo {
    private Long id;
    private String email;
    private String name;
    private String picture;
    private String role;
}
