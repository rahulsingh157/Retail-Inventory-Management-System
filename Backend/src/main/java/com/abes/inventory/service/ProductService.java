package com.abes.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abes.inventory.entity.Product;
import com.abes.inventory.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    ProductRepository repository;

    public Product registerProduct(Product obj) {
        return repository.save(obj);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product getProduct(long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteProduct(long id) {
        repository.deleteById(id);
    }
}