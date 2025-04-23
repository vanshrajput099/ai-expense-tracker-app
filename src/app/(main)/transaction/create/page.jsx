import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../__components/AddTransactionForm";
import { getUserAccounts } from "@/app/actions/accounts";
import { getTransaction } from "@/app/actions/transactions";
import colors from "@/colors";

export default async function AddTransactionPage({ searchParams }) {

  const accounts = await getUserAccounts();
  const editId = await searchParams.then((data) => data.edit);

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="mx-auto px-5 flex justify-center items-center w-full py-10">
      <div className="w-3/8 max-lg:w-full">
        <div className="flex justify-center md:justify-normal mb-8 max-lg:w-full">
          <h1 style={{ color: colors.textPrimary }} className="text-5xl gradient-title font-bold max-lg:text-3xl"> {editId ? "Update" : "Add"} Transaction</h1>
        </div>
        <AddTransactionForm
          accounts={accounts.data}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}