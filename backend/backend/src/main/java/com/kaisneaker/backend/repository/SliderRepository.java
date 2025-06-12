package com.kaisneaker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.model.Slider;

@Repository
public interface SliderRepository extends JpaRepository<Slider, UUID> {
    // Sắp xếp tăng dần theo slideOrder
    List<Slider> findAllByOrderBySlideOrderAsc();

    // Tìm các slide có slideOrder >= tham số, rồi sắp xếp giảm dần
    List<Slider> findBySlideOrderGreaterThanEqualOrderBySlideOrderDesc(int slideOrder);

    // Tìm các slide có slideOrder > tham số, rồi sắp xếp tăng dần
    List<Slider> findBySlideOrderGreaterThanOrderBySlideOrderAsc(int slideOrder);

}
