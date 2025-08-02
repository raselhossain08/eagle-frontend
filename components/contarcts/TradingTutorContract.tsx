"use client";
import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

export default function TradingTutorContract() {
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
        Advisory Contract – Trading Tutor Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">
        Trading Tutor Advisory Contract
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
        Eagle Investors will provide educational trading content, step-by-step
        trading tutorials, beginner-friendly market analysis, and foundational
        investment education regarding options, stock, digital assets, and
        cryptocurrency trading to Trading Tutor Subscribers ("Subscribers") via
        the internet and through the firm's online platform.
        <br /> <br />
        Trading Tutor membership focuses on educational content designed to
        teach fundamental and technical analysis, risk management principles,
        and trading psychology. This service is specifically designed for
        individuals who are new to trading or seeking to improve their
        foundational knowledge.
      </div>

      <h2 className="font-bold text-2xl mb-4">2. Term of the Contract</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        This contract shall commence on
        <span className="border-b w-64 mx-1">
          {clientData?.date ? formatDate(clientData.date) : "[Date]"}
        </span>
        and shall renew on a monthly basis, unless sooner terminated as provided
        herein.
      </div>

      <h2 className="font-bold text-2xl mb-6">3. Fee Schedule</h2>
      <div className="flex font-medium font-16 mb-4 flex-wrap">
        The Fee will be <strong>$45 monthly</strong> for the Trading Tutor
        subscription. The fee includes access to educational trading content,
        tutorial videos, and beginner-friendly market analysis and educational
        resources.
      </div>

      <h2 className="font-bold text-2xl mb-6">4. Educational Benefits</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Trading Tutor members receive:
        <ul className="list-disc ml-6 mt-2">
          <li>Step-by-step trading tutorials</li>
          <li>Beginner-friendly educational content</li>
          <li>Risk management training</li>
          <li>Trading psychology guidance</li>
          <li>Fundamental and technical analysis education</li>
          <li>Access to educational webinars</li>
        </ul>
      </div>

      {/* Standard contract sections */}
      <h2 className="font-bold text-2xl mb-6">5. Educational Nature</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        The Trading Tutor service is purely educational in nature. All content
        is designed for learning purposes and does not constitute personalized
        investment advice. Students are encouraged to practice with paper
        trading before implementing strategies with real capital.
      </div>

      <h2 className="font-bold text-2xl mb-6">6. Discretionary Authority</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract does not grant discretionary authority to the Adviser or
        its representatives. The Client retains full control over all investment
        decisions and trade executions.
      </div>

      <h2 className="font-bold text-2xl mb-6">7. Termination</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may be terminated at any time by either party with written
        notice.
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
                triggerButtonText="Sign Trading Tutor Contract"
                dialogTitle="Sign Trading Tutor Advisory Contract"
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
