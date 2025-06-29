import { NextResponse } from "next/server";
import { ethers, JsonRpcProvider } from "ethers";
import { CHAINMED_ABI, CONTRACT_ADDRESS } from "@/lib/web3";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { name, cnpj, insuranceAddress } = await request.json();

    if (!name || !cnpj || !insuranceAddress) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINMED_ABI, signer);

    const sourceFilePath = path.join(process.cwd(), "functions-source-cnpj.js"); // Assuming a different file for CNPJ
    const source = await fs.readFile(sourceFilePath, "utf8");

    const tx = await contract.requestInsuranceAuthorization(name, cnpj, source, {
        // Note: The contract uses msg.sender. This backend call will register the backend's address.
        // For the insurance company to be the sender, the transaction must be signed on the frontend.
    });

    await tx.wait();

    return NextResponse.json({
      success: true,
      message: "Solicitação de autorização de seguradora enviada. Aguardando validação da rede.",
      transactionHash: tx.hash,
    });

  } catch (error) {
    console.error("API Error [register/insurance]:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 }
    );
  }
}
