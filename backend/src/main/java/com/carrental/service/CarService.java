package com.carrental.service;

import com.carrental.dto.CarDTO;

import java.util.List;

public interface CarService {
    CarDTO addCar(CarDTO carDTO);
    CarDTO updateCar(Long id, CarDTO carDTO);
    void deleteCar(Long id);
    CarDTO getCarById(Long id);
    List<CarDTO> getAllCars();
    List<CarDTO> getAvailableCars();
    List<CarDTO> getCarsByCategory(String category);
}
