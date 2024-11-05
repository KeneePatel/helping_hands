output "acr_login_server" {
  description = "The login server of the Azure Container Registry"
  value       = azurerm_container_registry.frontend_backend_acr.login_server
}

output "acr_username" {
  description = "The admin username of the Azure Container Registry"
  value       = azurerm_container_registry.frontend_backend_acr.admin_username
}

output "acr_password" {
  description = "The admin password of the Azure Container Registry"
  value       = azurerm_container_registry.frontend_backend_acr.admin_password
  sensitive   = true
}

