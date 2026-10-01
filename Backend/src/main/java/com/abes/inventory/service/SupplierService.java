package com.abes.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abes.inventory.entity.Supplier;
import com.abes.inventory.repository.SupplierRepository;

@Service
public class SupplierService {

    @Autowired
    SupplierRepository repository;

    public Supplier addSupplier(Supplier supplier) {
        return repository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public Supplier getSupplier(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteSupplier(Long id) {
        repository.deleteById(id);
    }
}