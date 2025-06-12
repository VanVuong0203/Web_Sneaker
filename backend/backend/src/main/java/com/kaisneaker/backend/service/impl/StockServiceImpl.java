package com.kaisneaker.backend.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaisneaker.backend.dto.SizeWithQuantityStockDTO;
import com.kaisneaker.backend.dto.StockDTO;
import com.kaisneaker.backend.model.Product;
import com.kaisneaker.backend.model.Size;
import com.kaisneaker.backend.model.Stock;
import com.kaisneaker.backend.repository.ProductRepository;
import com.kaisneaker.backend.repository.SizeRepository;
import com.kaisneaker.backend.repository.StockRepository;
import com.kaisneaker.backend.service.StockService;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    private Stock mapToEntity(StockDTO dto) {

        Product product = new Product();
        product.setShoesId(dto.getProductId());

        Size size = new Size();
        size.setIdSize(dto.getIdSize());

        return Stock.builder()
                .product(product)
                .size(size)
                .quantityInStock(dto.getQuantityInStock())
                .build();
    }

    @Override
    public Stock getStockById(UUID id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong kho"));
        return stock;
    }

    @Override
    public List<Stock> getStockByName(String stockName) {
        throw new UnsupportedOperationException("Unimplemented method 'getStockByName'");
    }

    @Override
    public void deleteStock(UUID id) {
        if (stockRepository.existsById(id)) {
            stockRepository.deleteById(id);
        }
    }

    @Override
    public List<SizeWithQuantityStockDTO> getByProductId(UUID productId) {
        List<Object[]> results = stockRepository.findAvailableSizesWithQuantity(productId);
        List<SizeWithQuantityStockDTO> dtoList = new ArrayList<>();

        for (Object[] row : results) {
            UUID idSize = (UUID) row[0];
            String sizeVi = (String) row[1];
            String sizeEur = (String) row[2];
            int quantityInStock = (int) row[3];

            SizeWithQuantityStockDTO dto = new SizeWithQuantityStockDTO(idSize, sizeVi, sizeEur, quantityInStock);
            dtoList.add(dto);
        }

        return dtoList;
    }

    @Override
    public void createStock(StockDTO stockDTO) {

        UUID productId = stockDTO.getProductId();
        UUID sizeId = stockDTO.getIdSize();

        // Kiểm tra Product tồn tại không
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Không tồn tại sản phẩm với ID này: " + productId);
        }

        // Kiểm tra Size tồn tại không
        if (!sizeRepository.existsById(sizeId)) {
            throw new IllegalArgumentException("Không tồn tại size với ID này: " + sizeId);
        }

        // Kiểm tra xem sản phẩm + size đã có trong kho chưa
        boolean exists = stockRepository.existsByProduct_ShoesIdAndSize_IdSize(productId, sizeId);
        if (exists) {
            throw new IllegalArgumentException("Trong kho đã tồn tại sản phẩm và size này");
        }

        // Nếu hợp lệ thì lưu lại
        stockRepository.save(mapToEntity(stockDTO));
    }

    @Override
    public Stock updateStock(UUID id, StockDTO stockDTO) {
        Stock existingStock = getStockById(id);

        // Kiểm tra product & size có tồn tại
        UUID productId = stockDTO.getProductId();
        UUID sizeId = stockDTO.getIdSize();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Product với ID: " + productId));

        Size size = sizeRepository.findById(sizeId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Size với ID: " + sizeId));

        // Cập nhật dữ liệu

        existingStock.setProduct(product);
        existingStock.setSize(size);
        existingStock.setQuantityInStock(stockDTO.getQuantityInStock());

        return stockRepository.save(existingStock);
    }
}
