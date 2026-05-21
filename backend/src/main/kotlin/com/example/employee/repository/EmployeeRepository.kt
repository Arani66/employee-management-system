package com.example.employee.repository

import com.example.employee.model.Employee
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface EmployeeRepository: MongoRepository<Employee, String> {
    fun findByNicStartingWith (start: String ): List<Employee>
    fun findByDateOfJoining(date: LocalDate): List<Employee>
    fun findByDepartmentId(departmentId : String): List<Employee>
    fun findByDesignation(designation: String): List<Employee>
}