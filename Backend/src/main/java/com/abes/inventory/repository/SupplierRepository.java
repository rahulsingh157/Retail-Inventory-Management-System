package com.abes.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.abes.inventory.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}