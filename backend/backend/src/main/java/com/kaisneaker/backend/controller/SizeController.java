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

import com.kaisneaker.backend.dto.SizeDTO;
import com.kaisneaker.backend.model.Size;
import com.kaisneaker.backend.service.SizeService;
import com.kaisneaker.backend.utils.common.ResultEntity;

@RestController
@CrossOrigin
@RequestMapping("/size")
public class SizeController {

    @Autowired
    private SizeService sizeService;

    @PostMapping("")
    public ResponseEntity<ResultEntity<SizeDTO>> createSize(@RequestBody SizeDTO sizeDTO) {
        sizeService.createSize(sizeDTO);
        return ResponseEntity.ok(ResultEntity.of("Tạo Size thành công", sizeDTO));
    }

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<Size>>> getAllSizes() {
        return ResponseEntity.ok(ResultEntity.of("Danh sách Size", sizeService.getAllSizes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<Size>> getSizeById(@PathVariable UUID id) {
        Size size = sizeService.getSizeById(id);
        return ResponseEntity.ok(ResultEntity.of("Lấy Size thành công", size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<Size>> updateSize(@PathVariable UUID id, @RequestBody SizeDTO sizeDTO) {
        return ResponseEntity.ok(ResultEntity.of("Cập nhật Size thành công", sizeService.updateSize(id, sizeDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteSlider(@PathVariable UUID id) {
        sizeService.deleteSize(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá Size thành công", "DELETED"));
    }
}
