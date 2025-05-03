package com.example.farmermarketplace.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;

@Entity
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cropName;
    private Double quantity; // in kg
    private Double basePrice;
    private String location;
    private String expectedHarvestDate;

    @Enumerated(EnumType.STRING)
    private CropStatus status = CropStatus.OPEN; // OPEN, SOLD, CLOSED

    @ManyToOne
    @JoinColumn(name="farmer_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User farmer;

    // Constructors
    public Crop() {}

    public Crop(String cropName, Double quantity, Double basePrice, String location, String expectedHarvestDate, User farmer) {
        this.cropName = cropName;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.location = location;
        this.expectedHarvestDate = expectedHarvestDate;
        this.farmer = farmer;
        this.status = CropStatus.OPEN;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExpectedHarvestDate() {
        return expectedHarvestDate;
    }

    public void setExpectedHarvestDate(String expectedHarvestDate) {
        this.expectedHarvestDate = expectedHarvestDate;
    }

    public CropStatus getStatus() {
        return status;
    }

    public void setCropStatus(CropStatus status) {
        this.status = status;
    }

    public User getFarmer() {
        return farmer;
    }

    public void setFarmer(User farmer) {
        this.farmer = farmer;
    }
}