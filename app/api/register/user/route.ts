import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { CHAINMED_ABI, CONTRACT_ADDRESS } from "@/lib/web3";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { nome, cpf, userHash, userAddress } = await request.json();

    if (!nome || !cpf || !userHash || !userAddress) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // 1. Conectar ao provedor e ao contrato
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINMED_ABI, signer);

    // 2. Ler o código-fonte da Chainlink Function
    const sourceFilePath = path.join(process.cwd(), "functions-source-cpf.js");
    const source = await fs.readFile(sourceFilePath, "utf8");

    // 3. Chamar a função do contrato para solicitar o registro
    const tx = await contract.requestUserRegistration(nome, cpf, userHash, source);

    await tx.wait();

    return NextResponse.json({
      success: true,
      message: "Solicitação de registro de usuário enviada. Aguardando validação da rede.",
      transactionHash: tx.hash,
    });

  } catch (error) {
    console.error("API Error [register/user]:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 }
    );
  }
}
