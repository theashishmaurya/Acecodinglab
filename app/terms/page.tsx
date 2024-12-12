'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { companyData, termsData } from './data';

// types.ts
export interface Section {
  id: string;
  title: string;
  content: SectionContent;
}

export interface SectionContent {
  mainText?: string[];
  subsections?: Subsection[];
  bulletPoints?: string[];
  numberedPoints?: string[];
}

export interface Subsection {
  title: string;
  content: string[];
}

// TableOfContents Component
const TableOfContents = ({
  sections,
  onSectionClick,
}: {
  sections: { id: string; title: string }[];
  onSectionClick: (id: string) => void;
}) => (
  <Card className="sticky top-8">
    <CardHeader>
      <CardTitle>Table of Contents</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        <div className="space-y-1">
          {sections.map(section => (
            <Button
              key={section.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSectionClick(section.id)}
            >
              {section.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

// Main Component
const TermsAndConditions = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block">
            <TableOfContents
              sections={termsData}
              onSectionClick={scrollToSection}
            />
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
              <p className="text-muted-foreground">
                Last updated {companyData.lastUpdated}
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="services" id="services">
                  <AccordionTrigger className="text-xl font-bold">
                    1. OUR SERVICES
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        The information provided when using the Services is not
                        intended for distribution to or use by any person or
                        entity in any jurisdiction or country where such
                        distribution or use would be contrary to law or
                        regulation or which would subject us to any registration
                        requirement within such jurisdiction or country.
                        Accordingly, those persons who choose to access the
                        Services from other locations do so on their own
                        initiative and are solely responsible for compliance
                        with local laws, if and to the extent local laws are
                        applicable.
                      </p>
                      <p className="text-muted-foreground">
                        The Services are not tailored to comply with
                        industry-specific regulations (Health Insurance
                        Portability and Accountability Act (HIPAA), Federal
                        Information Security Management Act (FISMA), etc.), so
                        if your interactions would be subjected to such laws,
                        you may not use the Services. You may not use the
                        Services in a way that would violate the
                        Gramm-Leach-Bliley Act (GLBA).
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ip" id="intellectual-property">
                  <AccordionTrigger className="text-xl font-bold">
                    2. INTELLECTUAL PROPERTY RIGHTS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">
                          Our intellectual property
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          We are the owner or the licensee of all intellectual
                          property rights in our Services, including all source
                          code, databases, functionality, software, website
                          designs, audio, video, text, photographs, and graphics
                          in the Services (collectively, the
                          &apos;Content&apos;), as well as the trademarks,
                          service marks, and logos contained therein (the
                          &apos;Marks&apos;).
                        </p>
                        <p className="text-muted-foreground mb-4">
                          Our Content and Marks are protected by copyright and
                          trademark laws (and various other intellectual
                          property rights and unfair competition laws) and
                          treaties in the United States and around the world.
                        </p>
                        <p className="text-muted-foreground">
                          The Content and Marks are provided in or through the
                          Services &apos;AS IS&apos; for your personal,
                          non-commercial use or internal business purpose only.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">
                          Your use of our Services
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Subject to your compliance with these Legal Terms,
                          including the &apos;PROHIBITED ACTIVITIES&apos;
                          section below, we grant you a non-exclusive,
                          non-transferable, revocable licence to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li>access the Services; and</li>
                          <li>
                            download or print a copy of any portion of the
                            Content to which you have properly gained access
                          </li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                          solely for your personal, non-commercial use or
                          internal business purpose.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="user-reps" id="user-representations">
                  <AccordionTrigger className="text-xl font-bold">
                    3. USER REPRESENTATIONS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        By using the Services, you represent and warrant that:
                      </p>
                      <ul className="list-decimal pl-6 text-muted-foreground space-y-2">
                        <li>
                          All registration information you submit will be true,
                          accurate, current, and complete;
                        </li>
                        <li>
                          You will maintain the accuracy of such information and
                          promptly update such registration information as
                          necessary;
                        </li>
                        <li>
                          you have the legal capacity and you agree to comply
                          with these Legal Terms;
                        </li>
                        <li>
                          You are not a minor in the jurisdiction in which you
                          reside, or if a minor, you have received parental
                          permission to use the Services;
                        </li>
                        <li>
                          You will not access the Services through automated or
                          non-human means, whether through a bot, script or
                          otherwise;
                        </li>
                        <li>
                          you will not use the Services for any illegal or
                          unauthorised purpose;
                        </li>
                        <li>
                          your use of the Services will not violate any
                          applicable law or regulation.
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="user-registration" id="user-registration">
                  <AccordionTrigger className="text-xl font-bold">
                    4. USER REGISTRATION
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        You may be required to register to use the Services. You
                        agree to keep your password confidential and will be
                        responsible for all use of your account and password. We
                        reserve the right to remove, reclaim, or change a
                        username you select if we determine, in our sole
                        discretion, that such username is inappropriate,
                        obscene, or otherwise objectionable.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="purchases" id="purchases">
                  <AccordionTrigger className="text-xl font-bold">
                    5. PURCHASES AND PAYMENT
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        We accept the following forms of payment:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Visa</li>
                        <li>Mastercard</li>
                        <li>American Express</li>
                        <li>Discover</li>
                      </ul>
                      <div>
                        <h3 className="font-semibold mb-2">Purchase Terms</h3>
                        <p className="text-muted-foreground mb-4">
                          You agree to provide current, complete, and accurate
                          purchase and account information for all purchases
                          made via the Services. You further agree to promptly
                          update account and payment information, including
                          email address, payment method, and payment card
                          expiration date, so that we can complete your
                          transactions and contact you as needed. Sales tax will
                          be added to the price of purchases as deemed required
                          by us. We may change prices at any time. All payments
                          shall be in US dollars.
                        </p>
                        <p className="text-muted-foreground">
                          You agree to pay all charges at the prices then in
                          effect for your purchases and any applicable shipping
                          fees, and you authorise us to charge your chosen
                          payment provider for any such amounts upon placing
                          your order. We reserve the right to correct any errors
                          or mistakes in pricing, even if we have already
                          requested or received payment.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="subscriptions" id="subscriptions">
                  <AccordionTrigger className="text-xl font-bold">
                    6. SUBSCRIPTIONS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">
                          Billing and Renewal
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Your subscription will continue and automatically
                          renew unless cancelled. You consent to our charging
                          your payment method on a recurring basis without
                          requiring your prior approval for each recurring
                          charge, until such time as you cancel the applicable
                          order. The length of your billing cycle will depend on
                          the type of subscription plan you choose when you
                          subscribed to the Services.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Cancellation</h3>
                        <p className="text-muted-foreground mb-4">
                          You can cancel your subscription at any time by
                          logging into your account. Your cancellation will take
                          effect at the end of the current paid term. If you
                          have any questions or are unsatisfied with our
                          Services, please email us at hi@bytegrove.in.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Fee Changes</h3>
                        <p className="text-muted-foreground">
                          We may, from time to time, make changes to the
                          subscription fee and will communicate any price
                          changes to you in accordance with applicable law.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prohibited" id="prohibited-activities">
                  <AccordionTrigger className="text-xl font-bold">
                    7. PROHIBITED ACTIVITIES
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        You may not access or use the Services for any purpose
                        other than that for which we make the Services
                        available. The Services may not be used in connection
                        with any commercial endeavours except those that are
                        specifically endorsed or approved by us.
                      </p>
                      <div>
                        <p className="text-muted-foreground mb-4">
                          As a user of the Services, you agree not to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                          <li>
                            Systematically retrieve data or other content from
                            the Services to create or compile, directly or
                            indirectly, a collection, compilation, database, or
                            directory without written permission from us.
                          </li>
                          <li>
                            Trick, defraud, or mislead us and other users,
                            especially in any attempt to learn sensitive account
                            information such as user passwords.
                          </li>
                          <li>
                            Circumvent, disable, or otherwise interfere with
                            security-related features of the Services.
                          </li>
                          <li>
                            Disparage, tarnish, or otherwise harm, in our
                            opinion, us and/or the Services.
                          </li>
                          <li>
                            Use any information obtained from the Services in
                            order to harass, abuse, or harm another person.
                          </li>
                          <li>
                            Make improper use of our support services or submit
                            false reports of abuse or misconduct.
                          </li>
                          <li>
                            Use the Services in a manner inconsistent with any
                            applicable laws or regulations.
                          </li>
                          <li>
                            Engage in unauthorized framing of or linking to the
                            Services.
                          </li>
                          <li>
                            Upload or transmit (or attempt to upload or to
                            transmit) viruses, Trojan horses, or other material
                            that interferes with any party&apos;s uninterrupted
                            use and enjoyment of the Services.
                          </li>
                          <li>
                            Interfere with, disrupt, or create an undue burden
                            on the Services or the networks or services
                            connected to the Services.
                          </li>
                          <li>
                            Harass, annoy, intimidate, or threaten any of our
                            employees or agents engaged in providing any portion
                            of the Services to you.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ugc" id="user-generated-contributions">
                  <AccordionTrigger className="text-xl font-bold">
                    8. USER GENERATED CONTRIBUTIONS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        The Services may invite you to chat, contribute to, or
                        participate in blogs, message boards, online forums, and
                        other functionality, and may provide you with the
                        opportunity to create, submit, post, display, transmit,
                        perform, publish, distribute, or broadcast content and
                        materials to us or on the Services, including but not
                        limited to text, writings, video, audio, photographs,
                        graphics, comments, suggestions, or personal information
                        or other material (collectively,
                        &apos;Contributions&apos;).
                      </p>
                      <p className="text-muted-foreground">
                        When you create or make available any Contributions, you
                        thereby represent and warrant that:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>
                          The creation, distribution, transmission, public
                          display, or performance, and the accessing,
                          downloading, or copying of your Contributions do not
                          and will not infringe the proprietary rights of any
                          third party.
                        </li>
                        <li>
                          Your Contributions are not false, inaccurate, or
                          misleading.
                        </li>
                        <li>
                          Your Contributions are not unsolicited or unauthorized
                          advertising, promotional materials, pyramid schemes,
                          chain letters, spam, mass mailings, or other forms of
                          solicitation.
                        </li>
                        <li>
                          Your Contributions do not violate any applicable law,
                          regulation, or rule.
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="license" id="contribution-license">
                  <AccordionTrigger className="text-xl font-bold">
                    9. CONTRIBUTION LICENSE
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        By posting your Contributions to any part of the
                        Services or making Contributions accessible to the
                        Services by linking your account from the Services to
                        any of your social networking accounts, you
                        automatically grant, and you represent and warrant that
                        you have the right to grant, to us an unrestricted,
                        unlimited, irrevocable, perpetual, non-exclusive,
                        transferable, royalty-free, fully-paid, worldwide right,
                        and licence to:
                      </p>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>
                          Host, use, copy, reproduce, disclose, sell, resell,
                          publish, broadcast, retitle, archive, store, cache,
                          publicly perform, publicly display, reformat,
                          translate, transmit, excerpt (in whole or in part),
                          and distribute such Contributions
                        </li>
                        <li>
                          Prepare derivative works of, or incorporate into other
                          works, such Contributions
                        </li>
                        <li>
                          Grant and authorize sublicenses of the foregoing
                        </li>
                      </ul>
                      <p className="text-muted-foreground mt-4">
                        The use and distribution may occur in any media formats
                        and through any media channels.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="social-media" id="social-media">
                  <AccordionTrigger className="text-xl font-bold">
                    10. SOCIAL MEDIA
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        As part of the functionality of the Services, you may
                        link your account with online accounts you have with
                        third-party service providers (each such account, a
                        &apos;Third-Party Account&apos;) by either:
                      </p>
                      <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                        <li>
                          Providing your Third-Party Account login information
                          through the Services; or
                        </li>
                        <li>
                          Allowing us to access your Third-Party Account, as is
                          permitted under the applicable terms and conditions
                          that govern your use of each Third-Party Account.
                        </li>
                      </ol>
                      <div className="bg-muted p-4 rounded-lg mt-4">
                        <p className="text-muted-foreground font-medium">
                          PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE
                          THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR
                          THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR
                          AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="management" id="services-management">
                  <AccordionTrigger className="text-xl font-bold">
                    11. SERVICES MANAGEMENT
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        We reserve the right, but not the obligation, to:
                      </p>
                      <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                        <li>
                          Monitor the Services for violations of these Legal
                          Terms
                        </li>
                        <li>
                          Take appropriate legal action against anyone who, in
                          our sole discretion, violates the law or these Legal
                          Terms
                        </li>
                        <li>
                          Refuse, restrict access to, limit the availability of,
                          or disable any of your Contributions or any portion
                          thereof
                        </li>
                        <li>
                          Remove from the Services or otherwise disable all
                          files and content that are excessive in size or are in
                          any way burdensome to our systems
                        </li>
                        <li>
                          Otherwise manage the Services in a manner designed to
                          protect our rights and property and to facilitate the
                          proper functioning of the Services
                        </li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="privacy" id="privacy-policy">
                  <AccordionTrigger className="text-xl font-bold">
                    12. PRIVACY POLICY
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        We care about data privacy and security. By using the
                        Services, you agree to be bound by our Privacy Policy
                        posted on the Services, which is incorporated into these
                        Legal Terms. Please be advised the Services are hosted
                        in India. If you access the Services from any other
                        region of the world with laws or other requirements
                        governing personal data collection, use, or disclosure
                        that differ from applicable laws in India, then through
                        your continued use of the Services, you are transferring
                        your data to India, and you expressly consent to have
                        your data transferred to and processed in India.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="copyright" id="copyright-infringements">
                  <AccordionTrigger className="text-xl font-bold">
                    13. COPYRIGHT INFRINGEMENTS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        We respect the intellectual property rights of others.
                        If you believe that any material available on or through
                        the Services infringes upon any copyright you own or
                        control, please immediately notify us using the contact
                        information provided below (a &apos;Notification&apos;).
                        A copy of your Notification will be sent to the person
                        who posted or stored the material addressed in the
                        Notification.
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-muted-foreground">
                          Please be advised that pursuant to applicable law you
                          may be held liable for damages if you make material
                          misrepresentations in a Notification. Thus, if you are
                          not sure that material located on or linked to by the
                          Services infringes your copyright, you should consider
                          first contacting an attorney.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="termination" id="term-and-termination">
                  <AccordionTrigger className="text-xl font-bold">
                    14. TERM AND TERMINATION
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        These Legal Terms shall remain in full force and effect
                        while you use the Services.
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-muted-foreground font-medium">
                          WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL
                          TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION
                          AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND
                          USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP
                          ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO
                          REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY
                          REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN
                          THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR
                          REGULATION.
                        </p>
                      </div>
                      <p className="text-muted-foreground">
                        If we terminate or suspend your account for any reason,
                        you are prohibited from registering and creating a new
                        account under your name, a fake or borrowed name, or the
                        name of any third party, even if you may be acting on
                        behalf of the third party.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="modifications"
                  id="modifications-interruptions"
                >
                  <AccordionTrigger className="text-xl font-bold">
                    15. MODIFICATIONS AND INTERRUPTIONS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        We reserve the right to change, modify, or remove the
                        contents of the Services at any time or for any reason
                        at our sole discretion without notice. However, we have
                        no obligation to update any information on our Services.
                        We will not be liable to you or any third party for any
                        modification, price change, suspension, or
                        discontinuance of the Services.
                      </p>
                      <p className="text-muted-foreground">
                        We cannot guarantee the Services will be available at
                        all times. We may experience hardware, software, or
                        other problems or need to perform maintenance related to
                        the Services, resulting in interruptions, delays, or
                        errors. We reserve the right to change, revise, update,
                        suspend, discontinue, or otherwise modify the Services
                        at any time or for any reason without notice to you. You
                        agree that we have no liability whatsoever for any loss,
                        damage, or inconvenience caused by your inability to
                        access or use the Services during any downtime or
                        discontinuance of the Services.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="law" id="governing-law">
                  <AccordionTrigger className="text-xl font-bold">
                    16. GOVERNING LAW
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        These Legal Terms shall be governed by and defined
                        following the laws of India. Bytegrove technology
                        Private limited and yourself irrevocably consent that
                        the courts of India shall have exclusive jurisdiction to
                        resolve any dispute which may arise in connection with
                        these Legal Terms.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="disputes" id="dispute-resolution">
                  <AccordionTrigger className="text-xl font-bold">
                    17. DISPUTE RESOLUTION
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">
                          Binding Arbitration
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Any dispute arising out of or in connection with these
                          Legal Terms, including any question regarding its
                          existence, validity, or termination, shall be referred
                          to and finally resolved by the International
                          Commercial Arbitration Court under the European
                          Arbitration Chamber according to the Rules of this
                          ICAC, which, as a result of referring to it, is
                          considered as the part of this clause.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Restrictions</h3>
                        <p className="text-muted-foreground">
                          The Parties agree that any arbitration shall be
                          limited to the Dispute between the Parties
                          individually. To the full extent permitted by law:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                          <li>
                            No arbitration shall be joined with any other
                            proceeding
                          </li>
                          <li>
                            There is no right or authority for any Dispute to be
                            arbitrated on a class-action basis
                          </li>
                          <li>
                            There is no right or authority for any Dispute to be
                            brought in a purported representative capacity
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="corrections" id="corrections">
                  <AccordionTrigger className="text-xl font-bold">
                    18. CORRECTIONS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground">
                        There may be information on the Services that contains
                        typographical errors, inaccuracies, or omissions,
                        including descriptions, pricing, availability, and
                        various other information. We reserve the right to
                        correct any errors, inaccuracies, or omissions and to
                        change or update the information on the Services at any
                        time, without prior notice.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="disclaimer" id="disclaimer">
                  <AccordionTrigger className="text-xl font-bold">
                    19. DISCLAIMER
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div className="bg-muted p-6 rounded-lg text-muted-foreground">
                        <p className="font-semibold mb-4">
                          THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE
                          BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE
                          AT YOUR SOLE RISK.
                        </p>
                        <p className="mb-4">
                          TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM
                          ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH
                          THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT
                          LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
                          FITNESS FOR A PARTICULAR PURPOSE, AND
                          NON-INFRINGEMENT.
                        </p>
                        <p>
                          WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE
                          ACCURACY OR COMPLETENESS OF THE SERVICES&apos; CONTENT
                          OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS
                          LINKED TO THE SERVICES.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="liability" id="limitations-of-liability">
                  <AccordionTrigger className="text-xl font-bold">
                    20. LIMITATIONS OF LIABILITY
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div className="bg-muted p-6 rounded-lg text-muted-foreground">
                        <p className="font-semibold mb-4">
                          IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR
                          AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY
                          DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY,
                          INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES.
                        </p>
                        <p>
                          NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED
                          HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER
                          AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL
                          TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO
                          US DURING THE THREE (3) MONTH PERIOD PRIOR TO ANY
                          CAUSE OF ACTION ARISING.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="indemnification" id="indemnification">
                  <AccordionTrigger className="text-xl font-bold">
                    21. INDEMNIFICATION
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground mb-4">
                        You agree to defend, indemnify, and hold us harmless,
                        including our subsidiaries, affiliates, and all of our
                        respective officers, agents, partners, and employees,
                        from and against any loss, damage, liability, claim, or
                        demand, including reasonable attorneys’ fees and
                        expenses, made by any third party due to or arising out
                        of: (1) your Contributions; (2) use of the Services; (3)
                        breach of these Legal Terms; (4) any breach of your
                        representations and warranties set forth in these Legal
                        Terms; (5) your violation of the rights of a third
                        party, including but not limited to intellectual
                        property rights; or (6) any overt harmful act toward any
                        other user of the Services with whom you connected via
                        the Services. Notwithstanding the foregoing, we reserve
                        the right, at your expense, to assume the exclusive
                        defence and control of any matter for which you are
                        required to indemnify us, and you agree to cooperate, at
                        your expense, with our defence of such claims. We will
                        use reasonable efforts to notify you of any such claim,
                        action, or proceeding which is subject to this
                        indemnification upon becoming aware of it.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="user-data" id="user-data">
                  <AccordionTrigger className="text-xl font-bold">
                    22. USER DATA
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground mb-4">
                        We will maintain certain data that you transmit to the
                        Services for the purpose of managing the performance of
                        the Services, as well as data relating to your use of
                        the Services. Although we perform regular routine
                        backups of data, you are solely responsible for all data
                        that you transmit or that relates to any activity you
                        have undertaken using the Services. You agree that we
                        shall have no liability to you for any loss or
                        corruption of any such data, and you hereby waive any
                        right of action against us arising from any such loss or
                        corruption of such data.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="electronic-communications"
                  id="electronic-communications"
                >
                  <AccordionTrigger className="text-xl font-bold">
                    23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground mb-4">
                        Visiting the Services, sending us emails, and completing
                        online forms constitute electronic communications. You
                        consent to receive electronic communications, and you
                        agree that all agreements, notices, disclosures, and
                        other communications we provide to you electronically,
                        via email and on the Services, satisfy any legal
                        requirement that such communication be in writing. YOU
                        HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES,
                        CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC
                        DELIVERY OF NOTICES, POLICIES, AND RECORDS OF
                        TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE
                        SERVICES. You hereby waive any rights or requirements
                        under any statutes, regulations, rules, ordinances, or
                        other laws in any jurisdiction which require an original
                        signature or delivery or retention of non-electronic
                        records, or to payments or the granting of credits by
                        any means other than electronic means.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="california-residents"
                  id="california-residents"
                >
                  <AccordionTrigger className="text-xl font-bold">
                    24. CALIFORNIA USERS AND RESIDENTS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground mb-4">
                        If any complaint with us is not satisfactorily resolved,
                        you can contact the Complaint Assistance Unit of the
                        Division of Consumer Services of the California
                        Department of Consumer Affairs in writing at 1625 North
                        Market Blvd., Suite N 112, Sacramento, California 95834
                        or by telephone at (800) 952-5210 or (916) 445-1254.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="miscellaneous" id="miscellaneous">
                  <AccordionTrigger className="text-xl font-bold">
                    25. MISCELLANEOUS
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground mb-4">
                        These Legal Terms and any policies or operating rules
                        posted by us on the Services or in respect to the
                        Services constitute the entire agreement and
                        understanding between you and us. Our failure to
                        exercise or enforce any right or provision of these
                        Legal Terms shall not operate as a waiver of such right
                        or provision. These Legal Terms operate to the fullest
                        extent permissible by law. We may assign any or all of
                        our rights and obligations to others at any time. We
                        shall not be responsible or liable for any loss, damage,
                        delay, or failure to act caused by any cause beyond our
                        reasonable control. If any provision or part of a
                        provision of these Legal Terms is determined to be
                        unlawful, void, or unenforceable, that provision or part
                        of the provision is deemed severable from these Legal
                        Terms and does not affect the validity and
                        enforceability of any remaining provisions. There is no
                        joint venture, partnership, employment or agency
                        relationship created between you and us as a result of
                        these Legal Terms or use of the Services. You agree that
                        these Legal Terms will not be construed against us by
                        virtue of having drafted them. You hereby waive any and
                        all defences you may have based on the electronic form
                        of these Legal Terms and the lack of signing by the
                        parties hereto to execute these Legal Terms.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contact-us" id="contact-us">
                  <AccordionTrigger className="text-xl font-bold">
                    26. CONTACT US
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground mb-4">
                        In order to resolve a complaint regarding the Services
                        or to receive further information regarding use of the
                        Services, please contact us at:
                      </p>
                      <address className="text-muted-foreground">
                        Bytegrove technology Private limited<br></br>
                        3/34, Vineet khand, Gomti Nagar<br></br>
                        Lucknow, Uttar Pradesh 226010<br></br>
                        India<br></br>
                        Phone: 8687140748 <br></br>
                        Email: hi@bytegrove.in
                      </address>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
