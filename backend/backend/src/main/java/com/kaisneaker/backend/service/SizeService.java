package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.SizeDTO;
import com.kaisneaker.backend.model.Size;

public interface SizeService {
    void createSize(SizeDTO size);

    List<Size> getAllSizes();

    Size getSizeById(UUID idSize);

    Size updateSize(UUID idSize, SizeDTO updatedSize);

    void deleteSize(UUID idSize);
}
