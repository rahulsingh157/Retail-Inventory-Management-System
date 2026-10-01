package com.abes.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abes.inventory.entity.SalesOrder;
import com.abes.inventory.repository.SalesOrderRepository;

@Service
public class SalesOrderService {

    @Autowired
    SalesOrderRepository repository;

    public SalesOrder addOrder(SalesOrder order) {
        return repository.save(order);
    }

    public List<SalesOrder> getAllOrders() {
        return repository.findAll();
    }

    public SalesOrder getOrder(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteOrder(Long id) {
        repository.deleteById(id);
    }
}