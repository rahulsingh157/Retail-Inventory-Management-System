package com.abes.inventory.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.abes.inventory.entity.StockMovement;
import com.abes.inventory.service.StockMovementService;

@RestController
@RequestMapping("/stock-movements")
public class StockMovementController {

    @Autowired
    StockMovementService service;

    @PostMapping
    public ResponseEntity<?> addMovement(@RequestBody StockMovement movement) {
        try {
            StockMovement savedMovement = service.addMovement(movement);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMovement);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error processing stock movement: " + e.getMessage()));
        }
    }

    @GetMapping
    public List<StockMovement> getAllMovements() {
        return service.getAllMovements();
    }

    @GetMapping("/{id}")
    public StockMovement getMovement(@PathVariable Long id) {
        return service.getMovement(id);
    }

    @DeleteMapping("/{id}")
    public String deleteMovement(@PathVariable Long id) {
        service.deleteMovement(id);
        return "Stock movement deleted successfully";
    }
}