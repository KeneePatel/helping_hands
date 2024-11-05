variable "resource_group_name" {
  type        = string
  description = "The name of the resource group for network components."
  default     = "frontend-backend-rg"
}

variable "location" {
  type        = string
  description = "The Azure region to deploy resources."
  default     = "East US"
}

