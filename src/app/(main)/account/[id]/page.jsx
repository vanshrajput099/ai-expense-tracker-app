"use server";
import { getUserAccountWithTransactions } from '@/app/actions/accounts'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import TransactionTable from '../_components/TransactionTable';
import ChartSection from '../_components/ChartSection';
import colors from '@/colors';

const page = async ({ params }) => {
    
    const { id } = await params;
    const { transactions, ...accountData } = await getUserAccountWithTransactions(id);

    if (!accountData) {
        notFound();
    }

    return (
        <div>
            <div className='flex justify-between px-20 py-10 items-center mt-5 max-lg:px-5'>
                <div className='flex flex-col gap-1'>
                    <h1 style={{ color: colors.textPrimary }} className='text-6xl font-bold max-lg:text-3xl'>{accountData.name}</h1>
                    <h1 className='text-lg text-muted-foreground max-lg:text-sm'>{accountData.type} Account</h1>
                </div>
                <div className='flex flex-col gap-1 text-right'>
                    <h1 style={{ color: colors.textPrimary }} className='text-3xl font-bold max-lg:text-3xl'>${accountData.balance}</h1>
                    <h1 className='text-lg text-muted-foreground max-lg:text-sm'>{accountData._count.transactions} Transactions</h1>
                </div>
            </div>

            <div>
                <Suspense>
                    <ChartSection transactions={transactions} />
                </Suspense>
            </div>

            <div className='mt-36'>
                <Suspense>
                    <TransactionTable transactions={transactions} />
                </Suspense>
            </div>
        </div>
    )
}

export default page
