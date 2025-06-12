package com.kaisneaker.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaisneaker.backend.dto.AddressResponse;
import com.kaisneaker.backend.dto.BillDTO;
import com.kaisneaker.backend.dto.BillDetailDTO;
import com.kaisneaker.backend.dto.BillResponse;
import com.kaisneaker.backend.model.Address;
import com.kaisneaker.backend.model.Bill;
import com.kaisneaker.backend.model.BillDetail;
import com.kaisneaker.backend.model.CartItem;
import com.kaisneaker.backend.model.Stock;
import com.kaisneaker.backend.model.User;
import com.kaisneaker.backend.repository.AddressRepository;
import com.kaisneaker.backend.repository.BillRepository;
import com.kaisneaker.backend.repository.CartItemRepository;
import com.kaisneaker.backend.repository.StockRepository;
import com.kaisneaker.backend.repository.UserRepository;
import com.kaisneaker.backend.service.BillService;
import com.kaisneaker.backend.utils.exceptions.NotFoundException;

@Service
public class BillServiceImpl implements BillService {

        @Autowired
        private BillRepository billRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AddressRepository addressRepository;

        @Autowired
        private CartItemRepository cartItemRepository;

        @Autowired
        private StockRepository stockRepository;

        @Override
        @Transactional
        public void createBill(BillDTO billDTO) {
                User user = userRepository.findById(billDTO.getIdAccount())
                                .orElseThrow(() -> new NotFoundException("User not found"));

                Address address = addressRepository.findById(billDTO.getShoppingInfoId())
                                .orElseThrow(() -> new NotFoundException("Address not found"));

                List<CartItem> cartItems = cartItemRepository.findByUserIdAccount(billDTO.getIdAccount());

                if (cartItems.isEmpty()) {
                        throw new NotFoundException("Không có sản phẩm trong giỏ hàng");
                }

                // Kiểm tra và trừ số lượng sản phẩm trong kho
                for (CartItem cartItem : cartItems) {
                        Stock stock = stockRepository.findByProductAndSize(cartItem.getProduct(), cartItem.getSize())
                                        .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm trong kho"));

                        if (stock.getQuantityInStock() < cartItem.getQuantity()) {
                                throw new NotFoundException("Số lượng sản phẩm trong kho không đủ");
                        }

                        // Trừ số lượng trong kho
                        stock.setQuantityInStock(stock.getQuantityInStock() - cartItem.getQuantity());
                        stockRepository.save(stock);
                }

                Bill bill = Bill.builder()
                                .user(user)
                                .shippingAddress(address)
                                .totalAmount(billDTO.getTotalAmount())
                                .billDate(LocalDateTime.now())
                                .status("Đang giao hàng")
                                .build();

                List<BillDetail> billDetails = convertCartItemsToBillDetails(cartItems, bill);
                bill.setBillDetails(billDetails);

                billRepository.save(bill);
                // Xóa cart items sau khi tạo bill
                cartItemRepository.deleteAll(cartItems);
        }

        private List<BillDetail> convertCartItemsToBillDetails(List<CartItem> cartItems, Bill bill) {

                return cartItems.stream().map(item -> BillDetail.builder()
                                .bill(bill)
                                .product(item.getProduct())
                                .size(item.getSize())
                                .quantity(item.getQuantity())
                                .totalPrice(item.getProduct().getShoesPrice().multiply(
                                                BigDecimal.valueOf(item.getQuantity())))
                                .build()).collect(Collectors.toList());
        }

        public BillResponse getBillById(UUID billId) {
                Bill bill = billRepository.findById(billId)
                                .orElseThrow(() -> new NotFoundException("Bill not found"));

                // Chuyển đổi Bill thành BillResponse
                List<BillDetailDTO> billDetailDTO = bill.getBillDetails().stream()
                                .map(detail -> BillDetailDTO.builder()
                                                .shoesId(detail.getProduct().getShoesId()) // Lấy ID giày
                                                .shoesName(detail.getProduct().getShoesName()) // Lấy tên giày
                                                .shoesImg(detail.getProduct().getShoesImg().stream().findFirst()
                                                                .orElse("")) // Lấy ảnh giày
                                                .quantity(detail.getQuantity()) // Lấy số lượng giày
                                                .shoesPrice(detail.getProduct().getShoesPrice()) // Lấy giá giày
                                                .sizeId(detail.getSize().getIdSize()) // Lấy ID size của giày
                                                .sizeVi(detail.getSize().getSizeVi())
                                                .totalPrice(detail.getTotalPrice()) // Tổng giá trị của sản phẩm
                                                                                    // (quantity * price)
                                                .build())
                                .collect(Collectors.toList());

                // Tạo thông tin shoppingInfo từ Address
                AddressResponse shoppingInfoResponse = AddressResponse.builder()
                                .shoppingInfoId(bill.getShippingAddress().getShoppingInfoId()) // Lấy ID địa chỉ giao
                                                                                               // hàng
                                .shoppingInfoName(bill.getShippingAddress().getShoppingInfoName()) // Tên người nhận
                                .address(bill.getShippingAddress().getAddress()) // Địa chỉ giao hàng
                                .shoppingInfoPhone(bill.getShippingAddress().getShoppingInfoName()) // Số điện thoại
                                                                                                    // người nhận
                                .idAccount(bill.getUser().getIdAccount())
                                .build();

                // Trả về BillResponse với thông tin chi tiết
                return BillResponse.builder()
                                .billId(bill.getBillId())
                                .idAccount(bill.getUser().getIdAccount()) // Lấy ID tài khoản người dùng
                                .imageUser(bill.getUser().getImageUser())
                                .fullName(bill.getUser().getFullName())
                                .gender(bill.getUser().getGender())
                                .totalAmount(bill.getTotalAmount()) // Tổng giá trị đơn hàng
                                .billDate(bill.getBillDate().toLocalDate()) // Ngày lập hóa đơn
                                .status(bill.getStatus()) // Trạng thái của hóa đơn
                                .shoppingInfo(shoppingInfoResponse) // Thông tin địa chỉ giao hàng
                                .billDetail(billDetailDTO) // Danh sách chi tiết hóa đơn
                                .build();
        }

        @Override
        public List<BillResponse> getBillsByAccountId(UUID userId) {

                List<Bill> bills = billRepository.findByUser_IdAccount(userId);

                return bills.stream().map(bill -> BillResponse.builder()
                                .billId(bill.getBillId())
                                .idAccount(bill.getUser().getIdAccount())
                                .imageUser(bill.getUser().getImageUser())
                                .fullName(bill.getUser().getFullName())
                                .gender(bill.getUser().getGender())
                                .totalAmount(bill.getTotalAmount())
                                .billDate(bill.getBillDate().toLocalDate())
                                .status(bill.getStatus())
                                .shoppingInfo(AddressResponse.builder()
                                                .shoppingInfoId(bill.getShippingAddress().getShoppingInfoId())
                                                .shoppingInfoName(bill.getShippingAddress().getShoppingInfoName())
                                                .address(bill.getShippingAddress().getAddress())
                                                .shoppingInfoPhone(bill.getShippingAddress().getShoppingInfoPhone())
                                                .idAccount(bill.getUser().getIdAccount())
                                                .build())
                                .billDetail(bill.getBillDetails().stream().map(detail -> BillDetailDTO.builder()
                                                .shoesId(detail.getProduct().getShoesId())
                                                .shoesName(detail.getProduct().getShoesName())
                                                .shoesImg(detail.getProduct().getShoesImg().stream().findFirst()
                                                                .orElse(""))
                                                .quantity(detail.getQuantity())
                                                .shoesPrice(detail.getProduct().getShoesPrice())
                                                .sizeId(detail.getSize().getIdSize())
                                                .sizeVi(detail.getSize().getSizeVi())
                                                .totalPrice(detail.getTotalPrice())
                                                .build()).toList())
                                .build()).toList();

        }

        @Override
        public List<BillResponse> getAllBills() {
                List<Bill> bills = billRepository.findAll();

                return bills.stream().map(bill -> BillResponse.builder()
                                .billId(bill.getBillId())
                                .idAccount(bill.getUser().getIdAccount())
                                .imageUser(bill.getUser().getImageUser())
                                .fullName(bill.getUser().getFullName())
                                .gender(bill.getUser().getGender())
                                .totalAmount(bill.getTotalAmount())
                                .billDate(bill.getBillDate().toLocalDate())
                                .status(bill.getStatus())
                                .shoppingInfo(AddressResponse.builder()
                                                .shoppingInfoId(bill.getShippingAddress().getShoppingInfoId())
                                                .shoppingInfoName(bill.getShippingAddress().getShoppingInfoName())
                                                .address(bill.getShippingAddress().getAddress())
                                                .shoppingInfoPhone(bill.getShippingAddress().getShoppingInfoPhone())
                                                .idAccount(bill.getUser().getIdAccount())
                                                .build())
                                .billDetail(bill.getBillDetails().stream().map(detail -> BillDetailDTO.builder()
                                                .shoesId(detail.getProduct().getShoesId())
                                                .shoesName(detail.getProduct().getShoesName())
                                                .shoesImg(detail.getProduct().getShoesImg().stream().findFirst()
                                                                .orElse(""))
                                                .quantity(detail.getQuantity())
                                                .shoesPrice(detail.getProduct().getShoesPrice())
                                                .sizeId(detail.getSize().getIdSize())
                                                .sizeVi(detail.getSize().getSizeVi())
                                                .totalPrice(detail.getTotalPrice())
                                                .build()).toList())
                                .build()).toList();
        }

        @Override
        public void deleteBill(UUID billId) {
                if (!billRepository.existsById(billId)) {
                        throw new NotFoundException("Bill not found with ID: " + billId);
                }
                billRepository.deleteById(billId);
        }

        @Override
        public BillResponse updateBillStatus(UUID billId, String status) {
                Bill bill = billRepository.findById(billId)
                                .orElseThrow(() -> new NotFoundException("Bill not found with ID: " + billId));
                bill.setStatus(status);
                billRepository.save(bill);

                return BillResponse.builder()
                                .billId(bill.getBillId())
                                .idAccount(bill.getUser().getIdAccount())
                                .imageUser(bill.getUser().getImageUser())
                                .fullName(bill.getUser().getFullName())
                                .gender(bill.getUser().getGender())
                                .totalAmount(bill.getTotalAmount())
                                .billDate(bill.getBillDate().toLocalDate())
                                .status(bill.getStatus())
                                .shoppingInfo(AddressResponse.builder()
                                                .shoppingInfoId(bill.getShippingAddress().getShoppingInfoId())
                                                .shoppingInfoName(bill.getShippingAddress().getShoppingInfoName())
                                                .address(bill.getShippingAddress().getAddress())
                                                .shoppingInfoPhone(bill.getShippingAddress().getShoppingInfoPhone())
                                                .idAccount(bill.getUser().getIdAccount())
                                                .build())
                                .billDetail(bill.getBillDetails().stream().map(detail -> BillDetailDTO.builder()
                                                .shoesId(detail.getProduct().getShoesId())
                                                .shoesName(detail.getProduct().getShoesName())
                                                .shoesImg(detail.getProduct().getShoesImg().stream().findFirst()
                                                                .orElse(""))
                                                .quantity(detail.getQuantity())
                                                .shoesPrice(detail.getProduct().getShoesPrice())
                                                .sizeId(detail.getSize().getIdSize())
                                                .sizeVi(detail.getSize().getSizeVi())
                                                .totalPrice(detail.getTotalPrice())
                                                .build()).toList())
                                .build();

        }

}