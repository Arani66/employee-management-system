package com.example.employee.service

import com.example.employee.model.Employee
import com.example.employee.repository.EmployeeRepository
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service;

@Service
public class EmployeeService (val employeeRepository: EmployeeRepository){

    fun fetchEmployees() {
        val mockEmployees = "Name: ALice, Age: 25, Sex: female"
        println("Fetching initial employees mock data: $mockEmployees\n")
    }

    @PostConstruct
    fun startupHook() {
        println("SYSTEM STATUS: Initialized.")
        fetchEmployees()
    }

    fun addEmployee(employee: Employee): Employee {
        return employeeRepository.save(employee)
    }
    fun getAllEmployees(page: Int, size: Int, search: String): Page<Employee> {
        val pageable = PageRequest.of(page, size, Sort.by("firstName").ascending())
        return if (search.isBlank()) {
            employeeRepository.findBySearchTerm("", pageable)
        } else {
            employeeRepository.findBySearchTerm(search, pageable)
        }

    }
    fun getEmployeeById(id: String): Employee {
        return employeeRepository.findById(id)
            .orElseThrow { RuntimeException("Employee with ID $id not found") }
    }

    fun updateEmployee(id: String, updated: Employee): Employee {
        val existing = employeeRepository.findById(id)
            .orElseThrow { RuntimeException("Employee with ID $id not found") }
        val toSave = updated.copy(dateOfJoining = existing.dateOfJoining)
        return employeeRepository.save(toSave)

    }
    fun deleteEmployee(id: String) {
        if (!employeeRepository.existsById(id)) {
            throw RuntimeException("Employee with ID $id not found")
        }
        employeeRepository.deleteById(id)
    }
    fun getEmployeesByDepartment (department: String): List<Employee> {
        return employeeRepository.findByDepartmentId(department)
    }

    @PreDestroy
    fun shutdownHook() {
        println(" SYSTEM STATUS: Shutting down.")
    }
}