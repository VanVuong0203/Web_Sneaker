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

import com.kaisneaker.backend.dto.SliderDTO;
import com.kaisneaker.backend.model.Slider;
import com.kaisneaker.backend.service.SliderService;
import com.kaisneaker.backend.utils.common.ResultEntity;

@RestController
@CrossOrigin
@RequestMapping("/slider")
public class SliderController {

    @Autowired
    private SliderService sliderService;

    @PostMapping("")
    public ResponseEntity<ResultEntity<SliderDTO>> createSlider(@RequestBody SliderDTO slider) {
        sliderService.createSlider(slider);
        return ResponseEntity.ok(ResultEntity.of("Tạo slider thành công", slider));
    }

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<Slider>>> getAllSliders() {
        return ResponseEntity.ok(ResultEntity.of("Danh sách sliders", sliderService.getAllSliders()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<Slider>> getSliderById(@PathVariable UUID id) {
        Slider slider = sliderService.getSliderById(id);
        return ResponseEntity.ok(ResultEntity.of("Lấy slider thành công", slider));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<Slider>> updateSlider(@PathVariable UUID id, @RequestBody Slider slider) {
        return ResponseEntity.ok(ResultEntity.of("Cập nhật slider thành công", sliderService.updateSlider(id, slider)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteSlider(@PathVariable UUID id) {
        sliderService.deleteSlider(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá slider thành công", "DELETED"));
    }
}
