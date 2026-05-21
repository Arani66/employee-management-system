package com.example.employee.controller

import com.example.employee.dto.EmployeeDto
import com.example.employee.model.Employee
import com.example.employee.service.EmployeeService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@CrossOrigin(origins = ["http://localhost:3000"])
@RestController
@RequestMapping("api/employees")
class EmployeeController (private val employeeService: EmployeeService) {
    @PostMapping
    fun addEmployee(@Valid @RequestBody dto: EmployeeDto): ResponseEntity<Employee> {
        val employeeData = Employee (
            firstName = dto.firstName,
            lastName = dto.lastName,
            email = dto.email,
            nic = dto.nic,
            salary = dto.salary,
            designation = dto.designation,
            departmentId = dto.departmentId,
            dateOfJoining = LocalDate.now()
        )
        val savedEmployee = employeeService.addEmployee(employeeData)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEmployee)
    }

    @GetMapping
    fun getAllEmployees(): ResponseEntity<List<Employee>> {
        val employees = employeeService.getAllEmployees()
        return ResponseEntity.ok(employees)
    }

    @GetMapping("/{id}")
    fun getEmployeeById(@PathVariable id: String): ResponseEntity<Employee> {
        val employee = employeeService.getEmployeeById(id)
        return ResponseEntity.ok(employee)
    }

    @PutMapping("/{id}")
    fun updateEmployee(@PathVariable id: String, @Valid @RequestBody dto: EmployeeDto): ResponseEntity<Employee> {
        val updatedDate = Employee(
            id,
            firstName = dto.firstName,
            lastName = dto.lastName,
            email = dto.email,
            salary = dto.salary,
            designation = dto.designation,
            departmentId = dto.departmentId,
            dateOfJoining = LocalDate.now(),
            nic = dto.nic
        )
        val updatedEmployee = employeeService.updateEmployee(id, updatedDate)
        return ResponseEntity.ok(updatedEmployee)
    }

    @DeleteMapping("/{id}")
    fun deleteEmployee(@PathVariable id: String): ResponseEntity<Void> {
        employeeService.deleteEmployee(id)
        return ResponseEntity.noContent().build()
    }
}