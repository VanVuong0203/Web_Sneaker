package com.kaisneaker.backend.repository;

import com.kaisneaker.backend.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BillRepository extends JpaRepository<Bill, UUID> {
    List<Bill> findByUser_IdAccount(UUID idAccount);

}