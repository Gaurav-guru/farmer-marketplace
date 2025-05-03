package com.example.farmermarketplace.repository;

import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.CropStatus;
import com.example.farmermarketplace.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFarmer(User farmer);
    List<Crop> findByStatus(CropStatus status); // for buyers
}
