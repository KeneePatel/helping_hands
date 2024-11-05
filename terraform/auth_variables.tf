variable "subscription_id" {
  description = "The Azure subscription ID"
  type        = string
  sensitive   = true
}

variable "client_id" {
  description = "The client ID for Azure authentication"
  type        = string
  sensitive   = true
}

variable "client_secret" {
  description = "The client secret for Azure authentication"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "The tenant ID for Azure authentication"
  type        = string
  sensitive   = true
}

