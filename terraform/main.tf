# setting provider
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# Data source to reference the existing resource group
data "azurerm_resource_group" "existing_rg" {
  name = "frontend-backend-rg"
}

# Data source to reference the existing virtual network
data "azurerm_virtual_network" "existing_vnet" {
  name                = "frontend-backend-vnet"
  resource_group_name = data.azurerm_resource_group.existing_rg.name
}

# Data source to reference the existing subnet
data "azurerm_subnet" "existing_subnet" {
  name                 = "frontend-backend-subnet"
  virtual_network_name = data.azurerm_virtual_network.existing_vnet.name
  resource_group_name  = data.azurerm_resource_group.existing_rg.name
}

# Data source to reference the existing Public IP
data "azurerm_public_ip" "existing_pip" {
  name                = "frontend-backend-pip"
  resource_group_name = data.azurerm_resource_group.existing_rg.name
}

# Data source to reference the existing Network Security Group (NSG)
data "azurerm_network_security_group" "existing_nsg" {
  name                = "frontend-backend-nsg"
  resource_group_name = data.azurerm_resource_group.existing_rg.name
}

# Data source to reference the existing Azure Container Registry (ACR)
data "azurerm_container_registry" "existing_acr" {
  name                = "frontendbackendacr"
  resource_group_name = data.azurerm_resource_group.existing_rg.name
}

# Creating Network Interface (NIC) using existing subnet and public IP
resource "azurerm_network_interface" "frontend_backend_nic" {
  name                = "frontend-backend-nic"
  location            = data.azurerm_resource_group.existing_rg.location
  resource_group_name = data.azurerm_resource_group.existing_rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.existing_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = data.azurerm_public_ip.existing_pip.id
  }
}

# Associating NSG with NIC
resource "azurerm_network_interface_security_group_association" "frontend_backend_nic_nsg" {
  network_interface_id      = azurerm_network_interface.frontend_backend_nic.id
  network_security_group_id = data.azurerm_network_security_group.existing_nsg.id
}

# Creating the main Virtual Machine using azurerm_linux_virtual_machine
resource "azurerm_linux_virtual_machine" "frontend_backend_vm" {
  name                  = "frontend-backend-vm"
  location              = data.azurerm_resource_group.existing_rg.location
  resource_group_name   = data.azurerm_resource_group.existing_rg.name
  network_interface_ids = [azurerm_network_interface.frontend_backend_nic.id]
  size                  = "Standard_B1s"
  admin_username        = "azureuser"

  admin_ssh_key {
    username   = "azureuser"
    public_key = var.public_key
  }

  disable_password_authentication = true

  os_disk {
    name                 = "frontend-backend-osdisk"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  tags = {
    environment = "development"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "sudo apt-get update -y",
      "sudo apt-get install -y docker-ce",
      "sudo usermod -aG docker azureuser"
    ]

    connection {
      type        = "ssh"
      user        = "azureuser"
      private_key = file("~/.ssh/id_rsa")
      host        = data.azurerm_public_ip.existing_pip.ip_address
    }
  }
}

