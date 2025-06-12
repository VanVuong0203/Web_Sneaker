package com.kaisneaker.backend.service.impl;

import com.kaisneaker.backend.dto.AddressDTO;
import com.kaisneaker.backend.dto.AddressResponse;
import com.kaisneaker.backend.model.Address;
import com.kaisneaker.backend.model.User;
import com.kaisneaker.backend.repository.AddressRepository;
import com.kaisneaker.backend.repository.UserRepository;
import com.kaisneaker.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Address createAddress(AddressDTO address) {
        return addressRepository.save(mapToEntity(address));
    }

    private Address mapToEntity(AddressDTO dto) {
        User user = userRepository.findById(dto.getIdAccount())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + dto.getIdAccount()));

        return Address.builder()
                .address(dto.getAddress())
                .shoppingInfoName(dto.getShoppingInfoName())
                .shoppingInfoPhone(dto.getShoppingInfoPhone())
                .user(user)
                .build();
    }

    @Override
    public Address updateAddress(UUID id, AddressDTO address) {
        Address existingAddress = getAddressById(id);
        existingAddress.setShoppingInfoName(address.getShoppingInfoName());
        existingAddress.setAddress(address.getAddress());
        existingAddress.setShoppingInfoPhone(address.getShoppingInfoPhone());
        return addressRepository.save(existingAddress);
    }

    @Override
    public void deleteAddress(UUID id) {
        addressRepository.deleteById(id);
    }

    @Override
    public Address getAddressById(UUID id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id " + id));
    }

    @Override
    public List<AddressResponse> getAddressesByUserId(UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        return addressRepository.findAddressResponsesByUserId(userId);
    }
}
