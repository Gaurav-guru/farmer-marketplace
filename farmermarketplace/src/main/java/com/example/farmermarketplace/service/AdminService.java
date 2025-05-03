package com.example.farmermarketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.Transaction;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.repository.BidRepository;
import com.example.farmermarketplace.repository.TransactionRepository;
import com.example.farmermarketplace.repository.UserRepository;
@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public void deleteUserById(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            List<Transaction> relatedTransactions = transactionRepository.findByBuyerOrFarmer(user, user);
            transactionRepository.deleteAll(relatedTransactions);

            List<Bid> relatedBids = bidRepository.findByBuyer(user);
            bidRepository.deleteAll(relatedBids);

            userRepository.deleteById(userId);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }
}