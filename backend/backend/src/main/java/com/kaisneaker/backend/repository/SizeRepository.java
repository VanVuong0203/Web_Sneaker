package com.kaisneaker.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.model.Size;

@Repository
public interface SizeRepository extends JpaRepository<Size, UUID> {

}
