package com.project.todo;

import com.project.todo.config.AwsSecretsManagerConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Map;

@SpringBootApplication
public class TodoApplication {

	public static void main(String[] args) {
		Map<String, String> secrets = new AwsSecretsManagerConfig().getDbCredentials();

		// Set environment variables
		System.setProperty("DB_URL", secrets.get("DB_URL"));
		System.setProperty("DB_USER", secrets.get("DB_USER"));
		System.setProperty("DB_PASSWORD", secrets.get("DB_PASSWORD"));
		SpringApplication.run(TodoApplication.class, args);
	}

}
