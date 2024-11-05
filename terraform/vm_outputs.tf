output "frontend_backend_vm_id" {
  description = "The ID of the Virtual Machine running frontend and backend"
  value       = azurerm_linux_virtual_machine.frontend_backend_vm.id
}

