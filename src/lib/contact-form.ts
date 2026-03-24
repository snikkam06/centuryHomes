const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_FORM_MIN_FILL_MS = 3000;
export const CONTACT_FORM_MAX_AGE_MS = 1000 * 60 * 60 * 12;
export const CONTACT_FORM_MAX_NAME_LENGTH = 80;
export const CONTACT_FORM_MAX_EMAIL_LENGTH = 254;
export const CONTACT_FORM_MIN_MESSAGE_LENGTH = 5;
export const CONTACT_FORM_MAX_MESSAGE_LENGTH = 2000;
export const CONTACT_FORM_MAX_LINKS = 2;

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  company: string;
  formStartedAt: number | null;
};

type RawContactSubmission = Partial<Record<keyof ContactSubmission, unknown>>;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContactSubmission(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as RawContactSubmission;
  const submittedAt =
    typeof raw.formStartedAt === "number"
      ? raw.formStartedAt
      : typeof raw.formStartedAt === "string" && raw.formStartedAt.trim() !== ""
        ? Number(raw.formStartedAt)
        : null;

  return {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    message: clean(raw.message).replace(/\r\n/g, "\n"),
    company: clean(raw.company),
    formStartedAt: Number.isFinite(submittedAt) ? submittedAt : null,
  };
}

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email);
}

export function isSuspiciousMessage(message: string) {
  const linkCount = (message.match(/https?:\/\/|www\./gi) ?? []).length;
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(message);

  return linkCount > CONTACT_FORM_MAX_LINKS || containsHtml;
}

export function isSubmissionTimingInvalid(
  formStartedAt: number | null,
  now = Date.now(),
) {
  if (!formStartedAt) {
    return true;
  }

  const elapsedMs = now - formStartedAt;
  return elapsedMs < CONTACT_FORM_MIN_FILL_MS || elapsedMs > CONTACT_FORM_MAX_AGE_MS;
}

export function validateContactSubmission(submission: ContactSubmission) {
  if (
    submission.name.length < 2 ||
    submission.name.length > CONTACT_FORM_MAX_NAME_LENGTH
  ) {
    return false;
  }

  if (
    !isValidEmail(submission.email) ||
    submission.email.length > CONTACT_FORM_MAX_EMAIL_LENGTH
  ) {
    return false;
  }

  if (
    submission.message.length < CONTACT_FORM_MIN_MESSAGE_LENGTH ||
    submission.message.length > CONTACT_FORM_MAX_MESSAGE_LENGTH
  ) {
    return false;
  }

  return true;
}
