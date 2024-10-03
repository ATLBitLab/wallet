"use client";

import { FedimintWallet } from "@fedimint/core-web";
import { ChangeEventHandler, useEffect, useState } from "react";


export default function Home() {
  const [balance, setBalance] = useState(0);
  const [federationInvite, setFederationInvite] = useState('fed11qgqzc2nhwden5te0vejkg6tdd9h8gepwvejkg6tdd9h8garhduhx6at5d9h8jmn9wshxxmmd9uqqzgxg6s3evnr6m9zdxr6hxkdkukexpcs3mn7mj3g5pc5dfh63l4tj6g9zk4er');
  const [sendAmount, setSendAmount] = useState(100);
  const [receiveAmount, setReceiveAmount] = useState(200);
  const [invoiceToPay, setInvoiceToPay] = useState<string>('')
  const [notesToSend, setNotesToSend] = useState<string|undefined>('')
  const [wallet, setWallet] = useState<FedimintWallet|null>()
  const [notesToReceive, setNotesToReceive] = useState<string|undefined>('')
  const [invoiceForReceive, setInvoiceForReceive] = useState<string|undefined>('')

  async function launchWallet(){
    console.log('Starting ATL BitLab Wallet...')

    // Create the Wallet client
    const wallet = new FedimintWallet();
    setWallet(wallet);

    // Uncomment to access the Wallet client from javascript console
    globalThis.wallet = wallet

    // Open the wallet (should be called once in the application lifecycle)
    await wallet.open()

    // Join a Federation (if not already open)
    if (!wallet.isOpen()) {
      await wallet.joinFederation(federationInvite)
    }

    // Get Wallet Balance
    await wallet.balance.getBalance()

    // Subscribe to Balance Updates
    const unsubscribe = wallet.balance.subscribeBalance((balance: number) => {
      console.log('Updated balance:', balance)
      setBalance(balance);
    })

    // Remember to call unsubscribe() when done
    // unsubscribe(); 
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setSendAmount(parseInt(e.target.value));
  }

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setReceiveAmount(parseInt(e.target.value));
  }

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setInvoiceToPay(e.target.value);
  }

  const handlesNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setNotesToReceive(e.target.value);
  }

  const handleMakePayment = async () => {
    if(invoiceToPay !== '') {
      console.log('make a lightning payment');
      await wallet?.lightning.payInvoice(invoiceToPay);
    }
    else {
      console.log('make an ecash payment');
      let notes = await wallet?.mint.spendNotes(sendAmount);
      setNotesToSend(notes?.notes);
    }
  }

  const handleReceivePayment = async () => {
    if(notesToReceive !== undefined) {
      console.log('receive an ecash payment');
      let notes = await wallet?.mint.redeemEcash(notesToReceive);
      console.log(notes);
    }
  }

  const handleGetInvoice = async () => {
    let invoice = await wallet?.lightning.createInvoice(receiveAmount, "payment");
    setInvoiceForReceive(invoice?.invoice);
  }

  useEffect(()=>{
      launchWallet();
  }, []);
  
  return (
    <div className="p-8">
      <main className="w-full flex flex-col gap-8 row-start-2">
        <h1 className="text-4xl">ATL BitLab Wallet</h1>

        <h2 className="text-3xl">Balance</h2>
        <p className="text-5xl">{balance} sats</p>

        <h2 className="text-3xl">Federation</h2>
        <input type="text" value={federationInvite} readOnly className="p-4 border border-gray-200" /> 

        <h2 className="text-3xl">Send Bitcoin</h2>
        <label>Amount</label>
        <input type="number" value={sendAmount} onChange={handleAmountChange} className="p-4 border border-gray-200" />

        <label>Lightning Invoice to Pay</label>
        <input type="text" value={invoiceToPay} onChange={handleInvoiceChange} className="p-4 border border-gray-200" />

        <button className="bg-orange-500 text-white p-6 font-bold" onClick={handleMakePayment}>Make Payment</button>

        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg overflow-x-scroll">
          {notesToSend}
        </div>

        <h2 className="text-3xl">Receive Bitcoin Over LN</h2>

        <label>Amount</label>
        <input type="number" value={receiveAmount} onChange={handleReceiveAmountChange} className="p-4 border border-gray-200" />

        <button className="bg-orange-500 text-white p-6 font-bold" onClick={handleGetInvoice}>Get LN Invoice</button>

        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg overflow-x-scroll">
          {invoiceForReceive}
        </div>

        <h2 className="text-3xl">Receive Ecash</h2>

        <label>Ecash to Redeem</label>
        <input type="text" value={notesToReceive} onChange={handlesNotesChange} className="p-4 border border-gray-200" />
        <button className="bg-orange-500 text-white p-6 font-bold" onClick={handleReceivePayment}>Receive Payment</button>
        
      </main>
    </div>
  );
}
