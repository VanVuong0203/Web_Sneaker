package com.kaisneaker.backend.utils.common;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;

public class CustomPage<T> implements Page<T> {

    private final int number;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean last;
    private final boolean first;
    private final boolean empty;

    @NonNull
    private final Sort sort;

    @NonNull
    private final List<T> content;

    public CustomPage(Collection<T> content, Pageable pageable, long totalElements) {
        this.number = pageable.getPageNumber();
        this.size = pageable.getPageSize();
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / (double) size);
        this.last = this.number == this.totalPages - 1;
        this.first = this.number == 0;
        this.sort = pageable.getSort() != null ? pageable.getSort() : Sort.unsorted();
        this.content = List.copyOf(content);
        this.empty = this.content.isEmpty();
    }

    @Override
    public int getNumber() {
        return this.number;
    }

    @Override
    public int getSize() {
        return this.size;
    }

    @Override
    public int getNumberOfElements() {
        return this.content.size();
    }

    @Override
    public long getTotalElements() {
        return this.totalElements;
    }

    @Override
    public int getTotalPages() {
        return this.totalPages;
    }

    @Override
    public boolean isLast() {
        return this.last;
    }

    @Override
    public boolean isFirst() {
        return this.first;
    }

    @Override
    public boolean isEmpty() {
        return this.empty;
    }

    @Override
    public boolean hasContent() {
        return !this.empty;
    }

    @Override
    public boolean hasNext() {
        return !this.last;
    }

    @Override
    public boolean hasPrevious() {
        return !this.first;
    }

    @Override
    @NonNull
    public Pageable nextPageable() {
        return hasNext() ? PageRequest.of(number + 1, size, sort) : Pageable.unpaged();
    }

    @Override
    @NonNull
    public Pageable previousPageable() {
        return hasPrevious() ? PageRequest.of(number - 1, size, sort) : Pageable.unpaged();
    }

    @Override
    public Iterator<T> iterator() {
        return this.content.iterator();
    }

    @Override
    @NonNull
    public List<T> getContent() {
        return this.content;
    }

    @Override
    @NonNull
    public Sort getSort() {
        return this.sort;
    }

    @Override
    @NonNull
    public <U> Page<U> map(@NonNull Function<? super T, ? extends U> converter) {
        List<U> converted = this.content.stream()
                .map(converter)
                .collect(Collectors.toList());
        Pageable pageable = PageRequest.of(number, size, sort);
        return new PageImpl<>(converted, pageable, totalElements);
    }
}
