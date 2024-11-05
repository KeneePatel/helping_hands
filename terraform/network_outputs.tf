output "frontend_backend_public_ip" {
  description = "The public IP address of the VM running both frontend and backend"
  value       = azurerm_public_ip.frontend_backend_pip.ip_address
}

