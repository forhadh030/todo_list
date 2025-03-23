package com.project.todo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Configuration
public class AwsSecretsManagerConfig {

    private final String secretName = "todo-db-credentials";  // Name of your secret
    private final Region region = Region.US_EAST_1;  // Change to your region

    @Bean
    public Map<String, String> getDbCredentials() {
        SecretsManagerClient client = SecretsManagerClient.builder()
                .region(region)
                .build();

        GetSecretValueRequest request = GetSecretValueRequest.builder()
                .secretId(secretName)
                .build();

        GetSecretValueResponse response = client.getSecretValue(request);

        // Deserialize the JSON response into a Map
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response.secretString(), Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load secrets from AWS", e);
        }
    }
}
