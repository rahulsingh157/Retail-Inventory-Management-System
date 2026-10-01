package com.abes.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abes.inventory.entity.OrderItem;
import com.abes.inventory.repository.OrderItemRepository;

@Service
public class OrderItemService {

    @Autowired
    OrderItemRepository repository;

    public OrderItem addOrderItem(OrderItem item) {
        return repository.save(item);
    }

    public List<OrderItem> getAllOrderItems() {
        return repository.findAll();
    }

    public OrderItem getOrderItem(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteOrderItem(Long id) {
        repository.deleteById(id);
    }
}