package com.example.farmermarketplace.repository;

import com.example.farmermarketplace.model.Transaction;
import com.example.farmermarketplace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFarmer(User farmer);
    List<Transaction> findByBuyer(User buyer);
    List<Transaction> findByBuyerOrFarmer(User buyer, User farmer);
    List<Transaction> findByFarmerEmail(String email);
    List<Transaction> findByBuyerEmail(String email);
    List<Transaction> findByFarmerId(Long farmerId);
    List<Transaction> findByBuyerId(Long buyerId);
    
}