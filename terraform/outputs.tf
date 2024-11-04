output "frontend_backend_public_ip" {
  description = "The public IP address of the VM running both frontend and backend"
  value       = azurerm_public_ip.frontend_backend_pip.ip_address
}

output "acr_login_server" {
  description = "The login server of the Azure Container Registry"
  value       = azurerm_container_registry.frontend_backend_acr.login_server
}

