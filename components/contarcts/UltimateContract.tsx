"use client";
import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

export default function UltimateContract() {
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
        Advisory Contract – Ultimate Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">
        Ultimate Advisory Contract
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
        Eagle Investors will provide comprehensive investment research, advanced
        financial advice, premium trading strategies, and exclusive market
        insights regarding options, stock, digital assets, and cryptocurrency
        trading to Ultimate Subscribers ("Subscribers") via the internet and
        through the firm's online platform. Ultimate members receive priority
        access to all services, exclusive webinars, one-on-one consultation
        sessions, and advanced trading tools.
        <br /> <br />
        This Ultimate membership includes personalized portfolio reviews,
        advanced risk management strategies, and exclusive access to
        institutional-grade research and analysis. Members also receive priority
        customer support and early access to new features and services.
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
        The Fee will range from <strong>$150 monthly to $1,500 annually</strong>{" "}
        for the Ultimate subscription. The fee includes premium recommendations
        of digital assets and cryptocurrencies, exclusive trading strategies,
        and personalized consultation sessions.
      </div>

      <h2 className="font-bold text-2xl mb-6">4. Premium Benefits</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Ultimate members receive:
        <ul className="list-disc ml-6 mt-2">
          <li>Exclusive access to institutional-grade research</li>
          <li>Monthly one-on-one consultation sessions</li>
          <li>Priority customer support</li>
          <li>Advanced portfolio analysis tools</li>
          <li>Early access to new features and strategies</li>
          <li>Exclusive webinars and educational content</li>
        </ul>
      </div>

      {/* Standard contract sections */}
      <h2 className="font-bold text-2xl mb-6">5. Discretionary Authority</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract does not grant discretionary authority to the Adviser or
        its representatives. The Client retains full control over all investment
        decisions and trade executions.
      </div>

      <h2 className="font-bold text-2xl mb-6">6. Assignment</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may not be assigned by the Adviser without the prior
        written consent of the Client.
      </div>

      <h2 className="font-bold text-2xl mb-6">7. Termination</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may be terminated at any time by either party with written
        notice. Ultimate members are eligible for prorated refunds on annual
        subscriptions.
      </div>

      <h2 className="font-bold text-2xl">8. Governing Law</h2>
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
                triggerButtonText="Sign Ultimate Contract"
                dialogTitle="Sign Ultimate Advisory Contract"
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
