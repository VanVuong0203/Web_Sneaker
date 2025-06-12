package com.kaisneaker.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaisneaker.backend.dto.SliderDTO;
import com.kaisneaker.backend.model.Slider;
import com.kaisneaker.backend.repository.SliderRepository;
import com.kaisneaker.backend.service.SliderService;

@Service
public class SliderServiceImpl implements SliderService {

    @Autowired
    private SliderRepository sliderRepository;

    @Override
    public void createSlider(SliderDTO slider) {
        int currentMaxOrder = sliderRepository.findAll().size() + 1;
        int inputOrder = slider.getOrder();

        // Giới hạn giá trị order nếu vượt quá số lượng hiện có
        if (inputOrder < 1) {
            inputOrder = 1;
        } else if (inputOrder > currentMaxOrder) {
            inputOrder = currentMaxOrder;
        }

        slider.setOrder(inputOrder); // Cập nhật lại order đã điều chỉnh
        shiftOrders(inputOrder); // Dịch các slider hiện tại
        sliderRepository.save(mapToEntity(slider)); // Lưu slider mới
    }

    private Slider mapToEntity(SliderDTO dto) {
        Slider entity = Slider.builder()
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .slideOrder(dto.getOrder())
                .build();
        return entity;
    }

    @Override
    public List<Slider> getAllSliders() {
        return sliderRepository.findAllByOrderBySlideOrderAsc();
    }

    @Override
    public Slider getSliderById(UUID id) {
        Slider slider = sliderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy slider"));
        return slider;
    }

    @Override
    public Slider updateSlider(UUID id, Slider updatedSlider) {
        Slider slider = getSliderById(id);
        slider.setImageUrl(updatedSlider.getImageUrl());
        slider.setDescription(updatedSlider.getDescription());
        slider.setSlideOrder(updatedSlider.getSlideOrder());
        shiftOrders(slider.getSlideOrder());

        return sliderRepository.save(slider);
    }

    private void shiftOrders(int fromOrder) {
        List<Slider> slidersToShift = sliderRepository.findBySlideOrderGreaterThanEqualOrderBySlideOrderDesc(fromOrder);
        for (Slider s : slidersToShift) {
            s.setSlideOrder(s.getSlideOrder() + 1);
        }
        sliderRepository.saveAll(slidersToShift);
    }

    @Override
    public void deleteSlider(UUID id) {
        Slider sliderToDelete = getSliderById(id);

        if (sliderToDelete != null) {
            // Cập nhật lại order cho các slider còn lại
            shiftOrdersAfterDeletion();

            // Xóa slider
            sliderRepository.deleteById(id);
        }

    }

    private void shiftOrdersAfterDeletion() {
        // Lấy tất cả các slider
        List<Slider> sliders = sliderRepository.findAllByOrderBySlideOrderAsc();

        // Cập nhật lại order cho các slider còn lại, bắt đầu từ 1 đến n
        for (int i = 0; i < sliders.size(); i++) {
            Slider slider = sliders.get(i);
            slider.setSlideOrder(i + 1); // Đặt lại order cho slider
        }

        // Lưu các slider đã thay đổi order
        sliderRepository.saveAll(sliders);

    }
}
