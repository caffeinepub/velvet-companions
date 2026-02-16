import { EditorialSection, EditorialHeadline, EditorialDivider } from '../components/layout/EditorialSection';

export default function TermsDisclaimerPage() {
  return (
    <EditorialSection>
      <div className="mx-auto max-w-3xl">
        <EditorialHeadline className="mb-8">Terms & Disclaimer</EditorialHeadline>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Age Requirement</h2>
            <p>
              This website and all services offered are strictly for individuals 18 years of age or older. 
              By accessing this site, you confirm that you are of legal age in your jurisdiction.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Legal Companionship Services</h2>
            <p>
              Velvet Companions provides legal adult companionship services only. All services are for 
              companionship, social events, and time spent together. We do not offer, solicit, or facilitate 
              any illegal services.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Jurisdiction & Legality</h2>
            <p>
              Laws regarding adult companionship services vary by jurisdiction. It is your responsibility 
              to ensure that using our services is legal in your location. We do not provide legal advice 
              and recommend consulting with a legal professional if you have questions about local laws.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">No Illegal Solicitation</h2>
            <p>
              This platform does not solicit, offer, or facilitate any illegal activities. Any attempt to 
              use our services for illegal purposes will result in immediate termination of access and may 
              be reported to appropriate authorities.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Booking & Payment</h2>
            <p>
              Booking requests submitted through our platform are subject to availability and approval. 
              Payment terms and arrangements are handled separately and communicated directly between parties. 
              All financial transactions are the responsibility of the individuals involved.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Disclaimer of Liability</h2>
            <p>
              Velvet Companions acts as a platform connecting individuals. We are not responsible for the 
              actions, conduct, or services provided by companions or clients. All interactions and 
              arrangements are at your own risk and discretion.
            </p>
          </section>

          <EditorialDivider />

          <section>
            <h2 className="mb-3 font-serif text-2xl font-bold text-foreground">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the platform 
              constitutes acceptance of any changes.
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
