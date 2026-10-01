package com.abes.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abes.inventory.entity.SalesOrder;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

}