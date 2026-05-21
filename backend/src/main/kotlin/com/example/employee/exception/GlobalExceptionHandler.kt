package com.example.employee.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException::class)
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity <Map<String, String>> {
        val errormsg = mapOf("error" to (ex.message?: "not found"))
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errormsg)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, String>> {
        val errormsg = mutableMapOf<String, String>()
        ex.bindingResult.fieldErrors.forEach { error ->
            errormsg[error.field] = error.defaultMessage ?: "Invalid value"
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errormsg)
    }
}