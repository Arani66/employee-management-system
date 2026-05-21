package com.example.employee.service

import com.example.employee.model.Employee
import com.example.employee.repository.EmployeeRepository
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
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
    fun getAllEmployees(): List<Employee> {
        return employeeRepository.findAll()
    }
    fun getEmployeeById(id: String): Employee {
        return employeeRepository.findById(id).orElseThrow {
            RuntimeException("Employee with ID $id not found!")
        }
    }
    fun updateEmployee (id: String, employee: Employee): Employee {
        return employeeRepository.save(employee)
    }
    fun deleteEmployee (id: String) {
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