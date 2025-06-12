package com.kaisneaker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.dto.AddressResponse;
import com.kaisneaker.backend.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
    @Query("""
                SELECT new com.kaisneaker.backend.dto.AddressResponse(
                    a.shoppingInfoId,
                    a.shoppingInfoName,
                    a.address,
                    a.shoppingInfoPhone,
                    a.user.idAccount
                )
                FROM Address a
                WHERE a.user.idAccount = :userId
            """)
    List<AddressResponse> findAddressResponsesByUserId(@Param("userId") UUID userId);
}
