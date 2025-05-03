package com.example.farmermarketplace.controller;

import com.example.farmermarketplace.model.Crop;
import com.example.farmermarketplace.model.User;
import com.example.farmermarketplace.service.CropService;
import com.example.farmermarketplace.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {
    private final CropService cropService;
    private final UserService userService;

    public CropController(CropService cropService, UserService userService) {
        this.cropService = cropService;
        this.userService = userService;
    }

    @PostMapping("/add/{farmerId}")
    public Crop addCrop(@RequestBody Crop crop, @PathVariable Long farmerId) {
        User farmer = userService.getUserById(farmerId);
        crop.setFarmer(farmer);
        return cropService.addCrop(crop);
    }

    @GetMapping
    public List<Crop> getAvailableCrops() {
        return cropService.getAllAvailableCrops();
    }

    @GetMapping("/{id}")
    public Crop getCrop(@PathVariable Long id) {
        return cropService.getCropById(id);
    }
    
    @DeleteMapping("/{id}")
    	public boolean deleteCrop(@PathVariable Long id) {
    	return cropService.deleteCrop(id);
	}
}