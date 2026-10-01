package com.abes.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.abes.inventory.entity.OrderItem;
import com.abes.inventory.service.OrderItemService;

@RestController
@RequestMapping("/order-items")
public class OrderItemController {

    @Autowired
    OrderItemService service;

    @PostMapping
    public OrderItem addOrderItem(@RequestBody OrderItem item) {
        return service.addOrderItem(item);
    }

    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return service.getAllOrderItems();
    }

    @GetMapping("/{id}")
    public OrderItem getOrderItem(@PathVariable Long id) {
        return service.getOrderItem(id);
    }

    @DeleteMapping("/{id}")
    public String deleteOrderItem(@PathVariable Long id) {
        service.deleteOrderItem(id);
        return "Order item deleted successfully";
    }
}