package com.example.farmermarketplace.service;

import com.example.farmermarketplace.model.Bid;
import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.repository.BidRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BidService {
    private final BidRepository bidRepo;

    public BidService(BidRepository bidRepo) {
        this.bidRepo = bidRepo;
    }

    public Bid placeBid(Bid bid) {
        return bidRepo.save(bid);
    }

    public List<Bid> getBidsForCrop(Crop crop) {
        return bidRepo.findByCrop(crop);
    }

    public Bid updateBid(Bid bid) {
        return bidRepo.save(bid);
    }
    public Bid getBidById(Long id) {
        Optional<Bid> optionalBid = bidRepo.findById(id);
        return optionalBid.orElseThrow(() -> new RuntimeException("Bid not found with id: " + id));
    }
}
