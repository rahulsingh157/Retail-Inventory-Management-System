package com.abes.inventory.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.abes.inventory.entity.Product;
import com.abes.inventory.entity.StockMovement;
import com.abes.inventory.repository.ProductRepository;
import com.abes.inventory.repository.StockMovementRepository;

@Service
public class StockMovementService {

    @Autowired
    private StockMovementRepository repository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public StockMovement addMovement(StockMovement movement) {
        if (movement.getProduct() == null || movement.getProduct().getId() == null) {
            throw new IllegalArgumentException("Product selection is required");
        }

        if (movement.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Long productId = movement.getProduct().getId();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        String type = movement.getType() != null ? movement.getType().trim().toUpperCase() : "";

        if ("IN".equals(type)) {
            // Increase stock quantity
            product.setQuantity(product.getQuantity() + movement.getQuantity());
        } else if ("OUT".equals(type)) {
            // Check for insufficient stock
            if (product.getQuantity() < movement.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product '" + product.getName() +
                        "'. Available stock: " + product.getQuantity() + ", requested OUT: " + movement.getQuantity());
            }
            // Decrease stock quantity
            product.setQuantity(product.getQuantity() - movement.getQuantity());
        } else {
            throw new IllegalArgumentException("Invalid stock movement type: " + movement.getType() + ". Must be 'IN' or 'OUT'.");
        }

        if (movement.getMovementDate() == null) {
            movement.setMovementDate(LocalDateTime.now());
        }

        // Save updated product quantity
        productRepository.save(product);

        // Associate fully populated product entity to movement record
        movement.setProduct(product);

        // Persist stock movement record
        return repository.save(movement);
    }

    public List<StockMovement> getAllMovements() {
        return repository.findAll();
    }

    public StockMovement getMovement(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteMovement(Long id) {
        repository.deleteById(id);
    }
}