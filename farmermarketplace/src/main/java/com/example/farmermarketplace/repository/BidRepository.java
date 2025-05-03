package com.example.farmermarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.User;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByCrop(Crop crop);
    List<Bid> findByBuyer(User buyer);
    void deleteByCropId(Long cropId);
}
