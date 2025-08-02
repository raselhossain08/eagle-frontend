"use client";
import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

interface DiamondContractProps {
  onContractSave?: (data: ContractData) => void;
  isModal?: boolean;
}

export default function DiamondContract({
  onContractSave,
  isModal = false,
}: DiamondContractProps) {
  const [clientData, setClientData] = useState<ContractData | null>(null);

  const handleContractSave = (data: ContractData) => {
    setClientData(data);
    onContractSave?.(data);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-5">
      <h2 className="font-bold text-lg">Eagle Investors LLC</h2>
      <h2 className="font-bold text-lg">
        Advisory Contract – Diamond Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">
        Diamond Advisory Contract
      </h1>

      <div className="flex items-end font-medium font-16 mb-4 flex-wrap">
        This contract is made and entered into as of the
        <span className="border-b w-64 mx-1">
          {clientData?.date ? formatDate(clientData.date) : "[Date]"}
        </span>
        by and between Eagle Investors LLC, an investment adviser (the
        "Adviser"), and{" "}
        <span className="border-b w-64 mx-1">
          {clientData?.name || "[Client Name]"}
        </span>
        , the "Client."
      </div>

      <h2 className="font-bold text-2xl mb-5">1. Services to be Provided</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Eagle Investors will provide premium investment research, advanced
        financial advice, exclusive trading strategies, and priority access to
        market insights regarding options, stock, digital assets, and
        cryptocurrency trading to Diamond Subscribers ("Subscribers") via the
        internet and through the firm's online platform.
        <br /> <br />
        Diamond membership includes advanced portfolio analysis, priority
        customer support, exclusive webinars, monthly strategy sessions, and
        access to premium research reports. This service is designed for serious
        investors seeking professional-grade analysis and guidance.
      </div>

      <h2 className="font-bold text-2xl mb-4">2. Term of the Contract</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        This contract shall commence on
        <span className="border-b w-64 mx-1">
          {clientData?.date ? formatDate(clientData.date) : "[Date]"}
        </span>
        and shall renew on a monthly or annual basis, depending on the client's
        selected subscription plan, unless sooner terminated as provided herein.
      </div>

      <h2 className="font-bold text-2xl mb-6">3. Fee Schedule</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        The Fee will range from <strong>$76 monthly to $760 annually</strong>{" "}
        for the Diamond subscription. The fee includes premium investment
        research, exclusive trading strategies, priority customer support, and
        access to advanced portfolio analysis tools.
      </div>

      <h2 className="font-bold text-2xl mb-6">4. Payment Processing</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        Fees are to be billed to clients via either Stripe or PayPal (online
        payment processors) only through a secure checkout process. The firm
        does not deduct fees from clients' assets at any time. Clients will only
        be billed according to their subscription plan: monthly subscribers will
        be billed once monthly, and annual subscribers will be billed once
        annually.
        <br />
        <br />
        Fees are to be collected via either <strong>Stripe or PayPal</strong>
        (online payment processors) only through a secure checkout process on
        <a href="https://eagle-investors.com" className="text-blue-600 px-2">
          https://eagle-investors.com.
        </a>{" "}
        <br />
        In light of CCR Section 260.238(j) - Investment Advisers: Fair,
        equitable and ethical principles, Eagle Investors LLC charges a fair and
        reasonable fee for the services provided. Lower fees for comparable
        services may be available from other sources.{" "}
        <strong>Fees are non-negotiable.</strong>
      </div>

      <div className="font-medium font-16 mb-6">
        <h3 className="font-bold">Fee Breakdown:</h3>
        <ul className="list-inside mt-2">
          <li>
            <strong>● Monthly:</strong> In a 30-day month, $76 per month would
            be equivalent to <strong>$2.53/day</strong>.
          </li>
          <li>
            <strong>● Annual:</strong> In a 365-day year, $760 per year would be
            equivalent to <strong>$2.08/day</strong>.
          </li>
        </ul>
      </div>

      <h2 className="font-bold text-2xl mb-6">5. Acceptance of Disclosures</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap text-left">
        The Client acknowledges the review and acceptance of the additional
        disclosures related to fiduciary duty, options and leverage trading
        risks, impersonal investment advice, individual financial guidance,
        advisor positions, paper or simulated trades, no guarantees, code of
        ethics and compliance as well as questions and contact information
        always available online at
        <a
          href="https://eagle-investors.com/disclaimer"
          className="text-blue-600 px-2"
        >
          https://eagle-investors.com/disclaimer
        </a>
        . The client has the right to terminate the contract without penalty
        within five business days after entering into the contract.
      </div>

      <h2 className="font-bold text-2xl mb-6">6. Refund Policy</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap text-left">
        In the event of termination of this contract by either party or
        nonperformance by the Adviser, the Adviser shall refund to the Client a
        prorated portion of any prepaid fees for services not yet rendered for
        annual subscribers only. <br /> <br />
        Refund Amount = ((Annual Fee / Days in Year) * Days Remaining in
        Subscription Year) - Processing Fees
        <br /> <br />
        Processing Fees:
        <br />
        ● Stripe: 2.9% + $0.30 per transaction
        <br />● PayPal: 3.49% + $0.49 per transaction, plus up to an additional
        2% fee on refunds <br /> <br />
        Eagle Investors LLC may, at its sole discretion, waive or modify the
        Subscription Fee for any Subscriber. <br />
        Clients are entitled to a full refund within five business days if the
        Form ADV was not provided 48 hours prior to signing this agreement, as
        per California Code of Regulation, Section 260.235.4(c).
      </div>

      <h2 className="font-bold text-2xl mb-6">7. Discretionary Authority</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract does not grant discretionary authority to the Adviser or
        its representatives. The Client retains full control over all investment
        decisions and trade executions.
      </div>

      <h2 className="font-bold text-2xl mb-6">8. Assignment</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may not be assigned by the Adviser without the prior
        written consent of the Client.
      </div>

      <h2 className="font-bold text-2xl mb-6">9. Client Permission</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        The Adviser will never affect transactions for the client in the
        client's broker-dealer account(s).
      </div>

      <h2 className="font-bold text-2xl mb-6">10. Change in Control</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        The Adviser will inform the client of any significant changes in
        ownership, management, or business operations within 3 months via
        written communication.
      </div>

      <h2 className="font-bold text-2xl mb-6">11. Conflict of Interest</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Eagle Investors LLC follows strict ethics and compliance policies. It
        does not earn performance-based compensation and does not provide
        personalized investment advice. All investment recommendations are
        impersonal and general in nature.
        <br />
        <br />
        Eagle Investors LLC and Eagle Guardian Advisors LLC are affiliated but
        legally distinct entities under common ownership. While they share
        leadership—including Ishaan K. Sandhir and Maikel Den Hertog—no referral
        fees, commissions, or compensation arrangements exist between Eagle
        Investors and Eagle Guardian Advisors for client referrals or
        engagements.
        <br />
        <br />
        Eagle Guardian Advisors LLC is a state-registered investment adviser
        (RIA) that provides fiduciary portfolio management and financial
        planning services through a separate engagement. All advisory services
        involving asset management, financial planning, or fiduciary obligations
        are conducted solely through Eagle Guardian Advisors LLC, with custody
        of client assets held at independent custodians such as Charles Schwab,
        Interactive Brokers, or other qualified institutions.
        <br />
        <br />
        Clients referred by Eagle Investors are under no obligation to engage
        Eagle Guardian Advisors. Any references to estate planning
        professionals, tax professionals, or other third-party service providers
        are for educational purposes only and are entirely optional.
        <br />
        <br />
        Additionally, Ishaan K. Sandhir serves on the board of directors of
        501(c)(3) nonprofit organizations that are independently operated and
        unaffiliated with either Eagle Investors LLC or Eagle Guardian Advisors
        LLC.
      </div>

      <h2 className="font-bold text-2xl">12. Termination</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may be terminated at any time by either party with written
        notice.
      </div>

      <h2 className="font-bold text-2xl">13. Governing Law</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract is governed by the laws of California, Texas, Virginia,
        New Jersey, New York, and Indiana.
      </div>

      <h2 className="font-bold text-2xl">14. Entire Agreement</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This document constitutes the full agreement between the parties.
      </div>

      <h2 className="font-bold text-2xl">15. Amendment</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Amendments must be made in writing and signed by both parties.
      </div>

      {/* Contract Signature Section */}
      <div className="">
        <div className="flex font-medium font-16 mb-6 flex-wrap">
          <strong>IN WITNESS WHEREOF</strong>, the parties have executed this
          contract as of the date first written above.
        </div>
        <div className="mt-8">
          <div className="font-medium font-16 mb-4">
            <strong>Eagle Investors LLC</strong>
          </div>
          <div className="font-medium font-16 ">By: Ishaan K Sandhir</div>
          <div className="font-medium font-16 ">Chief Compliance Officer</div>
          <div className="font-medium font-16 ">Eagle Investors</div>
          <div className="font-medium font-16">Eagle Horizon Ventures</div>

          {/* Client Section with Contract Signing Form */}
          {!isModal && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4">
                <p className="font-bold">Client:</p>
                <ContractSigningForm
                  onSave={handleContractSave}
                  triggerButtonText="Sign Diamond Contract"
                  dialogTitle="Sign Diamond Advisory Contract"
                />
              </div>

              <ContractDisplay
                contractData={clientData}
                placeholderText={{
                  name: "[To be signed]",
                  date: "[To be signed]",
                  signature: "[To be signed]",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
