package com.kaisneaker.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaisneaker.backend.dto.RoleDTO;
import com.kaisneaker.backend.model.Role;
import com.kaisneaker.backend.repository.RoleRepository;
import com.kaisneaker.backend.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void createRole(RoleDTO roleDto) {

        roleRepository.save(mapToEntity(roleDto));
    }

    private Role mapToEntity(RoleDTO dto) {
        Role entity = Role.builder()
                .roleName(dto.getRoleName())
                .build();
        return entity;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> getRoleById(UUID idRole) {
        return roleRepository.findById(idRole);
    }

    @Override
    public Role updateRole(UUID idRole, RoleDTO roleDTO) {

        Optional<Role> existingRoleOpt = getRoleById(idRole);
        if (existingRoleOpt.isPresent()) {
            Role existingRole = existingRoleOpt.get();
            existingRole.setRoleName(roleDTO.getRoleName());
            // Cập nhật các trường cần thiết khác nếu có
            return roleRepository.save(existingRole);
        } else {
            return null; // Hoặc throw exception
        }

    }

    @Override
    public void deleteRole(UUID idRole) {
        if (roleRepository.existsById(idRole)) {
            roleRepository.deleteById(idRole);
        }
    }

}
