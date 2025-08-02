"use client";
import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

export default function InvestmentAdvisingContract() {
  const [clientData, setClientData] = useState<ContractData | null>(null);

  const handleContractSave = (data: ContractData) => {
    setClientData(data);
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
        Advisory Contract – Investment Advising Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">
        Investment Advising Advisory Contract
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
        Eagle Investors will provide comprehensive investment advisory services,
        portfolio analysis, strategic investment recommendations, and
        professional financial guidance regarding options, stock, digital
        assets, and cryptocurrency trading to Investment Advising Subscribers
        ("Subscribers") via the internet and through the firm's online platform.
        <br /> <br />
        Investment Advising membership includes detailed market research, sector
        analysis, investment thesis development, portfolio construction
        guidance, and strategic asset allocation recommendations. This service
        is designed for serious investors seeking professional-grade investment
        analysis and guidance.
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
        The Fee will range from <strong>$125 monthly to $1,250 annually</strong>{" "}
        for the Investment Advising subscription. The fee includes comprehensive
        investment research, portfolio analysis, and professional investment
        guidance.
      </div>

      <h2 className="font-bold text-2xl mb-6">
        4. Investment Advising Benefits
      </h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Investment Advising members receive:
        <ul className="list-disc ml-6 mt-2">
          <li>Comprehensive market research and analysis</li>
          <li>Strategic investment recommendations</li>
          <li>Portfolio construction guidance</li>
          <li>Asset allocation strategies</li>
          <li>Sector and industry analysis</li>
          <li>Investment thesis development</li>
          <li>Risk assessment and management</li>
          <li>Quarterly portfolio reviews</li>
        </ul>
      </div>

      <h2 className="font-bold text-2xl mb-6">5. Professional Standards</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        All investment advice and recommendations are provided in accordance
        with professional investment advisory standards. While recommendations
        are based on thorough analysis, all investments carry risk and past
        performance does not guarantee future results. Clients are advised to
        consider their individual financial situation and risk tolerance.
      </div>

      {/* Standard contract sections */}
      <h2 className="font-bold text-2xl mb-6">6. Discretionary Authority</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract does not grant discretionary authority to the Adviser or
        its representatives. The Client retains full control over all investment
        decisions and trade executions.
      </div>

      <h2 className="font-bold text-2xl mb-6">7. Fiduciary Duty</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Eagle Investors LLC acknowledges its fiduciary duty to act in the best
        interests of its Investment Advising clients. All recommendations are
        made with the client's best interests as the primary consideration, free
        from conflicts of interest.
      </div>

      <h2 className="font-bold text-2xl mb-6">8. Termination</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may be terminated at any time by either party with written
        notice. Investment Advising members are eligible for prorated refunds on
        annual subscriptions.
      </div>

      <h2 className="font-bold text-2xl">9. Governing Law</h2>
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
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4">
              <p className="font-bold">Client:</p>
              <ContractSigningForm
                onSave={handleContractSave}
                triggerButtonText="Sign Investment Advising Contract"
                dialogTitle="Sign Investment Advising Advisory Contract"
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
        </div>
      </div>
    </div>
  );
}
