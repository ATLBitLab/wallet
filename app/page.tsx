"use client";

import { FedimintWallet } from "@fedimint/core-web";
import { useEffect, useState } from "react";


export default function Home() {

  async function launchWallet(){
    console.log('starting wallet')

    // Create the Wallet client
    const wallet = new FedimintWallet()

    // globalThis.wallet = wallet

    // Open the wallet (should be called once in the application lifecycle)
    await wallet.open()

    // Join a Federation (if not already open)
    if (!wallet.isOpen()) {
      const inviteCode = 'fed11qgqzc2nhwden5te0vejkg6tdd9h8gepwvejkg6tdd9h8garhduhx6at5d9h8jmn9wshxxmmd9uqqzgxg6s3evnr6m9zdxr6hxkdkukexpcs3mn7mj3g5pc5dfh63l4tj6g9zk4er'
      await wallet.joinFederation(inviteCode)
    }

    // Get Wallet Balance
    await wallet.balance.getBalance()

    // Subscribe to Balance Updates
    const unsubscribe = wallet.balance.subscribeBalance((balance: number) => {
      console.log('Updated balance:', balance)
    })
    // Remember to call unsubscribe() when done

    // Receive Ecash Payments
    // await wallet.mint.reissueNotes('A11qgqpw9thwvaz7t...')

    // await wallet.mint.redeemEcash('asfsdf')

    

    const spend = await wallet.mint.spendNotes(100)
    console.log(spend)

    await wallet.mint.redeemEcash(spend.notes)



    // Create Lightning Invoice
    // let invoice = await wallet.lightning.createInvoice(10_000, 'description')

    // console.log(invoice)

    // console.log(invoice.invoice)

    // Pay Lightning Invoice
    // await wallet.lightning.payBolt11Invoice('lnbc...')

    unsubscribe();
    
  }

  useEffect(()=>{
      launchWallet();
  }, []);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>ATL BitLab Wallet</h1>
      </main>
    </div>
  );
}
