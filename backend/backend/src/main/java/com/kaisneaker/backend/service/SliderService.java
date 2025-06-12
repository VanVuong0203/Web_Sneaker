package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.SliderDTO;
import com.kaisneaker.backend.model.Slider;

public interface SliderService {
    void createSlider(SliderDTO slider);

    List<Slider> getAllSliders();

    Slider getSliderById(UUID id);

    Slider updateSlider(UUID id, Slider slider);

    void deleteSlider(UUID id);
}
