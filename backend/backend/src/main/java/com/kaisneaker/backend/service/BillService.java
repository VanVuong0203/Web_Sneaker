package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.BillDTO;
import com.kaisneaker.backend.dto.BillResponse;

public interface BillService {

    List<BillResponse> getAllBills();

    void deleteBill(UUID billId);

    BillResponse updateBillStatus(UUID billId, String status);

    void createBill(BillDTO bill);

    BillResponse getBillById(UUID id);

    List<BillResponse> getBillsByAccountId(UUID userId);

}
