import React, { useState } from "react";
import ContractSigningForm, {
  ContractData,
} from "../common/ContractSigningForm";
import ContractDisplay from "../common/ContractDisplay";

interface BasicContractProps {
  onContractSave?: (data: ContractData) => void;
  isModal?: boolean;
}

export default function BasicContract({
  onContractSave,
  isModal = false,
}: BasicContractProps) {
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
        Advisory Contract – Basic Membership
      </h2>
      <h1 className="font-bold text-2xl mt-4 mb-5">Advisory Contract</h1>

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
        Eagle Investors will provide basic investment research and financial
        guidance regarding options, stock, digital assets, and cryptocurrency
        trading to Basic Subscribers ("Subscribers") via the internet and
        through the firm's online platform.
        <br /> <br />
        This basic membership provides access to educational content and general
        market insights. No personalized investment advice is provided.
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
        The Fee will be <strong>$35 monthly</strong> for the basic subscription.
        The fee includes access to basic educational content and general market
        insights.
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
                  triggerButtonText="Sign Basic Contract"
                  dialogTitle="Sign Basic Advisory Contract"
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
