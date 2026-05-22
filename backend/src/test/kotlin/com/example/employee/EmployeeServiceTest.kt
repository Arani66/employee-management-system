package com.example.employee

import com.example.employee.model.Employee
import com.example.employee.repository.EmployeeRepository
import com.example.employee.service.EmployeeService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.mock
import org.mockito.Mockito.never
import org.mockito.Mockito.times
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import java.time.LocalDate
import java.util.Optional
import kotlin.test.assertEquals

class EmployeeServiceTest {

    private lateinit var employeeRepository: EmployeeRepository
    private lateinit var employeeService: EmployeeService

    private val sampleEmployee = Employee(
        employeeId = "emp001",
        firstName = "Jane",
        lastName = "Doe",
        email = "jane.doe@company.com",
        nic = "901234567V",
        designation = "Software Engineer",
        departmentId = "ENG",
        salary = 85000.0,
        dateOfJoining = LocalDate.of(2020, 1, 15)
    )

    @BeforeEach
    fun setup() {
        // Runs before every single test — creates fresh mocks each time
        employeeRepository = mock(EmployeeRepository::class.java)
        employeeService = EmployeeService(employeeRepository)
    }



    @Test
    fun `addEmployee should save and return the employee`() {
        `when`(employeeRepository.save(sampleEmployee)).thenReturn(sampleEmployee)

        val result = employeeService.addEmployee(sampleEmployee)

        assertEquals("Jane", result.firstName)
        assertEquals("jane.doe@company.com", result.email)

        verify(employeeRepository, times(1)).save(sampleEmployee)
    }


    @Test
    fun `getAllEmployees should return a page of employees when search is blank`() {
        val pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending())
        val employeePage = PageImpl(listOf(sampleEmployee), pageable, 1)

        `when`(employeeRepository.findBySearchTerm("", pageable))
            .thenReturn(employeePage)

        val result = employeeService.getAllEmployees(0, 10, "")

        assertEquals(1, result.totalElements)
        assertEquals("Jane", result.content[0].firstName)
    }

    @Test
    fun `getAllEmployees should filter results when search term is provided`() {
        val pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending())
        val employeePage = PageImpl(listOf(sampleEmployee), pageable, 1)

        `when`(employeeRepository.findBySearchTerm("jane", pageable))
            .thenReturn(employeePage)

        val result = employeeService.getAllEmployees(0, 10, "jane")

        assertEquals(1, result.totalElements)
        assertEquals("Jane", result.content[0].firstName)
    }


    @Test
    fun `getEmployeeById should return employee when found`() {
        `when`(employeeRepository.findById("emp001"))
            .thenReturn(Optional.of(sampleEmployee))

        val result = employeeService.getEmployeeById("emp001")

        assertEquals("emp001", result.employeeId)
        assertEquals("Doe", result.lastName)
    }

    @Test
    fun `getEmployeeById should throw RuntimeException when employee does not exist`() {
        `when`(employeeRepository.findById("bad-id"))
            .thenReturn(Optional.empty())

        val exception = assertThrows<RuntimeException> {
            employeeService.getEmployeeById("bad-id")
        }

        assertEquals("Employee with ID bad-id not found", exception.message)
    }


    @Test
    fun `updateEmployee should preserve the original dateOfJoining`() {
        val updatedEmployee = sampleEmployee.copy(
            firstName = "Janet",
            dateOfJoining = LocalDate.now() // this should be overwritten
        )

        `when`(employeeRepository.findById("emp001"))
            .thenReturn(Optional.of(sampleEmployee))
        `when`(employeeRepository.save(any(Employee::class.java)))
            .thenAnswer { it.arguments[0] as Employee }

        val result = employeeService.updateEmployee("emp001", updatedEmployee)

        assertEquals("Janet", result.firstName)
        assertEquals(LocalDate.of(2020, 1, 15), result.dateOfJoining)
    }

    @Test
    fun `updateEmployee should throw RuntimeException when employee does not exist`() {
        `when`(employeeRepository.findById("bad-id"))
            .thenReturn(Optional.empty())

        assertThrows<RuntimeException> {
            employeeService.updateEmployee("bad-id", sampleEmployee)
        }

        verify(employeeRepository, never()).save(any())
    }


    @Test
    fun `deleteEmployee should call deleteById when employee exists`() {
        `when`(employeeRepository.existsById("emp001")).thenReturn(true)

        employeeService.deleteEmployee("emp001")

        verify(employeeRepository, times(1)).deleteById("emp001")
    }

    @Test
    fun `deleteEmployee should throw RuntimeException when employee does not exist`() {
        `when`(employeeRepository.existsById("bad-id")).thenReturn(false)

        val exception = assertThrows<RuntimeException> {
            employeeService.deleteEmployee("bad-id")
        }

        assertEquals("Employee with ID bad-id not found", exception.message)
        verify(employeeRepository, never()).deleteById(any())
    }
}