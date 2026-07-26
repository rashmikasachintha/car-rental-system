package com.carrental.service.impl;

import com.carrental.dto.CarDTO;
import com.carrental.entity.Car;
import com.carrental.enums.CarStatus;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarRepository;
import com.carrental.service.CarService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final ModelMapper modelMapper;

    @Override
    public CarDTO addCar(CarDTO carDTO) {
        Car car = modelMapper.map(carDTO, Car.class);
        car.setId(null);
        if (car.getStatus() == null) {
            car.setStatus(CarStatus.AVAILABLE);
        }
        Car saved = carRepository.save(car);
        return modelMapper.map(saved, CarDTO.class);
    }

    @Override
    public CarDTO updateCar(Long id, CarDTO carDTO) {
        Car existing = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id " + id));

        existing.setBrand(carDTO.getBrand());
        existing.setModel(carDTO.getModel());
        existing.setYear(carDTO.getYear());
        existing.setCategory(carDTO.getCategory());
        existing.setPricePerDay(carDTO.getPricePerDay());
        existing.setImageUrl(carDTO.getImageUrl());
        existing.setTransmission(carDTO.getTransmission());
        existing.setSeats(carDTO.getSeats());
        existing.setContactNumber(carDTO.getContactNumber());
        if (carDTO.getStatus() != null) {
            existing.setStatus(carDTO.getStatus());
        }

        Car updated = carRepository.save(existing);
        return modelMapper.map(updated, CarDTO.class);
    }

    @Override
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Car not found with id " + id);
        }
        carRepository.deleteById(id);
    }

    @Override
    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id " + id));
        return modelMapper.map(car, CarDTO.class);
    }

    @Override
    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(car -> modelMapper.map(car, CarDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CarDTO> getAvailableCars() {
        return carRepository.findByStatus(CarStatus.AVAILABLE).stream()
                .map(car -> modelMapper.map(car, CarDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CarDTO> getCarsByCategory(String category) {
        return carRepository.findByCategoryIgnoreCase(category).stream()
                .map(car -> modelMapper.map(car, CarDTO.class))
                .collect(Collectors.toList());
    }
}
