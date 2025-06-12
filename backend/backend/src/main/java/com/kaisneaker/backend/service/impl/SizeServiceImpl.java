package com.kaisneaker.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaisneaker.backend.dto.SizeDTO;
import com.kaisneaker.backend.model.Size;
import com.kaisneaker.backend.repository.SizeRepository;
import com.kaisneaker.backend.service.SizeService;

@Service
public class SizeServiceImpl implements SizeService {

    @Autowired
    private SizeRepository sizeRepository;

    @Override
    public void createSize(SizeDTO size) {
        sizeRepository.save(mapToEntity(size));

    }

    private Size mapToEntity(SizeDTO dto) {
        Size entity = Size.builder()
                .sizeVi(dto.getSizeVi())
                .sizeEur(dto.getSizeEur())
                .build();
        return entity;
    }

    @Override
    public List<Size> getAllSizes() {
        return sizeRepository.findAll();

    }

    @Override
    public Size getSizeById(UUID idSize) {
        Size size = sizeRepository.findById(idSize)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy size"));
        return size;
    }

    @Override
    public Size updateSize(UUID idSize, SizeDTO updatedSize) {
        Size size = getSizeById(idSize);
        size.setSizeVi(updatedSize.getSizeVi());
        size.setSizeEur(updatedSize.getSizeEur());
        return sizeRepository.save(size);
    }

    @Override
    public void deleteSize(UUID idSize) {
        if (sizeRepository.existsById(idSize)) {
            sizeRepository.deleteById(idSize);
        }
    }

}
