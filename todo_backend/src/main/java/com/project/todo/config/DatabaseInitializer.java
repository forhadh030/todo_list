package com.project.todo.config;

import com.project.todo.model.Role;
import com.project.todo.model.User;
import com.project.todo.repository.RoleRepository;
import com.project.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);

            System.out.println("Roles initialized");
        }

        // Create default admin user if no users exist
        if (userRepository.count() == 0) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin"));

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName("ADMIN").ifPresent(roles::add);
            roleRepository.findByName("USER").ifPresent(roles::add);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);

            // Create default regular user
            User regularUser = new User();
            regularUser.setUsername("user");
            regularUser.setEmail("user@example.com");
            regularUser.setPassword(passwordEncoder.encode("password"));

            Set<Role> userRoles = new HashSet<>();
            roleRepository.findByName("USER").ifPresent(userRoles::add);
            regularUser.setRoles(userRoles);

            userRepository.save(regularUser);

            System.out.println("Default users created");
        }
    }
}