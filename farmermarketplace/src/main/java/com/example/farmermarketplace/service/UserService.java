package com.example.farmermarketplace.service;

import com.example.farmermarketplace.model.Role;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        // Set default wallet balance to 0 for Farmer and Buyer
        if (user.getRole() == Role.FARMER || user.getRole() == Role.BUYER) {
            user.setWalletBalance(BigDecimal.ZERO);
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with id: " + id));
    }

    public void addMoney(Long userId, BigDecimal amount) {
        User user = getUserById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin does not have a wallet.");
        }
        user.setWalletBalance(user.getWalletBalance().add(amount));
        userRepository.save(user);
    }

    public boolean deductMoney(Long userId, BigDecimal amount) {
        User user = getUserById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin does not have a wallet.");
        }
        if (user.getWalletBalance().compareTo(amount) >= 0) {
            user.setWalletBalance(user.getWalletBalance().subtract(amount));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void transferMoney(Long fromUserId, Long toUserId, BigDecimal amount) {
        boolean success = deductMoney(fromUserId, amount);
        if (!success) {
            throw new RuntimeException("Insufficient balance in sender's wallet.");
        }
        addMoney(toUserId, amount);
    }
}