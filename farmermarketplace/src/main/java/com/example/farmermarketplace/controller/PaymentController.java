package com.example.farmermarketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.farmermarketplace.service.TransactionService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
        @RequestParam String razorpayPaymentId,
        @RequestParam Long transactionId
    ) {
        boolean updated = transactionService.markPaymentAsPaid(transactionId);
        if (updated) {
            return ResponseEntity.ok("Payment marked as PAID");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Transaction not found");
        }
    }
}
