import { NextRequest, NextResponse } from 'next/server';

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.referrerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Format the email content
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

    // Log the referral for now (in production, you would use an email service like SendGrid, Resend, etc.)
    console.log('=== NEW REFERRAL SUBMISSION ===');
    console.log('To: ap@hydrovacfinder.com');
    console.log(`Subject: ${emailSubject}`);
    console.log('Body:');
    console.log(emailBody);
    console.log('================================');

    // For a production implementation, you would integrate with an email service here.
    // Example with fetch to an email API:
    //
    // const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: 'ap@hydrovacfinder.com' }] }],
    //     from: { email: 'noreply@hydrovacfinder.com' },
    //     subject: emailSubject,
    //     content: [{ type: 'text/plain', value: emailBody }],
    //   }),
    // });

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
