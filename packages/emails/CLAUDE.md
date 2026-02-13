# Email Package Guidelines

This package contains React Email templates.

## Quick Start

```bash
bun --filter @workspace/emails dev     # Preview server (port 3002)
bun --filter @workspace/emails export  # Export to HTML
```

## Structure

```
/packages/emails
├── emails/         → Email templates
│   ├── otp.tsx     → OTP verification
│   └── welcome.tsx → Welcome email
├── components/     → Shared components
└── package.json
```

## Creating Email Templates

### Basic Template
```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to our platform!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Welcome, {name}!</Heading>
        <Text style={text}>
          Thank you for signing up. We're excited to have you.
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 48px',
  borderRadius: '5px',
};

const heading = {
  color: '#1d1c1d',
  fontSize: '24px',
  fontWeight: '700',
  margin: '30px 0',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
};

// Default export for preview
export default WelcomeEmail;
```

### OTP Email Template
```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OtpEmailProps {
  code: string;
  expiresIn?: number;
}

export const OtpEmail = ({ code, expiresIn = 10 }: OtpEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code: {code}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Verification Code</Heading>
        <Section style={codeContainer}>
          <Text style={codeText}>{code}</Text>
        </Section>
        <Text style={text}>
          This code will expire in {expiresIn} minutes.
        </Text>
        <Text style={footer}>
          If you didn't request this code, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

const codeContainer = {
  background: '#f4f4f5',
  borderRadius: '4px',
  margin: '24px 0',
  padding: '24px',
  textAlign: 'center' as const,
};

const codeText = {
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '4px',
  color: '#1d1c1d',
};
```

## Using siteConfig

The emails should use `siteConfig` for consistent branding:

```typescript
// Access from web app siteConfig
import { siteConfig } from '@/siteConfig';

// In email template
<Text>From: {siteConfig.name}</Text>
```

Note: The siteConfig is in the web app. When sending emails, pass the relevant values as props.

## Sending Emails

Emails are sent via Resend from the web app:

```typescript
// In web app server action or API
import { Resend } from 'resend';
import { WelcomeEmail } from '@workspace/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: process.env.RESEND_EMAIL_FROM,
  to: user.email,
  subject: 'Welcome!',
  react: WelcomeEmail({ name: user.name }),
});
```

## Best Practices

### Inline Styles
React Email uses inline styles for maximum email client compatibility:

```typescript
// ✅ Correct
<Text style={{ color: '#333', fontSize: '16px' }}>Content</Text>

// ❌ Wrong - CSS classes won't work in emails
<Text className="text-gray-700 text-base">Content</Text>
```

### Responsive Design
Use tables for layout (email clients have limited flexbox support):

```typescript
import { Row, Column } from '@react-email/components';

<Row>
  <Column style={{ width: '50%' }}>Left</Column>
  <Column style={{ width: '50%' }}>Right</Column>
</Row>
```

### Images
Always use absolute URLs for images:

```typescript
import { Img } from '@react-email/components';

<Img
  src="https://yourdomain.com/logo.png"
  alt="Logo"
  width="120"
  height="40"
/>
```

### Preview Text
Always include preview text (shows in email client list view):

```typescript
<Preview>This text appears in the email preview</Preview>
```

## Available Components

From `@react-email/components`:
- `Html`, `Head`, `Preview`, `Body` - Structure
- `Container`, `Section`, `Row`, `Column` - Layout
- `Heading`, `Text` - Typography
- `Link`, `Button` - Interactions
- `Img` - Images
- `Hr` - Horizontal rule
- `Code`, `CodeInline`, `CodeBlock` - Code display

## Testing Emails

1. Start preview server: `bun --filter @workspace/emails dev`
2. Open http://localhost:3002
3. Navigate between templates in the sidebar
4. Test with different props using the preview panel

## Rules

- Always use inline styles
- Use tables for complex layouts
- Include preview text
- Test across email clients (Gmail, Outlook, Apple Mail)
- Keep images hosted on HTTPS URLs
- Don't use external CSS or stylesheets
- Pass dynamic values as props
