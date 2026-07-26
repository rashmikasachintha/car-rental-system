package com.carrental.entity;

import com.carrental.enums.CarStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Car extends BaseEntity {

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    private int year;

    @Column(nullable = false)
    private String category; // e.g. SUV, Sedan, Hatchback

    @Column(nullable = false)
    private BigDecimal pricePerDay;

    @Column(length = 1000)
    private String imageUrl;

    private String transmission; // Automatic / Manual

    private int seats;

    // Rental contact number for this car/listing, e.g. "0774444444"
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarStatus status;
}
