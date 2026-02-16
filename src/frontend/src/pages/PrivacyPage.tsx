import { EditorialSection, EditorialHeadline, EditorialDivider } from '../components/layout/EditorialSection';

export default function PrivacyPage() {
  return (
    <EditorialSection>
      <div className="mx-auto max-w-3xl">
        <EditorialHeadline className="mb-8">Privacy Policy</EditorialHeadline>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Information We Collect</h2>
            <p>
              When you use Velvet Companions, we collect minimal information necessary to provide our services. 
              This includes your Internet Identity principal (a unique identifier), your chosen display name, 
              and any booking request details you submit.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">How We Use Your Information</h2>
            <p>
              Your information is used solely to facilitate companionship bookings and manage your account. 
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Data Storage</h2>
            <p>
              All data is stored securely on the Internet Computer blockchain. Your Internet Identity provides 
              cryptographic authentication without requiring traditional passwords or email addresses.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Communication</h2>
            <p>
              We do not provide real-time messaging or chat features. All communication regarding bookings 
              is handled through status updates visible in your account. We do not send emails or SMS messages.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Cookies & Tracking</h2>
            <p>
              We use local storage to remember your age verification confirmation. We do not use third-party 
              tracking cookies or analytics services that collect personal information.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Your Rights</h2>
            <p>
              You have the right to access, modify, or delete your personal information at any time. 
              Contact our support team if you wish to exercise these rights.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Security</h2>
            <p>
              We implement industry-standard security measures to protect your information. However, no 
              method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Contact</h2>
            <p>
              If you have questions about this privacy policy or how we handle your data, please contact 
              our support team through the platform.
            </p>
          </section>

          <div className="mt-8 rounded-lg bg-muted p-6">
            <p className="text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </EditorialSection>
  );
}
