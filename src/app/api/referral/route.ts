import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes text for plain text emails by removing control characters
 */
function sanitizeText(text: string): string {
  // Remove control characters except newlines and tabs
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

interface ReferralFormData {
  // Company being referred
  companyName: string;
  companyPhone: string;
  companyContactPerson: string;
  
  // Referrer information
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ReferralFormData = await request.json();

    // Validate required fields
    const requiredFields: (keyof ReferralFormData)[] = [
      'companyName',
      'companyPhone',
      'companyContactPerson',
      'referrerName',
      'referrerEmail',
      'referrerPhone',
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Basic email validation
    if (!isValidEmail(data.referrerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Sanitize user input for email templates
    const safeCompanyName = escapeHtml(data.companyName);
    const safeCompanyContactPerson = escapeHtml(data.companyContactPerson);
    const safeCompanyPhone = escapeHtml(data.companyPhone);
    const safeReferrerName = escapeHtml(data.referrerName);
    const safeReferrerEmail = escapeHtml(data.referrerEmail);
    const safeReferrerPhone = escapeHtml(data.referrerPhone);

    // Format the email content for sending to ap@hydrovacfinder.com
    const emailSubject = `New Referral: ${sanitizeText(data.companyName)}`;
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Referral Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">New Referral Submission</h1>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #1e40af; margin-top: 0;">Company Being Referred</h2>
    <p><strong>Company Name:</strong> ${safeCompanyName}</p>
    <p><strong>Contact Person:</strong> ${safeCompanyContactPerson}</p>
    <p><strong>Phone Number:</strong> ${safeCompanyPhone}</p>
  </div>
  
  <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #166534; margin-top: 0;">Referrer Information</h2>
    <p><strong>Name:</strong> ${safeReferrerName}</p>
    <p><strong>Email:</strong> ${safeReferrerEmail}</p>
    <p><strong>Phone:</strong> ${safeReferrerPhone}</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  <p style="color: #6b7280; font-size: 12px;">This referral was submitted through HydroVacFinder.com</p>
</body>
</html>
    `.trim();

    // Sanitize text for plain text email
    const textCompanyName = sanitizeText(data.companyName);
    const textCompanyContactPerson = sanitizeText(data.companyContactPerson);
    const textCompanyPhone = sanitizeText(data.companyPhone);
    const textReferrerName = sanitizeText(data.referrerName);
    const textReferrerEmail = sanitizeText(data.referrerEmail);
    const textReferrerPhone = sanitizeText(data.referrerPhone);

    const emailText = `
New Referral Submission
========================

COMPANY BEING REFERRED
----------------------
Company Name: ${textCompanyName}
Contact Person: ${textCompanyContactPerson}
Phone Number: ${textCompanyPhone}

REFERRER INFORMATION
--------------------
Name: ${textReferrerName}
Email: ${textReferrerEmail}
Phone: ${textReferrerPhone}

---
This referral was submitted through HydroVacFinder.com
    `.trim();

    // Send email using Resend
    const { error: emailError } = await resend.emails.send({
      from: 'HydroVacFinder <noreply@hydrovacfinder.com>',
      to: ['ap@hydrovacfinder.com'],
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });

    if (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send referral email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Referral submitted successfully! We will contact you soon.',
    });
  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json(
      { error: 'Failed to process referral. Please try again.' },
      { status: 500 }
    );
  }
}
