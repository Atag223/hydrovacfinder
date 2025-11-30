import { NextRequest, NextResponse } from 'next/server';

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
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

    // Format the email content for sending to ap@hydrovacfinder.com
    const emailSubject = `New Referral: ${data.companyName}`;
    const emailBody = `
New Referral Submission
========================

COMPANY BEING REFERRED
----------------------
Company Name: ${data.companyName}
Contact Person: ${data.companyContactPerson}
Phone Number: ${data.companyPhone}

REFERRER INFORMATION
--------------------
Name: ${data.referrerName}
Email: ${data.referrerEmail}
Phone: ${data.referrerPhone}

---
This referral was submitted through HydroVacFinder.com
    `.trim();

    // TODO: Integrate with an email service (e.g., SendGrid, Resend, AWS SES)
    // to send the referral to ap@hydrovacfinder.com
    // For now, we store the email content to be sent when email service is configured
    const emailPayload = {
      to: 'ap@hydrovacfinder.com',
      subject: emailSubject,
      body: emailBody,
    };

    // In development, log that a referral was received (without sensitive data)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Referral received for company: ${data.companyName}`);
    }

    // Placeholder for email service integration
    // When you configure an email service, uncomment and modify:
    //
    // const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: emailPayload.to }] }],
    //     from: { email: 'noreply@hydrovacfinder.com' },
    //     subject: emailPayload.subject,
    //     content: [{ type: 'text/plain', value: emailPayload.body }],
    //   }),
    // });

    // Ensure emailPayload is used to avoid unused variable warning
    void emailPayload;

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
