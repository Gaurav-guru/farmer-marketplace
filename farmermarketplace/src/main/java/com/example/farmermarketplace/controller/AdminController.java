package com.example.farmermarketplace.controller;

import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.Transaction;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.repository.BidRepository;
import com.example.farmermarketplace.repository.TransactionRepository;
import com.example.farmermarketplace.repository.UserRepository;
import com.example.farmermarketplace.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepo;
    private final BidRepository bidRepo;
    private final TransactionRepository txnRepo;
    private final AdminService adminService;

    public AdminController(UserRepository userRepo, BidRepository bidRepo, TransactionRepository txnRepo, AdminService adminService) {
        this.userRepo = userRepo;
        this.bidRepo = bidRepo;
        this.txnRepo = txnRepo;
		this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUserById(id);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/bids")
    public List<Bid> getAllBids() {
        return bidRepo.findAll();
    }

    @DeleteMapping("/bids/{id}")
    public void deleteBid(@PathVariable Long id) {
        bidRepo.deleteById(id);
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return txnRepo.findAll();
    }

    @DeleteMapping("/transactions/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        txnRepo.deleteById(id);
    }
}
