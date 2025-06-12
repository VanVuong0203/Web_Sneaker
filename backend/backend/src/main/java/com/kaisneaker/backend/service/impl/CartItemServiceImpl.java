package com.kaisneaker.backend.service.impl;

import com.kaisneaker.backend.dto.CartItemDTO;
import com.kaisneaker.backend.dto.CartItemResponse;
import com.kaisneaker.backend.dto.CartItemWithStockProjection;
import com.kaisneaker.backend.dto.ProductResponse;
import com.kaisneaker.backend.dto.SizeWithQuantityStockDTO;
import com.kaisneaker.backend.model.CartItem;
import com.kaisneaker.backend.model.Product;
import com.kaisneaker.backend.model.Size;
import com.kaisneaker.backend.model.Stock;
import com.kaisneaker.backend.model.User;
import com.kaisneaker.backend.repository.CartItemRepository;
import com.kaisneaker.backend.repository.ProductRepository;
import com.kaisneaker.backend.repository.SizeRepository;
import com.kaisneaker.backend.repository.StockRepository;
import com.kaisneaker.backend.repository.UserRepository;
import com.kaisneaker.backend.service.CartItemService;
import com.kaisneaker.backend.utils.exceptions.NotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartItemServiceImpl implements CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private StockRepository stockRepository;

    @Override
    public String createCartItem(CartItemDTO dto) {
        Optional<CartItem> cartItem = cartItemRepository
                .findByUserIdAccountAndProductShoesIdAndSizeIdSize(dto.getIdAccount(), dto.getShoesId(),
                        dto.getIdSize());
        if (cartItem.isPresent()) {
            if (cartItem.get().getQuantity() != dto.getQuantity()) {
                updateCartItem(cartItem.get().getIdCart(), dto);
                return "Cập nhật sản phẩm trong giỏ hàng thành công";
            } else
                throw new NotFoundException(
                        "Sản phẩm đã có trong giỏ hàng!! Vui lòng kiểm tra lại số lượng sản phẩm trong giỏ hàng");
        } else {
            cartItemRepository.save(mapDTOtoEntity(dto));
            return "Thêm sản phẩm vào giỏ hàng thành công";
        }
    }

    private CartItem mapDTOtoEntity(CartItemDTO cartItem) {

        User user = userRepository.findById(cartItem.getIdAccount())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"));

        Product product = productRepository.findById(cartItem.getShoesId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        Size size = sizeRepository.findById(cartItem.getIdSize())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy size"));

        if (cartItem.getQuantity() <= 0) {
            throw new NotFoundException("Số lượng sản phẩm trong giỏ hàng phải lớn hơn 0");
        }

        Stock stock = stockRepository.findAvailableStock(cartItem.getShoesId(), cartItem.getIdSize())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy size"));

        if (cartItem.getQuantity() > stock.getQuantityInStock()) {
            throw new NotFoundException("Số lượng sản phẩm trong giỏ hàng lớn hơn số lượng trong kho");
        }

        CartItem result = CartItem.builder()
                .user(user)
                .product(product)
                .size(size)
                .quantity(cartItem.getQuantity())
                .build();
        return result;
    }

    @Override
    public List<CartItemResponse> getAllCartItems() {
        List<CartItemWithStockProjection> data = cartItemRepository.findAllWithStock();
        if (data.isEmpty()) {
            throw new NotFoundException("Không tìm thấy giỏ hàng nào");
        }

        return data.stream().map(p -> {
            ProductResponse product = ProductResponse.builder()
                    .shoesId(p.getShoesId())
                    .shoesName(p.getShoesName())
                    .shoesPrice(p.getShoesPrice())
                    .shoesDescription(p.getShoesDescription())
                    .shoesImg(p.getShoesImg())
                    .brandName(p.getBrandName())
                    .build();

            SizeWithQuantityStockDTO size = SizeWithQuantityStockDTO.builder()
                    .idSize(p.getSizeId())
                    .sizeVi(p.getSizeVi())
                    .sizeEur(p.getSizeEur())
                    .quantityInStock(p.getQuantityInStock())
                    .build();

            return CartItemResponse.builder()
                    .idCartItem(p.getIdCartItem())
                    .idAccount(p.getIdAccount())
                    .product(product)
                    .size(size)
                    .quantity(p.getQuantity())
                    .build();
        }).toList();
    }

    private CartItemResponse convertToCartItemResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();
        Size size = cartItem.getSize();

        // Map Product
        ProductResponse productResponse = ProductResponse.builder()
                .shoesId(product.getShoesId())
                .shoesName(product.getShoesName())
                .shoesPrice(product.getShoesPrice())
                .shoesDescription(product.getShoesDescription())
                .shoesImg(product.getShoesImg().isEmpty() ? "" : product.getShoesImg().get(0)) // Chỉ lấy hình ảnh đầu
                // tiên
                .brandName(product.getBrand().getBrandName())
                .build();

        // Map Size with quantity in stock
        SizeWithQuantityStockDTO sizeDTO = stockRepository
                .findSizeWithQuantityByProductAndSize(product.getShoesId(), size.getIdSize())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy size cho sản phẩm này"));

        // Build response
        return CartItemResponse.builder()
                .idCartItem(cartItem.getIdCart())
                .idAccount(cartItem.getUser().getIdAccount())
                .product(productResponse)
                .size(sizeDTO)
                .quantity(cartItem.getQuantity())
                .build();

    }

    @Override
    public CartItemResponse updateCartItem(UUID idCart, CartItemDTO dto) {
        CartItem cartItem = cartItemRepository.findById(idCart)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy cart item"));

        if (dto.getQuantity() <= 0) {
            throw new NotFoundException("Số lượng sản phẩm trong giỏ hàng phải lớn hơn 0");
        }

        UUID productId = cartItem.getProduct().getShoesId();
        UUID sizeId = cartItem.getSize().getIdSize();

        Stock stock = stockRepository.findAvailableStock(productId, sizeId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy size"));

        if (dto.getQuantity() > stock.getQuantityInStock()) {
            throw new NotFoundException("Số lượng sản phẩm trong giỏ hàng lớn hơn số lượng trong kho");
        }

        cartItem.setQuantity(dto.getQuantity());
        cartItemRepository.save(cartItem);

        return convertToCartItemResponse(cartItem);
    }

    @Override
    public List<CartItemResponse> getCartItemsByAccountId(UUID userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdAccount(userId);

        if (cartItems.isEmpty()) {
            throw new NotFoundException("Không tìm thấy giỏ hàng nào cho tài khoản này");
        }

        // Lọc chỉ lấy 1 hình ảnh cho mỗi sản phẩm và nhóm lại theo shoesId và sizeId
        return cartItems.stream()
                .map(cartItem -> {
                    // Lấy thông tin sản phẩm
                    ProductResponse productResponse = getProductResponse(cartItem);

                    // Lấy thông tin size và số lượng trong kho
                    SizeWithQuantityStockDTO sizeWithStockDTO = getSizeWithStock(cartItem);

                    return CartItemResponse.builder()
                            .idCartItem(cartItem.getIdCart())
                            .idAccount(cartItem.getUser().getIdAccount())
                            .product(productResponse)
                            .size(sizeWithStockDTO)
                            .quantity(cartItem.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private ProductResponse getProductResponse(CartItem cartItem) {
        // Lấy sản phẩm từ database
        Product product = cartItem.getProduct();

        // Trả về chỉ 1 hình ảnh cho sản phẩm
        String shoesImg = product.getShoesImg().isEmpty() ? "" : product.getShoesImg().get(0);

        return ProductResponse.builder()
                .shoesId(product.getShoesId())
                .shoesName(product.getShoesName())
                .shoesPrice(product.getShoesPrice())
                .shoesDescription(product.getShoesDescription())
                .shoesImg(shoesImg) // Lấy hình ảnh đầu tiên
                .brandName(product.getBrand().getBrandName())
                .build();
    }

    private SizeWithQuantityStockDTO getSizeWithStock(CartItem cartItem) {
        // Lấy thông tin size từ cartItem
        Size size = cartItem.getSize();

        // Lấy số lượng trong kho từ Stock repository
        Stock stock = stockRepository.findAvailableStock(cartItem.getProduct().getShoesId(), size.getIdSize())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy size cho sản phẩm này"));

        // Trả về thông tin size và số lượng trong kho
        return SizeWithQuantityStockDTO.builder()
                .idSize(size.getIdSize())
                .sizeVi(size.getSizeVi())
                .sizeEur(size.getSizeEur())
                .quantityInStock(stock.getQuantityInStock())
                .build();
    }

    @Override
    public void deleteCartItem(UUID idCart) {
        if (!cartItemRepository.existsById(idCart)) {
            throw new NotFoundException("Không tìm thấy cart item để xóa");
        }
        cartItemRepository.deleteById(idCart);
    }

    @Override
    public void clearCart(UUID userId) {
        cartItemRepository.deleteByUserIdAccount(userId);
    }

}
