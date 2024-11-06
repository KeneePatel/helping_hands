terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-backend-rg"
    storage_account_name = "statestorage2804"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

