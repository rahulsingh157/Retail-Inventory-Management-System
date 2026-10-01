package com.abes.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.abes.inventory.entity.Product;
import com.abes.inventory.service.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService service;

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.registerProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable long id) {
        return service.getProduct(id);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable long id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}