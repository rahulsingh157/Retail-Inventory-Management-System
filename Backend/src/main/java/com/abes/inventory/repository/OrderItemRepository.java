package com.abes.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abes.inventory.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}