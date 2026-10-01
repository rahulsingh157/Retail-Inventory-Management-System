package com.abes.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.abes.inventory.entity.SalesOrder;
import com.abes.inventory.service.SalesOrderService;

@RestController
@RequestMapping("/orders")
public class SalesOrderController {

    @Autowired
    SalesOrderService service;

    @PostMapping
    public SalesOrder addOrder(@RequestBody SalesOrder order) {
        return service.addOrder(order);
    }

    @GetMapping
    public List<SalesOrder> getAllOrders() {
        return service.getAllOrders();
    }

    @GetMapping("/{id}")
    public SalesOrder getOrder(@PathVariable Long id) {
        return service.getOrder(id);
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        service.deleteOrder(id);
        return "Order deleted successfully";
    }
}