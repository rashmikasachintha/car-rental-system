package com.carrental.dto;

import com.carrental.enums.CarStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarDTO {
    private Long id;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    private int year;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price per day must be positive")
    private BigDecimal pricePerDay;

    private String imageUrl;
    private String transmission;
    private int seats;
    private String contactNumber;
    private CarStatus status;
}
