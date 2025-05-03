package com.example.farmermarketplace.controller;


import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.service.BidService;
import com.example.farmermarketplace.service.CropService;
import com.example.farmermarketplace.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
public class BidController {
    private final BidService bidService;
    private final CropService cropService;
    private final UserService userService;

    public BidController(BidService bidService, CropService cropService, UserService userService) {
        this.bidService = bidService;
        this.cropService = cropService;
        this.userService = userService;
    }

    @PostMapping("/place/{cropId}/{buyerId}")
    public Bid placeBid(@RequestBody Bid bid, @PathVariable Long cropId, @PathVariable Long buyerId) {
        Crop crop = cropService.getCropById(cropId);
        User buyer = userService.getUserById(buyerId);
        bid.setCrop(crop);
        bid.setBuyer(buyer);
        return bidService.placeBid(bid);
    }

    @GetMapping("/crop/{cropId}")
    public List<Bid> getBidsForCrop(@PathVariable Long cropId) {
        Crop crop = cropService.getCropById(cropId);
        return bidService.getBidsForCrop(crop);
    }

    @PutMapping("/update")
    public Bid updateBid(@RequestBody Bid bid) {
        return bidService.updateBid(bid);
    }
}