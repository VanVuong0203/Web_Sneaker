package com.kaisneaker.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaisneaker.backend.dto.BrandDTO;
import com.kaisneaker.backend.model.Brand;
import com.kaisneaker.backend.service.BrandService;
import com.kaisneaker.backend.utils.common.ResultEntity;

@RestController
@CrossOrigin
@RequestMapping("/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;

    @PostMapping("")
    public ResponseEntity<ResultEntity<BrandDTO>> createSize(@RequestBody BrandDTO brandDTO) {
        brandService.createBrand(brandDTO);
        return ResponseEntity.ok(ResultEntity.of("Tạo Brand thành công", brandDTO));
    }

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<Brand>>> getAllSizes() {
        return ResponseEntity.ok(ResultEntity.of("Danh sách Brand", brandService.getAllBrands()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<Brand>> getSizeById(@PathVariable UUID id) {
        Brand brand = brandService.getBrandById(id);
        return ResponseEntity.ok(ResultEntity.of("Lấy Brand thành công", brand));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<Brand>> updateSize(@PathVariable UUID id, @RequestBody BrandDTO brandDTO) {
        return ResponseEntity.ok(ResultEntity.of("Cập nhật Brand thành công", brandService.updateBrand(id, brandDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteSlider(@PathVariable UUID id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá Brand thành công", "DELETED"));
    }
}
