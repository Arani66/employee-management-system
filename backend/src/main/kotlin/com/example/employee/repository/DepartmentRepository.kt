package com.example.employee.repository

import com.example.employee.model.Department
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface DepartmentRepository : MongoRepository<Department, String>