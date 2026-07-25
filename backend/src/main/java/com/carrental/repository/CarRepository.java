package com.carrental.repository;

import com.carrental.entity.Car;
import com.carrental.enums.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(CarStatus status);
    List<Car> findByCategoryIgnoreCase(String category);
}
