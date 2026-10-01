package com.abes.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abes.inventory.entity.Category;
import com.abes.inventory.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository repository;

    public Category registerCategory(Category obj) {
        return repository.save(obj);
    }

    public List<Category> getAllCategories() {
        return repository.findAll();
    }

    public Category getCategory(long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteCategory(long id) {
        repository.deleteById(id);
    }
}