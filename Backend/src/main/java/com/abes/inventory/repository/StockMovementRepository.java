package com.abes.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abes.inventory.entity.StockMovement;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

}