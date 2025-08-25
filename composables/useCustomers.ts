import { ref } from "vue";
import type { Customer } from "~/types";

export const useCustomers = () => {
  const customers = ref<Customer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Mock data for development
  const initMockCustomers = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    customers.value = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        address: "123 Main St, Anytown, USA",
        company: "ABC Corp",
        notes: "Regular customer",
        createdAt: lastWeek,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+0987654321",
        address: "456 Oak Ave, Somewhere, USA",
        company: "XYZ Inc",
        notes: "Corporate account",
        createdAt: today,
      },
    ];
  };

  const fetchCustomers = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      initMockCustomers();
    } catch (err) {
      error.value = "Failed to fetch customers";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getCustomerById = (id: string) => {
    return customers.value.find((customer) => customer.id === id);
  };

  const addCustomer = (customer: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    customers.value.push(newCustomer);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const index = customers.value.findIndex((customer) => customer.id === id);
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updates };
      return customers.value[index];
    }
    return null;
  };

  const deleteCustomer = (id: string) => {
    const index = customers.value.findIndex((customer) => customer.id === id);
    if (index !== -1) {
      customers.value.splice(index, 1);
      return true;
    }
    return false;
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

