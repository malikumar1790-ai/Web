# Email Service Integration Setup - Nexariza AI

This document explains the configured email functionality for the Nexariza AI contact form using your custom SMTP server.

## Current Configuration

The contact form is configured to use your custom SMTP server with the following settings:

```env
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587 (TLS)
SMTP_USER=contact@nexariza.com
SMTP_PASS=Nexariza@Ahmad1122
```

## Environment Variables

Create a `.env.local` file in your project root with these exact values:

```env
# SMTP Configuration for Nexariza AI
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=587
SMTP_USER=contact@nexariza.com
SMTP_PASS=Nexariza@Ahmad1122

# General Configuration
CONTACT_EMAIL=contact@nexariza.com
NEXT_PUBLIC_SITE_URL=https://www.nexariza.com
NODE_ENV=production
```

## Installation

Install the required nodemailer package:

```bash
npm install nodemailer
```

## How It Works

1. **User submits contact form** → Frontend validation
2. **Form data sent to `/api/contact`** → Server-side processing
3. **Two emails sent simultaneously**:
   - **Admin notification** → contact@nexariza.com (your inbox)
   - **Auto-reply confirmation** → User's email address
4. **Success confirmation** → Form clears automatically

## Email Template Features

### Admin Notification Email:
- ✅ Professional Nexariza AI branding
- ✅ Complete contact information
- ✅ Service interest selection
- ✅ Full message content
- ✅ Timestamp and source tracking
- ✅ HTML and plain text formats
- ✅ Responsive design for all email clients

### User Auto-Reply Email:
- ✅ Professional welcome message with Nexariza AI branding
- ✅ Submission confirmation and summary
- ✅ Clear next steps and timeline (24-hour response)
- ✅ Company information and founder introduction
- ✅ Contact information and website links
- ✅ Professional footer with company details
- ✅ Responsive design for all devices

## Deployment

### Vercel (Recommended)
1. Deploy your project to Vercel
2. Add environment variables in Vercel dashboard:
   - `SMTP_HOST`: smtpout.secureserver.net
   - `SMTP_PORT`: 587
   - `SMTP_USER`: contact@nexariza.com
   - `SMTP_PASS`: Nexariza@Ahmad1122
3. The API endpoint will be available at `/api/contact`

### Netlify
1. Add the same environment variables in Netlify dashboard
2. Ensure serverless functions are enabled

### Other Platforms
Ensure your hosting platform supports Node.js serverless functions and add the environment variables.

## Testing

You can test the contact form by:

1. Running the development server: `npm run dev`
2. Filling out the contact form on your website
3. Checking your email inbox at contact@nexariza.com for both:
   - Admin notification email (with form data)
   - Auto-reply confirmation email (user confirmation)
4. Reviewing the console logs for debugging

### Test Scripts Available:
- `node test-email.js` - Tests basic SMTP connectivity
- `node test-dual-email.js` - Tests both admin and auto-reply emails

## Security Features

- ✅ Input validation and sanitization
- ✅ Email format validation
- ✅ Rate limiting protection
- ✅ Secure SMTP with TLS encryption
- ✅ Environment variables for credentials
- ✅ Error handling and logging

## Email Sample

When someone submits the form, you'll receive a professional email with:

**Subject**: New Contact Form Submission from [Name]

**Content**: 
- Contact details (name, email, company)
- Service interest selection
- Full message content
- Professional Nexariza AI styling
- Timestamp and source information

## Troubleshooting

If emails aren't being sent:
1. Verify environment variables are set correctly
2. Check that nodemailer is installed
3. Ensure your hosting platform supports serverless functions
4. Check the server logs for specific error messages
5. Verify your email credentials are still valid

## Alternative Port Configuration

If port 587 doesn't work, you can try SSL port 465:

```env
SMTP_PORT=465
# And set secure: true in the API configuration
```
