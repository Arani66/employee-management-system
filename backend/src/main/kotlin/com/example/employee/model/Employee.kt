package com.example.employee.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate

@Document(collection = "employees")
data class Employee (
    @Id
    val employeeId: String? = null,
    var firstName: String,
    var lastName: String,
    var email: String,
    var nic: String,
    var dateOfJoining: LocalDate? = null,
    var salary: Double,
    var departmentId: String,
    var designation: String
)