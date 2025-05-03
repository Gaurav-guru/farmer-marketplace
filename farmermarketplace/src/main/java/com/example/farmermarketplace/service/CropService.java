package com.example.farmermarketplace.service;
import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.CropStatus;
import com.example.farmermarketplace.repository.BidRepository;
import com.example.farmermarketplace.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {
    private final CropRepository cropRepo;
    private final BidRepository bidRepo;

    public CropService(CropRepository cropRepo,  BidRepository bidRepo) {
        this.cropRepo = cropRepo;
		this.bidRepo = bidRepo;
    }

    public Crop addCrop(Crop crop) {
        return cropRepo.save(crop);
    }

    public List<Crop> getAllAvailableCrops() {
        return cropRepo.findByStatus(CropStatus.valueOf("OPEN"));
    }

    public Crop getCropById(Long id) {
        return cropRepo.findById(id).orElse(null);
    }

    public Crop updateCrop(Crop crop) {
        return cropRepo.save(crop);
    }
    public boolean deleteCrop(Long id) {
        if (cropRepo.existsById(id)) {
        	bidRepo.deleteByCropId(id);
            cropRepo.deleteById(id);
            return true;
        }
        return false;
    }
}