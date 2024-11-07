# making resource group
resource "azurerm_resource_group" "frontend_backend_rg" {
  name     = "frontend-backend-rg"
  location = "East US"
}

# Defining and setting a virtual network with subnet
resource "azurerm_virtual_network" "frontend_backend_vnet" {
  name                = "frontend-backend-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.frontend_backend_rg.location
  resource_group_name = azurerm_resource_group.frontend_backend_rg.name
}

resource "azurerm_subnet" "frontend_backend_subnet" {
  name                 = "frontend-backend-subnet"
  resource_group_name  = azurerm_resource_group.frontend_backend_rg.name
  virtual_network_name = azurerm_virtual_network.frontend_backend_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Creating Network Interface (NIC)
resource "azurerm_network_interface" "frontend_backend_nic" {
  name                = "frontend-backend-nic"
  location            = azurerm_resource_group.frontend_backend_rg.location
  resource_group_name = azurerm_resource_group.frontend_backend_rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.frontend_backend_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.frontend_backend_pip.id
  }
}

# Making the vm to be in a static ip
resource "azurerm_public_ip" "frontend_backend_pip" {
  name                = "frontend-backend-pip"
  location            = azurerm_resource_group.frontend_backend_rg.location
  resource_group_name = azurerm_resource_group.frontend_backend_rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

# Creating Network Security Group (NSG)
resource "azurerm_network_security_group" "frontend_backend_nsg" {
  name                = "frontend-backend-nsg"
  location            = azurerm_resource_group.frontend_backend_rg.location
  resource_group_name = azurerm_resource_group.frontend_backend_rg.name

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
  location              = azurerm_resource_group.frontend_backend_rg.location
  resource_group_name   = azurerm_resource_group.frontend_backend_rg.name
  network_interface_ids = [azurerm_network_interface.frontend_backend_nic.id]
  size                  = "Standard_B2s"
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
      host        = azurerm_public_ip.frontend_backend_pip.ip_address
    }
  }
}

# Setting up the Azure Container Registry (ACR)
resource "azurerm_container_registry" "frontend_backend_acr" {
  name                = "frontendbackendacr"
  resource_group_name = azurerm_resource_group.frontend_backend_rg.name
  location            = azurerm_resource_group.frontend_backend_rg.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    environment = "development"
  }
}

