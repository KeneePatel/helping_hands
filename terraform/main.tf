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

# Creating Network Interface (NIC)
resource "azurerm_network_interface" "frontend_backend_nic" {
  name                = "frontend-backend-nic"
  location            = data.azurerm_resource_group.existing_rg.location
  resource_group_name = data.azurerm_resource_group.existing_rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.existing_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.frontend_backend_pip.id
  }
}

# Making the vm to be in a static ip
resource "azurerm_public_ip" "frontend_backend_pip" {
  name                = "frontend-backend-pip"
  location            = data.azurerm_resource_group.existing_rg.location
  resource_group_name = data.azurerm_resource_group.existing_rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

# Creating Network Security Group (NSG)
resource "azurerm_network_security_group" "frontend_backend_nsg" {
  name                = "frontend-backend-nsg"
  location            = data.azurerm_resource_group.existing_rg.location
  resource_group_name = data.azurerm_resource_group.existing_rg.name

  security_rule {
    name                       = "AllowSSH"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTP3000"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowHTTP8080"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "8080"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# Associating NSG with NIC
resource "azurerm_network_interface_security_group_association" "frontend_backend_nic_nsg" {
  network_interface_id      = azurerm_network_interface.frontend_backend_nic.id
  network_security_group_id = azurerm_network_security_group.frontend_backend_nsg.id
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
    name              = "frontend-backend-osdisk"
    caching           = "ReadWrite"
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
      host        = azurerm_public_ip.frontend_backend_pip.ip_address
    }
  }
}

# Setting up the Azure Container Registry (ACR)
resource "azurerm_container_registry" "frontend_backend_acr" {
  name                = "frontendbackendacr"
  resource_group_name = data.azurerm_resource_group.existing_rg.name
  location            = data.azurerm_resource_group.existing_rg.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    environment = "development"
  }
}

