import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getCurrentBudget } from "@/app/actions/budget";
import { getDashboardData, getUserAccounts } from "@/app/actions/dashboard";
import BudgetProgress from './_components/BudgetProgress';
import { DashboardOverview } from './_components/DashBoardOverView';
import CreateAccountDrawer from '@/components/CreateAccountDrawer';
import AccountCard from './_components/AccountCard';
import colors from '@/colors';
import { checkUser } from '@/lib/checkUser';

const page = async () => {

    await checkUser();

    const [accounts, transactions] = await Promise.all([
        getUserAccounts(),
        getDashboardData(),
    ]);

    const defaultAccount = accounts?.find((account) => account.isDefault);

    let budgetData = null;
    if (defaultAccount) {
        budgetData = await getCurrentBudget(defaultAccount.id);
    }

    return (
        <div className="space-y-8 flex justify-center p-10">
            <div className='w-2/3 flex flex-col gap-10'>
                <h1 className='text-5xl font-bold' style={{ color: colors.textPrimary }}>DashBoard</h1>

                {
                    defaultAccount &&
                    <>
                        <BudgetProgress
                            initialBudget={budgetData?.budget}
                            currentExpenses={budgetData?.currentExpenses || 0}
                        />

                        <DashboardOverview
                            accounts={accounts}
                            transactions={transactions || []}
                        />
                    </>
                }

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <CreateAccountDrawer>
                        <Card style={{ background: colors.cardBase, border: `1px solid ${colors.border}`, color: colors.textPrimary }} className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-full">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                                <Plus className="h-10 w-10 mb-2" />
                                <p className="text-sm font-medium">Add New Account</p>
                            </CardContent>
                        </Card>
                    </CreateAccountDrawer>
                    {accounts.length > 0 &&
                        accounts?.map((account) => (
                            <AccountCard key={account.id} accountData={account} />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default page
