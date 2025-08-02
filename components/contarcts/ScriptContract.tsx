"use client";
import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

export default function ScriptContract() {
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
        Advisory Contract – Script Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">Script Advisory Contract</h1>
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
        Eagle Investors will provide access to proprietary trading scripts,
        algorithmic trading strategies, automated market analysis tools, and
        systematic trading approaches regarding options, stock, digital assets,
        and cryptocurrency trading to Script Subscribers ("Subscribers") via the
        internet and through the firm's online platform.
        <br /> <br />
        Script membership includes access to pre-built trading algorithms,
        backtesting tools, performance analytics, and systematic trading
        methodologies. Members receive detailed documentation on script
        implementation and optimization strategies.
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
        The Fee will range from <strong>$99 monthly to $990 annually</strong>{" "}
        for the Script subscription. The fee includes access to proprietary
        trading scripts, algorithmic strategies, and systematic trading tools.
      </div>

      <h2 className="font-bold text-2xl mb-6">4. Script Benefits</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        Script members receive:
        <ul className="list-disc ml-6 mt-2">
          <li>Access to proprietary trading algorithms</li>
          <li>Pre-built trading scripts and strategies</li>
          <li>Backtesting and performance analysis tools</li>
          <li>Script implementation documentation</li>
          <li>Systematic trading methodologies</li>
          <li>Algorithm optimization guidance</li>
          <li>Regular script updates and improvements</li>
        </ul>
      </div>

      <h2 className="font-bold text-2xl mb-6">5. Script Usage Terms</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        All trading scripts and algorithms are provided for informational and
        educational purposes. Users are responsible for testing and validating
        all scripts before implementation with real capital. Performance results
        are not guaranteed and past performance does not indicate future
        results. Scripts should be used with appropriate risk management
        measures.
      </div>

      {/* Standard contract sections */}
      <h2 className="font-bold text-2xl mb-6">6. Discretionary Authority</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract does not grant discretionary authority to the Adviser or
        its representatives. The Client retains full control over all investment
        decisions and trade executions.
      </div>

      <h2 className="font-bold text-2xl mb-6">7. Intellectual Property</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        All scripts, algorithms, and proprietary trading methodologies remain
        the intellectual property of Eagle Investors LLC. Scripts are licensed
        for personal use only and may not be redistributed, resold, or shared
        with third parties.
      </div>

      <h2 className="font-bold text-2xl mb-6">8. Termination</h2>
      <div className="flex font-medium font-16 mb-6 flex-wrap">
        This contract may be terminated at any time by either party with written
        notice. Upon termination, access to scripts and proprietary algorithms
        will be revoked.
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
                triggerButtonText="Sign Script Contract"
                dialogTitle="Sign Script Advisory Contract"
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
