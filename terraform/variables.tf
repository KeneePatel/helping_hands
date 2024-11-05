variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
  default     = "frontend-backend-rg"
}

variable "location" {
  type        = string
  description = "The Azure region to deploy resources."
  default     = "East US"
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

variable "public_key" {
  description = "The public SSH key for the virtual machine"
  type        = string
}

variable "subscription_id" {
  description = "The Azure subscription ID"
  type        = string
  sensitive   = true
}

