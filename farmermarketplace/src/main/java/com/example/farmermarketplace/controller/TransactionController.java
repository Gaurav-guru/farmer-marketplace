package com.example.farmermarketplace.controller;

import com.example.farmermarketplace.model.Transaction;
import com.example.farmermarketplace.model.DeliveryStatus;
import com.example.farmermarketplace.model.PaymentStatus;
import com.example.farmermarketplace.service.RazorpayService;
import com.example.farmermarketplace.service.TransactionService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")

public class TransactionController {

    private final TransactionService transactionService;
    private final RazorpayService razorpayService;
    

    public TransactionController(TransactionService transactionService, RazorpayService razorpayService) {
		super();
		this.transactionService = transactionService;
		this.razorpayService = razorpayService;
	}

	@GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<Transaction>> getTransactionsByAuthenticatedFarmer(Authentication authentication) {
        String farmerEmail = authentication.getName();
        return ResponseEntity.ok(transactionService.getTransactionsByFarmerEmail(farmerEmail));
    }

    @GetMapping("/buyer")
    public ResponseEntity<List<Transaction>> getTransactionsByAuthenticatedBuyer(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.getTransactionsByBuyerEmail(email));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Transaction>> getTransactionsByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(transactionService.getTransactionsByFarmer(farmerId));
    }

    @PutMapping("/{transactionId}/payment-status")
    public ResponseEntity<String> updatePaymentStatus(@PathVariable Long transactionId,
                                                      @RequestParam PaymentStatus status) {
        return transactionService.updatePaymentStatus(transactionId, status);
    }

    @PutMapping("/{transactionId}/delivery-status")
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long transactionId,
                                                       @RequestParam DeliveryStatus status) {
        return transactionService.updateDeliveryStatus(transactionId, status);
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<Transaction>> getTransactionsByBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(transactionService.getTransactionsByBuyer(buyerId));
    }

    @PostMapping("/razorpay/create-order/{transactionId}")
    public ResponseEntity<?> createRazorpayOrder(@PathVariable Long transactionId) {
        try {
            Optional<Transaction> transactionOpt = transactionService.getTransactionById(transactionId);
            if (transactionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Transaction not found");
            }

            Transaction tx = transactionOpt.get();
            int amountInPaise = (int) (tx.getAmount() * 100); // Convert to paise
            
            Order razorOrder = razorpayService.createOrder(amountInPaise, "txn_" + tx.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", razorOrder.get("id"));
            response.put("amount", razorOrder.get("amount"));
            response.put("currency", razorOrder.get("currency"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating Razorpay order: " + e.getMessage());
        }
    }

  
}