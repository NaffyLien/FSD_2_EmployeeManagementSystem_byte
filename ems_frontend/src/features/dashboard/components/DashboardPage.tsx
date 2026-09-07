import { useEmployees, EmployeeList } from '../index';

export function DashboardPage() {
  const { employees, loading, error, reload, addEmployee, updateEmployee, removeEmployee } = useEmployees();

  return (
    <EmployeeList
      employees={employees}
      loading={loading}
      error={error}
      onReload={reload}
      onAdded={addEmployee}
      onUpdated={updateEmployee}
      onDeleted={removeEmployee} />
  );
}
