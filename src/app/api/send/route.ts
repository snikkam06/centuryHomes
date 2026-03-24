import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
    parseContactSubmission,
    validateContactSubmission,
    isSubmissionTimingInvalid,
    isSuspiciousMessage,
} from '@/lib/contact-form';

const resend = new Resend(process.env.RESEND_API_KEY);
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_IP = 3;
const MAX_REQUESTS_PER_EMAIL = 2;

declare global {
    var __contactRateLimitStore: Map<string, number[]> | undefined;
}

const rateLimitStore = globalThis.__contactRateLimitStore ?? new Map<string, number[]>();
globalThis.__contactRateLimitStore = rateLimitStore;

function getClientIp(request: Request) {
    const forwardedFor = request.headers.get('x-forwarded-for');

    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() || 'unknown';
    }

    return request.headers.get('x-real-ip') || 'unknown';
}

function isAllowedOrigin(request: Request) {
    const origin = request.headers.get('origin');

    if (!origin) {
        return true;
    }

    try {
        const originUrl = new URL(origin);
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host');

        return host ? originUrl.host === host : false;
    } catch {
        return false;
    }
}

function consumeRateLimit(key: string, limit: number, now = Date.now()) {
    const recentRequests = (rateLimitStore.get(key) || []).filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
    );

    if (recentRequests.length >= limit) {
        rateLimitStore.set(key, recentRequests);
        return false;
    }

    recentRequests.push(now);
    rateLimitStore.set(key, recentRequests);
    return true;
}

export async function POST(request: Request) {
    try {
        if (!isAllowedOrigin(request)) {
            return NextResponse.json({ error: 'Unable to send message.' }, { status: 403 });
        }

        const submission = parseContactSubmission(await request.json());

        if (!submission || !validateContactSubmission(submission)) {
            return NextResponse.json({ error: 'Unable to send message.' }, { status: 400 });
        }

        if (submission.company || isSubmissionTimingInvalid(submission.formStartedAt)) {
            return NextResponse.json({ error: 'Unable to send message.' }, { status: 400 });
        }

        if (isSuspiciousMessage(submission.message)) {
            return NextResponse.json({ error: 'Unable to send message.' }, { status: 400 });
        }

        const now = Date.now();
        const clientIp = getClientIp(request);

        if (!consumeRateLimit(`ip:${clientIp}`, MAX_REQUESTS_PER_IP, now)) {
            return NextResponse.json(
                { error: 'Too many attempts. Please wait a few minutes and try again.' },
                { status: 429 },
            );
        }

        if (!consumeRateLimit(`email:${submission.email}`, MAX_REQUESTS_PER_EMAIL, now)) {
            return NextResponse.json(
                { error: 'Too many attempts. Please wait a few minutes and try again.' },
                { status: 429 },
            );
        }

        console.log('Sending email via Resend to:', process.env.CONTACT_EMAIL || 'delivered@resend.dev');

        const data = await resend.emails.send({
            from: 'Century Homes <onboarding@resend.dev>', // Update this once you have a verified domain
            to: process.env.CONTACT_EMAIL || 'delivered@resend.dev', // Default to testing email
            subject: `New Inquiry from ${submission.name}`,
            replyTo: submission.email,
            text: `
Name: ${submission.name}
Email: ${submission.email}
Message:
${submission.message}
            `,
        });

        if (data.error) {
            console.error('Resend Error:', data.error);
            return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 });
        }

        console.log('Email sent successfully:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Server Internal Error:', error);
        return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 });
    }
}
