variable "subscription_id" {
  description = "The Azure subscription ID"
  type        = string
  sensitive   = true
}

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

