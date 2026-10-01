package com.abes.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abes.inventory.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}