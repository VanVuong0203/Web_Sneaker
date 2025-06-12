package com.kaisneaker.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.kaisneaker.backend.dto.RoleDTO;
import com.kaisneaker.backend.model.Role;

public interface RoleService {
    void createRole(RoleDTO role);

    List<Role> getAllRoles();

    Optional<Role> getRoleById(UUID idRole);

    Role updateRole(UUID idRole, RoleDTO roleDTO);

    void deleteRole(UUID idRole);
}
