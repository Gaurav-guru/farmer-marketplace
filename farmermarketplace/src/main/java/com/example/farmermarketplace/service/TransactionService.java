package com.example.farmermarketplace.service;

import com.example.farmermarketplace.model.DeliveryStatus;
import com.example.farmermarketplace.model.PaymentStatus;
import com.example.farmermarketplace.model.Transaction;
import com.example.farmermarketplace.repository.CropRepository;
import com.example.farmermarketplace.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service

public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CropRepository cropRepository;
    private final UserService userService;
    

    public TransactionService(TransactionRepository transactionRepository, CropRepository cropRepository,
			UserService userService) {
		super();
		this.transactionRepository = transactionRepository;
		this.cropRepository = cropRepository;
		this.userService = userService;
	}

	public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByFarmer(Long farmerId) {
        return transactionRepository.findByFarmerId(farmerId);
    }

    public List<Transaction> getTransactionsByBuyer(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId);
    }

    public List<Transaction> getTransactionsByFarmerEmail(String email) {
        return transactionRepository.findByFarmerEmail(email);
    }

    public List<Transaction> getTransactionsByBuyerEmail(String email) {
        return transactionRepository.findByBuyerEmail(email);
    }

    public Optional<Transaction> getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId);
    }

    public ResponseEntity<String> updatePaymentStatus(Long transactionId, PaymentStatus status) {
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        if (optionalTransaction.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found.");
        }

        Transaction transaction = optionalTransaction.get();

        if (status == PaymentStatus.PAID && transaction.getPaymentStatus() == PaymentStatus.PENDING) {
            BigDecimal amount = BigDecimal.valueOf(transaction.getAmount());
            try {
                userService.transferMoney(
                        transaction.getBuyer().getId(),
                        transaction.getFarmer().getId(),
                        amount
                );
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        transaction.setPaymentStatus(status);
        transactionRepository.save(transaction);
        return ResponseEntity.ok("Payment status updated successfully.");
    }

    public ResponseEntity<String> updateDeliveryStatus(Long transactionId, DeliveryStatus status) {
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        if (optionalTransaction.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found.");
        }

        Transaction transaction = optionalTransaction.get();
        transaction.setDeliveryStatus(status);
        transactionRepository.save(transaction);
        return ResponseEntity.ok("Delivery status updated successfully.");
    }
    public boolean markPaymentAsPaid(Long transactionId) {
        Optional<Transaction> optional = transactionRepository.findById(transactionId);
        if (optional.isPresent()) {
            Transaction tx = optional.get();
            tx.setPaymentStatus(PaymentStatus.PAID);
            transactionRepository.save(tx);
            return true;
        }
        return false;
    }
}