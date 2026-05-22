package com.example.employee.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate

@Document(collection = "employees")
@CompoundIndex(def = "{'email': 1}", unique = true)
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
    var designation: String,
    var profileImage: String? = null
)