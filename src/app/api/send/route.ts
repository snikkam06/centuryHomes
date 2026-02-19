import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        console.log('Sending email via Resend to:', process.env.CONTACT_EMAIL || 'delivered@resend.dev');

        const data = await resend.emails.send({
            from: 'Century Homes <onboarding@resend.dev>', // Update this once you have a verified domain
            to: process.env.CONTACT_EMAIL || 'delivered@resend.dev', // Default to testing email
            subject: `New Inquiry from ${name}`,
            replyTo: email,
            text: `
Name: ${name}
Email: ${email}
Message:
${message}
            `,
        });

        if (data.error) {
            console.error('Resend Error:', data.error);
            return NextResponse.json({ error: data.error }, { status: 500 });
        }

        console.log('Email sent successfully:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Server Internal Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
