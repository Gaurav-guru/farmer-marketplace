package com.example.farmermarketplace.controller;

import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.BidStatus;
import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.CropStatus;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.repository.BidRepository;
import com.example.farmermarketplace.repository.CropRepository;
import com.example.farmermarketplace.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buyer")
public class BuyerController {

    private final CropRepository cropRepo;
    private final BidRepository bidRepo;

    public BuyerController(CropRepository cropRepo, BidRepository bidRepo) {
        this.cropRepo = cropRepo;
        this.bidRepo = bidRepo;
    }

    @GetMapping("/crops")
    public List<Crop> getAvailableCrops() {
        return cropRepo.findByStatus(CropStatus.valueOf("OPEN"));
    }

    @PostMapping("/bids/{cropId}")
    public Bid placeBid(@PathVariable Long cropId, @RequestBody Bid bid, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Crop crop = cropRepo.findById(cropId).orElseThrow();
        bid.setCrop(crop);
        bid.setBuyer(userDetails.getUser());
        bid.setBidStatus(BidStatus.valueOf("PENDING"));
        return bidRepo.save(bid);
    }

    @GetMapping("/bids")
    public List<Bid> myBids(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return bidRepo.findByBuyer(userDetails.getUser());
    }
}