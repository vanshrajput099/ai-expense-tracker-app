"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (object) => {
    const serialized = { ...object };

    if (object.balance) {
        serialized.balance = object.balance.toNumber();
    }

    if (object.amount) {
        serialized.amount = object.amount.toNumber();
    }

    return serialized;
}

export const getUserAccounts = async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });

        if (!user) {
            throw new Error("User Not Found");
        }

        const allAccounts = await db.account.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: {
                        transactions: true
                    }
                }
            }
        });

        const serializedAccounts = allAccounts.map((acc) => serializeTransaction(acc));
        return { success: true, data: serializedAccounts };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const getUserAccountWithTransactions = async (accountId) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });

        if (!user) {
            throw new Error("User Not Found");
        }

        const account = await db.account.findUnique({
            where: {
                id: accountId,
                userId: user.id
            },
            include: {
                transactions: {
                    orderBy: { date: 'desc' }
                },
                _count: {
                    select: { transactions: true }
                }
            }
        });


        if (!account) {
            return null;
        }

        const transactionsArr = account.transactions.map((ele) => serializeTransaction(ele));

        return {
            ...serializeTransaction(account),
            transactions: transactionsArr
        }


    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const updateDefaultAccount = async (accountId) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });

        if (!user) {
            throw new Error("User Not Found");
        }

        const account = await db.account.findUnique({
            where: {
                id: accountId
            }
        });

        if (!account) {
            throw new Error("Account not found");
        }

        await db.account.updateMany({
            where: {
                userId: user.id, isDefault: true
            },
            data: { isDefault: false }
        });

        const acc = await db.account.update({
            where: {
                userId: user.id, id: accountId
            },
            data: { isDefault: true }
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(acc) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            },
        });

        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change =
                transaction.type === "EXPENSE"
                    ? transaction.amount
                    : -transaction.amount;
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {});

        await db.$transaction(async (tx) => {
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                },
            });

            for (const [accountId, balanceChange] of Object.entries(
                accountBalanceChanges
            )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                });
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
