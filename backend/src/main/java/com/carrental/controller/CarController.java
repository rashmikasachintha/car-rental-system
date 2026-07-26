package com.carrental.controller;

import com.carrental.dto.CarDTO;
import com.carrental.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @PostMapping
    public ResponseEntity<CarDTO> addCar(@Valid @RequestBody CarDTO carDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.addCar(carDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> updateCar(@PathVariable Long id, @Valid @RequestBody CarDTO carDTO) {
        return ResponseEntity.ok(carService.updateCar(id, carDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCar(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @GetMapping("/available")
    public ResponseEntity<List<CarDTO>> getAvailableCars() {
        return ResponseEntity.ok(carService.getAvailableCars());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<CarDTO>> getCarsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(carService.getCarsByCategory(category));
    }
}
