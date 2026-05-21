package com.example.employee.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "departments")
data class Department(
    @Id
    var departmentId: String? = null,
    var departmentName: DepartmentName,
)

enum class DepartmentName{
    HR,
    FINANCE,
    ENGINEERING,
    SALES
}