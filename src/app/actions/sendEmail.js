import { Resend } from "resend"

export const sendEmail = async ({ to, subject, react }) => {
    const resend = new Resend(process.env.RESEND_API || "");
    try {
        const data = await resend.emails.send({
            from: 'Expense App <onboarding@resend.dev>',
            to,
            subject,
            react
        });
        return { success: true, data }
    } catch (error) {
        console.log(error.message)
        return { success: false, error: error.message }
    }

}