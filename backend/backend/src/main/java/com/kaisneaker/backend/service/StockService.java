package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.SizeWithQuantityStockDTO;
import com.kaisneaker.backend.dto.StockDTO;
import com.kaisneaker.backend.model.Stock;

public interface StockService {
    List<Stock> getAllStocks();

    Stock getStockById(UUID id);

    List<Stock> getStockByName(String stockName);

    List<SizeWithQuantityStockDTO> getByProductId(UUID productId);

    void createStock(StockDTO stock);

    Stock updateStock(UUID id, StockDTO stock);

    void deleteStock(UUID id);
}
