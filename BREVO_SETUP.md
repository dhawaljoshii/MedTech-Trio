# Brevo (Sendinblue) Email Setup Guide

To enable email confirmations for appointment bookings, you need to configure your Brevo SMTP credentials.

## 1. Get Your API Key
1.  Log in to your [Brevo account](https://www.brevo.com/).
2.  Go to **SMTP & API** settings (usually under your profile menu -> SMTP & API).
3.  Click on the **SMTP** tab (not API Keys).
4.  Generate a new SMTP Key.

## 2. Configure Environment Variables
Create a file named `.env.local` in the root directory of the project (`patient_bot/`) and add the following:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_login_email@example.com
SMTP_PASS=your_generated_smtp_key_v3
```

-   **SMTP_USER**: The email address you use to log in to Brevo.
-   **SMTP_PASS**: The generic SMTP key (Master Password) or a specific SMTP key generated in step 1.

## 3. Verify
Once configured, the application will automatically attempt to send confirmation emails when an appointment is booked. Check the server console logs for "Message sent: <ID>" to verify success.
