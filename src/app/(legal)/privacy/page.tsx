import {
  List,
  Paragraph,
  Section,
  SectionHeader,
  Table,
} from "@/components/legal";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";
export const generateMetadata = (): Metadata => {
  const description =
    "Review the Privacy Policy for TL;DR Terms. Learn how we handle your data, protect your privacy, and comply with legal regulations.";
  return {
    title: "Privacy Policy",
    description,
    openGraph: {
      title: "Privacy Policy",
      description,
      url: "https://tldrterms.app/privacy",
    },
    twitter: {
      title: "Privacy Policy",
      description,
    },
    alternates: {
      canonical: "https://tldrterms.app/privacy",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
};

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <div className="text-sm text-muted-foreground mb-12">
        Last updated: 05/20/2025
      </div>
      <div className="space-y-16">
        <Section>
          <SectionHeader>1. Who we are</SectionHeader>
          <Paragraph>
            <strong>TL;DR Terms</strong> (“<strong>we</strong>,” “
            <strong>our</strong>,” “<strong>us</strong>”) is a personal project
            operated by an individual based in California, USA. We provide a web
            application that summarizes and scores publicly available Terms &
            Conditions and Privacy Policies. For privacy inquiries, reach us at{" "}
            <Link
              className="underline underline-offset-4"
              href="mailto:help@tldrterms.app"
            >
              help@tldrterms.app
            </Link>
            .
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>
            2. Quick summary (for humans in a hurry)
          </SectionHeader>
          <Table
            columns={[
              {
                title: "Topic",
                key: "topic",
              },
              {
                title: "What we actually do",
                key: "do",
              },
            ]}
            data={[
              {
                topic: "Data collected",
                do: "E-mail address (plus name/avatar if provided by OAuth) and strictly necessary authentication cookies. No analytics, ads, or tracking cookies.",
              },
              {
                topic: "Why",
                do: "To sign you in, run the analysis you request, save your results, and send essential account e-mails.",
              },
              {
                topic: "Sharing",
                do: "Only with the cloud services that power the app (Supabase, OpenAI, Vercel, Cloudflare). We never sell or rent data.",
              },
              {
                topic: "Your rights",
                do: "Access, correct, delete, export, or object at any time—just e-mail us.",
              },
              {
                topic: "Retention",
                do: "All personal data and stored analyses are deleted immediately when you delete your account.",
              },
              {
                topic: "Security",
                do: "TLS, encryption at rest, role-based access, least-privilege admin accounts.",
              },
              {
                topic: "Kids",
                do: "Under-13s may use the service only with parental consent.",
              },
            ]}
          />
        </Section>
        <Section>
          <SectionHeader>3. Data we collect and why</SectionHeader>
          <div className="overflow-x-auto">
            <Table
              columns={[
                {
                  title: "Category",
                  key: "category",
                },
                {
                  title: "What we collect",
                  key: "collect",
                  className: "min-w-[15rem]",
                },
                {
                  title: "Purpose",
                  key: "purpose",
                  className: "min-w-[15rem]",
                },
                {
                  title: "Legal basis (GDPR)",
                  key: "basis",
                  className: "min-w-[10rem] md:min-w-[12rem]",
                },
              ]}
              data={[
                {
                  category: "Account data",
                  collect: [
                    "E-mail address (mandatory)",
                    "Name & avatar (only if sent by your OAuth provider)",
                  ],
                  purpose:
                    "Create & maintain your account; authenticate you; send required transactional e-mails",
                  basis: "Contract (Art. 6 (1)(b))",
                },
                {
                  category: "Authentication cookies",
                  collect: "Supabase session token",
                  purpose: "Keep you logged in securely",
                  basis: "Contract",
                },
                {
                  category: "Content for analysis",
                  collect:
                    "Text we retrieve from the URL you provide or, if retrieval fails, text you paste manually",
                  purpose:
                    "Generate the AI analysis you request and display past results",
                  basis: "Contract",
                },
                {
                  category: "IP addresses (passive)",
                  collect: "Logged by Supabase & Cloudflare in security logs",
                  purpose: "Detect fraud and ensure service integrity",
                  basis: "Legitimate interest (Art. 6 (1)(f))",
                },
                {
                  category: "Device & browser metadata",
                  collect:
                    "Browser user-agent, operating system, device type (sent automatically by your browser)",
                  purpose:
                    "Debug service issues, ensure compatibility, and help prevent automated abuse",
                  basis: "Legitimate interest (Art. 6 (1)(f))",
                },
              ]}
            />
          </div>
          <Paragraph>
            <strong>Data-minimization pledge:</strong> We collect only the data
            listed above—nothing else. Each item is strictly needed to run TL;DR
            Terms or keep it safe. We never collect sensitive categories such as
            payment details, precise geolocation, or advertising IDs.
          </Paragraph>
          <Paragraph>
            <strong>How we collect:</strong> (1)&nbsp;<em>Directly from you</em>
            when you sign up or submit a URL; (2)&nbsp;<em>Automatically</em>
            via essential cookies and standard HTTP headers; and (3)&nbsp;
            <em>Passively</em> in security logs created by our cloud providers.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>4. How we use your data</SectionHeader>
          <List type="decimal">
            <li>
              <strong>Run the service —</strong> sign you in, remember your
              session, and create your requested analysis.
            </li>
            <li>
              <strong>Communicate with you —</strong> send verification,
              password-reset, and critical service emails <em>only</em>.
            </li>
            <li>
              <strong>Protect the service —</strong> stop fraud, detect abuse,
              and secure our infrastructure.
            </li>
            <li>
              <strong>Improve reliability —</strong> debug crashes and ensure
              the site works on your browser/device.
            </li>
          </List>
          <Paragraph>
            We <strong>never</strong> use your data for marketing, profiling, or
            advertising.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>5. Cookies & similar technologies</SectionHeader>
          <Paragraph>
            We use one first-party <strong>session cookie</strong> from Supabase
            that is essential for secure authentication. It expires
            automatically when you log out or after 7 days of inactivity. We do
            not set any analytics, advertising, or preference cookies.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>6. Sharing and disclosure</SectionHeader>
          <Paragraph>
            We share personal data <strong>only</strong> with these service
            providers, strictly for the purposes described:
          </Paragraph>
          <div className="overflow-x-auto">
            <Table
              columns={[
                {
                  title: "Provider",
                  key: "provider",
                },
                {
                  title: "Role",
                  key: "role",
                },
                {
                  title: "Data shared",
                  key: "data",
                  className: "min-w-[15rem]",
                },
                {
                  title: "Safeguards",
                  key: "safeguards",
                },
              ]}
              data={[
                {
                  provider: "Supabase (USA/EU)",
                  role: "Authentication, database, storage",
                  data: "Account data, session cookies, submitted content, analysis results",
                  safeguards: "SCCs, ISO 27001",
                },
                {
                  provider: "OpenAI (USA)",
                  role: "Large-language-model processing",
                  data: "Extracted text (no account data)",
                  safeguards: "SCCs, internal access controls",
                },
                {
                  provider: "Vercel (USA/EU)",
                  role: "Hosting & deployment",
                  data: "Encrypted database connections only",
                  safeguards: "SCCs, ISO 27001",
                },
                {
                  provider: "Cloudflare (Global CDN)",
                  role: "DNS, TLS, DDoS protection",
                  data: "IP addresses in edge logs",
                  safeguards: "SCCs, SOC 2",
                },
              ]}
            />
          </div>
          <h3 id="sharing-why" className="mt-8 mb-3 text-lg font-semibold">
            6.2 Why we share
          </h3>
          <Paragraph>
            We share data <em>only</em> so these partners can do the job you
            expect:
          </Paragraph>
          <List type="disc">
            <li>
              <strong>Supabase</strong> — authenticate you and store your
              account & submitted text.
            </li>
            <li>
              <strong>OpenAI</strong> — transform the text we fetch (or you
              paste) into an AI summary.
            </li>
            <li>
              <strong>Vercel</strong> — host the website and serve it quickly
              worldwide.
            </li>
            <li>
              <strong>Cloudflare</strong> — protect the site from attacks and
              deliver it via CDN.
            </li>
          </List>
          <Paragraph>
            They may <strong>not</strong> use your data for their own marketing
            or advertising.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>7. International transfers</SectionHeader>
          <Paragraph>
            Our providers may process data in the United States or other
            countries. When data originates from the EU/UK, transfers rely on
            <strong> Standard Contractual Clauses (SCCs)</strong> or equivalent
            legal safeguards. You can request a copy via{" "}
            <Link
              className="underline underline-offset-4"
              href="mailto:help@tldrterms.app"
            >
              help@tldrterms.app
            </Link>
            . We monitor legal developments and will pause transfers or add
            extra safeguards if SCCs are no longer considered adequate.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>8. Data retention</SectionHeader>
          <Table
            columns={[
              {
                title: "Data type",
                key: "type",
              },
              {
                title: "Retention period",
                key: "period",
              },
            ]}
            data={[
              {
                type: "Active accounts",
                period:
                  "We retain account data and analyses until you delete your account or 24 months of inactivity, whichever comes first.",
              },
              {
                type: "Deleted accounts",
                period:
                  "Erased immediately from live databases; encrypted backups purge automatically after 30 days.",
              },
              {
                type: "Server logs (IP addresses & metadata)",
                period:
                  "Kept for 30 days purely for security and troubleshooting, then deleted or fully anonymised.",
              },
              {
                type: "Technical backups",
                period:
                  "Encrypted daily; stored for 30 days before automatic deletion.",
              },
              {
                type: "Support emails",
                period:
                  "Kept for up to 12 months to resolve ongoing issues, then deleted.",
              },
            ]}
          />
        </Section>
        <Section>
          <SectionHeader>9. Security measures</SectionHeader>
          <List type="disc">
            <li>
              <strong>TLS 1.3</strong> for every connection
            </li>
            <li>
              <strong>AES-256 encryption at rest</strong> for databases and
              object storage
            </li>
            <li>
              <strong>Firewall & web-application firewall (WAF)</strong> on
              every edge location
            </li>
            <li>
              <strong>Two-factor authentication</strong> for all admin accounts
            </li>
            <li>
              <strong>Role-based access controls</strong> & least-privilege API
              keys
            </li>
            <li>
              <strong>Daily encrypted backups</strong> stored in a separate
              region (kept 30 days)
            </li>
            <li>
              <strong>Annual third-party penetration tests</strong> &
              coordinated bug-bounty program
            </li>
            <li>Continuous dependency monitoring & prompt patching</li>
          </List>
          <Paragraph>
            While we work hard to protect your data, no online service can
            guarantee absolute security. Use a strong, unique password.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>10. Your privacy rights</SectionHeader>
          <Paragraph>
            You have full control of your data. Here’s how to act:
          </Paragraph>
          <List type="decimal">
            <li>
              <strong>Access & portability —</strong> Email{" "}
              <Link
                className="underline underline-offset-4"
                href="mailto:help@tldrterms.app"
              >
                help@tldrterms.app
              </Link>{" "}
              with subject line “Data Access.” We’ll send you a portable JSON
              export within 7 days.
            </li>
            <li>
              <strong>Correction —</strong> Use the account settings page to
              update your email/name, or email us with “Correction Request.” We
              update within 7 days.
            </li>
            <li>
              <strong>Deletion —</strong> Click “Delete account” in settings or
              email “Delete My Data.” We’ll wipe live records instantly and
              purge backups within 30 days.
            </li>
            <li>
              <strong>Restrict/Object —</strong> Email “Restriction Request” to
              pause processing while we investigate.
            </li>
          </List>
          <Paragraph>
            We never send marketing emails, so there’s nothing to opt-out of.
            Transactional emails (security, password reset) are essential and
            cannot be disabled.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>11. Children’s privacy</SectionHeader>
          <Paragraph>
            TL;DR Terms is not aimed at kids, but young programmers might still
            visit.{" "}
            <strong>
              If you’re under 13, you must have a parent or guardian create and
              manage the account.
            </strong>{" "}
            We never ask for more than an email. If we learn we’ve stored
            personal info from a child without consent, we delete it within 48
            hours. Parents can email&nbsp;
            <Link
              className="underline underline-offset-4"
              href="mailto:help@tldrterms.app"
            >
              help@tldrterms.app
            </Link>
            &nbsp;any time to review or erase a child’s data.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>12. Changes to this Privacy Policy</SectionHeader>
          <Paragraph>
            We sometimes update this policy to cover new features or changes in
            the law.{" "}
            <strong>
              We’ll email every account holder and show an in-app banner at
              least 30 days before a material change takes effect.
            </strong>{" "}
            The effective date at the top tells you which version you’re
            reading. If you don’t agree, simply delete your account before the
            new version starts.
          </Paragraph>
        </Section>
        <Section>
          <SectionHeader>13. Contact us</SectionHeader>
          <Paragraph>
            For privacy inquiries, reach us at{" "}
            <Link
              className="underline underline-offset-4"
              href="mailto:help@tldrterms.app"
            >
              help@tldrterms.app
            </Link>
            .
            <br />
            We strive to resolve privacy issues promptly and transparently.
          </Paragraph>
        </Section>
      </div>
    </article>
  );
}
