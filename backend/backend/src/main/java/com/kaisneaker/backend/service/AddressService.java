package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.AddressDTO;
import com.kaisneaker.backend.dto.AddressResponse;
import com.kaisneaker.backend.model.Address;

public interface AddressService {
    Address createAddress(AddressDTO address);

    Address updateAddress(UUID id, AddressDTO address);

    void deleteAddress(UUID id);

    Address getAddressById(UUID id);

    List<AddressResponse> getAddressesByUserId(UUID userId);
}
