package com.example.employee.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Positive
import java.time.LocalDate

data class EmployeeDto (
    @field:NotBlank val firstName: String,
    @field:NotBlank val lastName: String,
    @field:NotBlank @field:Email val email: String,
    @field:NotBlank val nic: String,
    @field:NotBlank val designation: String,
    @field:NotBlank val departmentId: String,
    @field:Positive val salary: Double,

    )