package com.example.employee.repository

import com.example.employee.model.Employee
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface EmployeeRepository: MongoRepository<Employee, String> {
    fun findByNicStartingWith (start: String ): List<Employee>
    @Query($$"{ 'dateOfJoining': { $lte: ?0 } }")
    fun findEmployeesWithMoreThanFiveYears(cutoffDate: LocalDate): List<Employee>
    fun findByDepartmentId(departmentId : String): List<Employee>
    fun findByDesignation(designation: String): List<Employee>

    // Paginatiom
    @Query("{ \$or: [ { 'firstName': { \$regex: ?0, \$options: 'i' } }, { 'lastName': { \$regex: ?0, \$options: 'i' } }, { 'email': { \$regex: ?0, \$options: 'i' } } ] }")
    fun findBySearchTerm(search: String, pageable: Pageable): Page<Employee>
}