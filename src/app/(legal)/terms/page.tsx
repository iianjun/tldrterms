import { List, Paragraph, Section, SectionHeader } from "@/components/legal";
import Link from "next/link";
export default function TermsPage() {
  return (
    <main className="min-h-screen w-full">
      <div
        className="relative mx-auto w-full transition-all duration-200"
        style={{ width: "min(100%, 3680px)", maxWidth: "100vw" }}
      >
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
            <article className="prose dark:prose-invert max-w-none">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                Terms of Service
              </h1>
              <div className="text-sm text-muted-foreground mb-12">
                Last updated: 05/20/2025
              </div>
              <div className="space-y-16">
                <Section>
                  <SectionHeader>1. Introduction</SectionHeader>
                  <Paragraph>
                    Welcome to <strong>TL;DR Terms</strong> (“
                    <strong>Service</strong>,” “<strong>we</strong>,” “
                    <strong>our</strong>,” “<strong>us</strong>”). These Terms &
                    Conditions (“<strong>Terms</strong>”) form a legally binding
                    agreement between you (“<strong>you</strong>,” “
                    <strong>your</strong>,” or “<strong>User</strong>”) and the
                    individual operating TL;DR Terms. By creating an account,
                    submitting any URL, or otherwise using the Service, you
                    agree to comply with and be bound by these Terms.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>2. Definitions</SectionHeader>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="bg-muted p-2 text-left border border-muted-foreground">
                          Term
                        </th>
                        <th className="bg-muted p-2 text-left border border-muted-foreground">
                          Meaning
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          <strong>Account</strong>
                        </td>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          The credentials you create through Supabase to access
                          TL;DR Terms.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          <strong>Content</strong>
                        </td>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          Any text, URL, or other material you submit to the
                          Service.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          <strong>Analysis</strong>
                        </td>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          AI-generated summaries, scores, and other output we
                          display.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          <strong>Service</strong>
                        </td>
                        <td className="p-2 border text-left border-muted-foreground text-muted-foreground">
                          The website, APIs, and related features provided under
                          the TL;DR Terms name.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Section>
                <Section>
                  <SectionHeader>3. Eligibility</SectionHeader>
                  <Paragraph>
                    The Service is open to users of all ages. If you are under
                    13 (or the age of digital consent in your country), you must
                    use the Service only with a parent or guardian’s permission.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>4. Account Registration</SectionHeader>
                  <Paragraph>
                    You must provide accurate information and keep it up to
                    date. You are responsible for all activity under your
                    Account. You may delete your Account at any time using the
                    in-app controls or by contacting us (see Section 18).
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>5. Description of the Service</SectionHeader>
                  <Paragraph>
                    TL;DR Terms lets you submit publicly available Terms &
                    Conditions (or similar legal pages) and receive an
                    AI-generated analysis and score. The Service is currently
                    offered
                    <strong>free of charge</strong>. We may introduce optional
                    paid features in the future with prior notice (see Section
                    8).
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>6. User Content & License</SectionHeader>
                  <List type="decimal">
                    <li>
                      <strong>Ownership.</strong> You retain all rights in any
                      URLs or other Content you submit.
                    </li>
                    <li>
                      <strong>License to Us.</strong> You grant us a
                      <em>non-exclusive, worldwide, royalty-free license</em> to
                      access, process, analyze, store, and display your
                      submitted Content solely to provide and improve the
                      Service.
                    </li>
                    <li>
                      <strong>Removal.</strong> You may delete your Content at
                      any time. We will remove or anonymize it within 30 days,
                      except where retention is legally required.
                    </li>
                  </List>
                </Section>
                <Section>
                  <SectionHeader>7. Acceptable Use</SectionHeader>
                  <Paragraph>
                    You agree <strong>not</strong> to:
                  </Paragraph>
                  <List type="disc">
                    <li>Submit Content you do not have a right to share;</li>
                    <li>
                      Upload malware or attempt to disrupt or overload the
                      Service;
                    </li>
                    <li>
                      Reverse-engineer, scrape, or re-sell our Analysis without
                      permission;
                    </li>
                    <li>Violate any applicable law or third-party right.</li>
                  </List>
                  <Paragraph>
                    We may suspend or terminate Accounts that breach this
                    Section.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>8. Fees & Payment</SectionHeader>
                  <Paragraph>
                    The core Service is free. If we introduce paid plans, we
                    will:
                  </Paragraph>
                  <List type="disc">
                    <li>
                      Post at least <strong>30 days’ advance notice</strong>;
                    </li>
                    <li>
                      Clearly list prices, billing intervals, and cancellation
                      steps; and
                    </li>
                    <li>
                      Honor a <strong>no-questions-asked refund</strong> for any
                      unused portion of a first subscription period.
                    </li>
                  </List>
                </Section>
                <Section>
                  <SectionHeader>9. Service Availability</SectionHeader>
                  <Paragraph>
                    The Service is provided <strong>“as-is”</strong> and
                    <strong>“as-available.”</strong> While we strive for high
                    uptime, we do <strong>not</strong> guarantee continuous
                    availability, error-free operation, or that results will be
                    accurate or complete.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>10. Changes to the Service</SectionHeader>
                  <Paragraph>
                    We may add, modify, or discontinue features. Material
                    changes will be announced 30 days in advance. If a change
                    materially diminishes your rights, you may terminate your
                    Account before the change takes effect and continue using
                    the existing version during the notice period.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>11. Termination</SectionHeader>
                  <List type="disc">
                    <li>
                      <strong>By You.</strong> Delete your Account at any time;
                      we will provide you with a one-click export of your past
                      Analyses.
                    </li>
                    <li>
                      <strong>By Us.</strong> We may terminate or suspend your
                      Account with <strong>14 days’ notice</strong> (or
                      immediately for material breach or legal requirement).
                    </li>
                    <li>
                      <strong>Post-Termination.</strong> When you delete your
                      Account, all associated personal data and Content are
                      permanently deleted immediately. We do not retain deleted
                      data unless required by law.
                    </li>
                  </List>
                </Section>
                <Section>
                  <SectionHeader>12. Disclaimers</SectionHeader>
                  <Paragraph>
                    We do <strong>not</strong> provide legal advice. Analyses
                    are automated predictions for informational purposes only;
                    always review the original legal documents and consult
                    qualified counsel where necessary. We warrant that the
                    Service will function as described, including processing
                    submitted URLs into AI-generated summaries. However, we do
                    not guarantee the accuracy or completeness of any analysis.
                    Except in cases of gross negligence or willful misconduct,
                    we disclaim all other warranties, including merchantability
                    and fitness for a particular purpose.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>13. Limitation of Liability</SectionHeader>
                  <Paragraph>
                    To the fullest extent permitted by law,
                    <strong>our total liability</strong> arising out of or
                    relating to the Service will{" "}
                    <strong>not exceed USD 1,000</strong> or the amount you paid
                    us in the 12 months before the claim (whichever is greater).
                    We are <strong>not</strong> liable for any indirect,
                    incidental, or consequential damages. This limitation does{" "}
                    <strong>not</strong> apply to liability arising from our
                    gross negligence, willful misconduct, or any matter that
                    cannot be excluded by law, including personal injury or
                    fraudulent misrepresentation.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>14. Indemnification</SectionHeader>
                  <Paragraph>
                    You agree to indemnify and hold us harmless{" "}
                    <strong>only</strong> to the extent that any claim, loss, or
                    damage arises from your violation of these Terms or your
                    unlawful use of the Service. This indemnity does{" "}
                    <strong>not</strong> apply to any claim resulting from our
                    own negligence, misconduct, or failure to comply with
                    applicable law.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>15. Dispute Resolution</SectionHeader>
                  <List type="decimal">
                    <li>
                      <strong>Small-Claims Court.</strong> Either party may
                      bring an eligible claim in small-claims court in the
                      county of the defendant’s residence or another mutually
                      agreed venue.
                    </li>
                    <li>
                      <strong>Class Actions Permitted.</strong> Users may pursue
                      class or collective actions where permitted by law.
                    </li>
                    <li>
                      <strong>Good-Faith Resolution.</strong> Before filing
                      suit, the parties agree to try to resolve disputes
                      informally for 30 days.
                    </li>
                  </List>
                </Section>
                <Section>
                  <SectionHeader>16. Governing Law & Venue</SectionHeader>
                  <Paragraph>
                    These Terms are governed by <strong>California law</strong>,
                    but you may bring actions in the courts of (a) your place of
                    residence, (b) San Francisco County, California,{" "}
                    <strong>or</strong> (c) any mutually convenient
                    jurisdiction.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>17. Changes to These Terms</SectionHeader>
                  <Paragraph>
                    We will post any update at least
                    <strong>30 days before it becomes effective</strong> and
                    email registered Users where possible. If you disagree, you
                    may terminate your Account before the effective date;
                    continued use after the date constitutes acceptance.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>18. Contact</SectionHeader>
                  <Paragraph>
                    Questions? Email{" "}
                    <Link
                      className="underline underline-offset-4"
                      href="mailto:help@tldrterms.app"
                    >
                      help@tldrterms.app
                    </Link>
                    . We aim to respond within 7 days.
                  </Paragraph>
                </Section>
                <Section>
                  <SectionHeader>19. Miscellaneous</SectionHeader>
                  <Paragraph>
                    If any provision is unenforceable, the remainder stays in
                    effect. Failure to enforce a right is not a waiver. You may
                    not assign these Terms without our consent; we may assign in
                    connection with a reorganization or sale of the Service with
                    notice to you.
                  </Paragraph>
                </Section>
                <Paragraph>
                  By using TL;DR Terms you acknowledge that you have read,
                  understood, and agree to these Terms.
                </Paragraph>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
