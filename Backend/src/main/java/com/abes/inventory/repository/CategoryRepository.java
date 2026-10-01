package com.abes.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abes.inventory.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}