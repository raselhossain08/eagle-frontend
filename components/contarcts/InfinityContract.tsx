"use client";
import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

interface InfinityContractProps {
  onContractSave?: (data: ContractData) => void;
  isModal?: boolean;
}

export default function InfinityContract({
  onContractSave,
  isModal = false,
}: InfinityContractProps) {
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
        Advisory Contract – Infinity Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">
        Infinity Advisory Contract
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
        Eagle Investors will provide unlimited access to all premium services,
        exclusive VIP treatment, personalized portfolio management consultation,
        direct access to senior advisors, and comprehensive investment solutions
        regarding options, stock, digital assets, and cryptocurrency trading to
        Infinity Subscribers ("Subscribers") via the internet and through the
        firm's online platform.
        <br /> <br />
        Infinity membership represents the highest tier of service, providing
        unlimited access to all Eagle Investors services, priority support,
        personalized consultation sessions, exclusive market insights, and
        direct communication with senior management. This membership is designed
        for high-net-worth individuals and institutional clients seeking the
        ultimate investment experience.
      </div>

      <h2 className="font-bold text-2xl mb-4">2. Term of the Contract</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        This contract shall commence on
        <span className="border-b w-64 mx-1">
          {clientData?.date ? formatDate(clientData.date) : "[Date]"}
        </span>
        and shall renew on an annual basis, unless sooner terminated as provided
        herein. Infinity memberships are available by invitation only.
      </div>

      <h2 className="font-bold text-2xl mb-6">3. Fee Schedule</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        The Fee will be <strong>$2,500 annually</strong> for the Infinity
        subscription. The fee includes unlimited access to all services,
        personalized consultation, and VIP treatment across all Eagle Investors
        platforms.
      </div>

      <h2 className="font-bold text-2xl mb-6">4. Infinity Benefits</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Infinity members receive:
        <ul className="list-disc ml-6 mt-2">
          <li>Unlimited access to all Eagle Investors services</li>
          <li>Direct access to senior advisors and management</li>
          <li>Personalized portfolio management consultation</li>
          <li>Priority customer support (24/7 availability)</li>
          <li>Exclusive market insights and research reports</li>
          <li>VIP access to all webinars and events</li>
          <li>Custom trading strategies and algorithms</li>
          <li>Unlimited one-on-one consultation sessions</li>
          <li>Dedicated account manager</li>
          <li>Early access to new services and features</li>
        </ul>
      </div>

      <h2 className="font-bold text-2xl mb-6">5. VIP Treatment</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Infinity members receive white-glove service with dedicated support
        staff, priority access to all resources, and personalized attention from
        our senior team. Members have direct communication channels with
        executive leadership and receive custom-tailored investment solutions.
      </div>

      <h2 className="font-bold text-2xl mb-6">6. Exclusivity</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Infinity membership is by invitation only and limited to a select number
        of qualified individuals and institutions. Members gain access to
        exclusive investment opportunities, private research, and
        institutional-grade services not available to other membership tiers.
      </div>

      {/* Standard contract sections */}
      <h2 className="font-bold text-2xl mb-6">7. Discretionary Authority</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        While this contract does not grant discretionary authority by default,
        Infinity members may elect to engage in discretionary portfolio
        management services through a separate agreement. Otherwise, the Client
        retains full control over all investment decisions and trade executions.
      </div>

      <h2 className="font-bold text-2xl mb-6">8. Confidentiality</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Eagle Investors LLC maintains the highest standards of confidentiality
        for all Infinity members. All personal and financial information is
        protected under strict confidentiality agreements and industry-standard
        security protocols.
      </div>

      <h2 className="font-bold text-2xl mb-6">9. Termination</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may be terminated at any time by either party with 30 days
        written notice. Infinity members are eligible for prorated refunds based
        on unused service periods.
      </div>

      <h2 className="font-bold text-2xl">10. Governing Law</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract is governed by the laws of California, Texas, Virginia,
        New Jersey, New York, and Indiana.
      </div>

      {/* Contract signing section */}
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
                  triggerButtonText="Sign Infinity Contract"
                  dialogTitle="Sign Infinity Advisory Contract"
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
