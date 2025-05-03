package com.example.farmermarketplace.controller;

import com.example.farmermarketplace.exception.ResourceNotFoundException;
import com.example.farmermarketplace.exception.UnauthorizedException;
import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.BidStatus;
import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.CropStatus;
import com.example.farmermarketplace.model.Transaction;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.repository.BidRepository;
import com.example.farmermarketplace.repository.CropRepository;
import com.example.farmermarketplace.repository.TransactionRepository;
import com.example.farmermarketplace.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farmer")
public class FarmerController {

    private final CropRepository cropRepo;
    private final BidRepository bidRepo;
    private final TransactionRepository transactionRepo;

    
    public FarmerController(CropRepository cropRepo, BidRepository bidRepo, TransactionRepository transactionRepo) {
		super();
		this.cropRepo = cropRepo;
		this.bidRepo = bidRepo;
		this.transactionRepo = transactionRepo;
	}

    @PostMapping("/crops")
    public Crop addCrop(@RequestBody Crop crop, @AuthenticationPrincipal CustomUserDetails userDetails) {
        User farmer = userDetails.getUser();
        crop.setFarmer(farmer);
        crop.setCropStatus(CropStatus.valueOf("OPEN"));
        return cropRepo.save(crop);
    }

    @GetMapping("/crops")
    public List<Crop> getMyCrops(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return cropRepo.findByFarmer(userDetails.getUser());
    }

    @PutMapping("/crops/{id}")
    public Crop updateCrop(@PathVariable Long id, @RequestBody Crop updated, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Crop existing = cropRepo.findById(id).orElseThrow();
        if (!existing.getFarmer().getId().equals(userDetails.getUser().getId())) {
            throw new RuntimeException("Unauthorized update attempt!");
        }
        existing.setCropName(updated.getCropName());
        existing.setQuantity(updated.getQuantity());
        existing.setBasePrice(updated.getBasePrice());
        existing.setLocation(updated.getLocation());
        existing.setExpectedHarvestDate(updated.getExpectedHarvestDate());
        return cropRepo.save(existing);
    }
    @PostMapping("/accept-bid/{bidId}")
    public String acceptBid(@PathVariable Long bidId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Bid bid = bidRepo.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));

        Crop crop = bid.getCrop();

        if (!crop.getFarmer().getId().equals(userDetails.getUser().getId())) {
            throw new UnauthorizedException("You are not the owner of this crop");
        }

        
        List<Bid> allBids = bidRepo.findByCrop(crop);
        for (Bid b : allBids) {
            b.setBidStatus(b.getId().equals(bidId) ? BidStatus.valueOf("ACCEPTED") : BidStatus.valueOf("REJECTED"));
            bidRepo.save(b);
        }

        crop.setCropStatus(CropStatus.valueOf("SOLD"));
        cropRepo.save(crop);

    
        Transaction transaction = new Transaction();
        transaction.setAmount(bid.getBidAmount());
        transaction.setBuyer(bid.getBuyer());
        transaction.setFarmer(crop.getFarmer());
        transaction.setCrop(crop);
        transactionRepo.save(transaction);

        return "Bid accepted and transaction created successfully";
    }
}
