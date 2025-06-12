package com.kaisneaker.backend.controller;

import com.kaisneaker.backend.dto.AddressDTO;
import com.kaisneaker.backend.dto.AddressResponse;
import com.kaisneaker.backend.model.Address;
import com.kaisneaker.backend.service.AddressService;
import com.kaisneaker.backend.utils.common.ResultEntity;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/shippinginfo")
@CrossOrigin
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("")
    public ResponseEntity<ResultEntity<AddressDTO>> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
        addressService.createAddress(addressDTO);
        return ResponseEntity.ok(ResultEntity.of("Tạo địa chỉ thành công", addressDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<Address>> updateAddress(@PathVariable UUID id,
            @Valid @RequestBody AddressDTO addressDTO) {
        Address address = addressService.updateAddress(id, addressDTO);
        return ResponseEntity.ok(ResultEntity.of("Cập nhật địa chỉ thành công", address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteAddress(@PathVariable UUID id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá địa chỉ thành công", "DELETED"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<Address>> getAddressById(@PathVariable UUID id) {
        Address address = addressService.getAddressById(id);
        return ResponseEntity.ok(ResultEntity.of("Lấy địa chỉ thành công", address));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResultEntity<List<AddressResponse>>> getAddressesByUserId(@PathVariable UUID userId) {
        List<AddressResponse> listAddresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(ResultEntity.of("Lấy danh sách địa chỉ thành công", listAddresses));
    }
}
