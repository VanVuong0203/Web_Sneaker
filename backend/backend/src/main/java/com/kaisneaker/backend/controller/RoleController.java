package com.kaisneaker.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.kaisneaker.backend.dto.RoleDTO;
import com.kaisneaker.backend.model.Role;
import com.kaisneaker.backend.service.RoleService;
import com.kaisneaker.backend.utils.common.ResultEntity;

@RestController
@CrossOrigin
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // Tạo mới Role
    @PostMapping("")
    public ResponseEntity<ResultEntity<RoleDTO>> createRole(@RequestBody RoleDTO roledDto) {
        roleService.createRole(roledDto);
        return ResponseEntity.ok(ResultEntity.of("Tạo thành công Role", roledDto));
    }

    // Lấy tất cả Role
    @GetMapping("")
    public ResponseEntity<ResultEntity<List<Role>>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ResultEntity.of("Lấy tất cả danh sách thành công", roles));
    }

    // // Lấy Role theo ID
    @GetMapping("/{idRole}")
    public ResponseEntity<ResultEntity<Role>> getRoleById(@PathVariable UUID idRole) {
        Optional<Role> role = roleService.getRoleById(idRole);

        if (role.isPresent()) {
            return ResponseEntity.ok(ResultEntity.of("SUCCESS", role.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResultEntity.<Role>builder()
                            .message("Không tìm thấy role với ID: " + idRole)
                            .success(false)
                            .returnCode("NOT_FOUND")
                            .result(null)
                            .build());
        }
    }

    // Cập nhật Role
    @PutMapping("/{idRole}")
    public ResponseEntity<ResultEntity<Role>> updateRole(@PathVariable UUID idRole,
            @RequestBody RoleDTO roleDetails) {
        Role updatedRole = roleService.updateRole(idRole, roleDetails);
        return updatedRole != null ? ResponseEntity.ok(ResultEntity.of("SUCCESS", updatedRole))
                : ResponseEntity.notFound().build();
    }

    // Xóa Role
    @DeleteMapping("/{idRole}")
    public ResponseEntity<ResultEntity<String>> deleteRole(@PathVariable UUID idRole) {
        roleService.deleteRole(idRole);
        return ResponseEntity.ok(ResultEntity.of("SUCCESS", "Xóa thành công id: " + idRole.toString()));
    }
}
