package com.kaisneaker.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaisneaker.backend.dto.BillDTO;
import com.kaisneaker.backend.dto.BillResponse;
import com.kaisneaker.backend.service.BillService;
import com.kaisneaker.backend.utils.common.ResultEntity;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/bill")
@CrossOrigin
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<BillResponse>> getBillById(@PathVariable UUID id) {
        return ResponseEntity
                .ok(ResultEntity.of("Lấy hóa đơn với ID " + id + "thành công", billService.getBillById(id)));
    }

    @PostMapping
    public ResponseEntity<ResultEntity<BillDTO>> createBill(@RequestBody BillDTO bill) {

        billService.createBill(bill);
        return ResponseEntity.ok(ResultEntity.of("Tạo hóa đơn thành công", bill));
    }

    @GetMapping("/account/{idAccount}")
    public ResponseEntity<ResultEntity<List<BillResponse>>> getBillsByAccount(@PathVariable UUID idAccount) {
        List<BillResponse> bills = billService.getBillsByAccountId(idAccount);
        return ResponseEntity.ok(ResultEntity.of("Lấy hóa đơn theo Account thành công", bills));
    }

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<BillResponse>>> getAllBills() {
        List<BillResponse> bills = billService.getAllBills();

        return ResponseEntity.ok(ResultEntity.of("Lấy tất cả hóa đơn thành công", bills));
    }

    @DeleteMapping("/{billId}")
    public ResponseEntity<ResultEntity<String>> deleteBill(@PathVariable UUID billId) {
        billService.deleteBill(billId);
        return ResponseEntity.ok(ResultEntity.of("Xóa hóa đơn thành công", "DELETED"));
    }

    @PutMapping("/{billId}/status")
    public ResponseEntity<ResultEntity<BillResponse>> updateBillStatus(@PathVariable UUID billId,
            @RequestParam String status) {
        BillResponse result = billService.updateBillStatus(billId, status);
        return ResponseEntity.ok(ResultEntity.of("Cập nhật trạng thái hóa đơn thành công", result));
    }

}
