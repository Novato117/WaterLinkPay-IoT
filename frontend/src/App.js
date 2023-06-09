import React, { useState } from "react";
import { ethers } from 'ethers';
import abi from './chain-info/priceusd.json'
import './App.css';
import abiautomation from './chain-info/automation.json';
import axios from 'axios';
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [myadress, setMyAdress] = useState(false);
  const [balance, setBalance] = useState();
  const [liters, setLiters] = useState();
  const [relay, setRelay] = useState();
  const [mat_usd, setMat_usd] = useState();
  const [Aliters, setLitersA] = useState();
  const [Arelay, setRelayA] = useState();
  const [priceL, setPriceL] = useState();
  //data of contract 
  const contractAddress = '0x93064FdEF84Dd929E1ebba0A7F69B73323863a16';
  const contractAutomation = '0x580E17a6be1935739d4986EB16b57c75383B090E';
  let Provider = new ethers.providers.Web3Provider(window.ethereum);
  const contractA = new ethers.Contract(contractAutomation, abiautomation, Provider);
  const contract = new ethers.Contract(contractAddress, abi.abi, Provider);
  //contrato con el cual interactuaremos
  async function BotonConectarWallet() {
    // const provider = ethers.getDefaultProvider('https://rpc.api.moonbase.moonbeam.network');

    if (window.ethereum) {
      try {
        // await window.ethereum.enable()---> forma obsoleta 
        await window.ethereum.request({ method: "eth_requestAccounts", }).then(result => {
          console.log(`Conectado con la deireccion ${result[0]}`)
          setMyAdress(result[0]);
          setIsConnected(true);
          getAccountBalance(result[0]);
        })


        const red = await window.ethereum.request({ method: 'net_version' });
        console.log(`Red conectada ${red}`);

      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('MetaMask not found, please install MetaMask and refresh the page.');
    }
  }
  const getAccountBalance = async (adress) => {
    await window.ethereum.request({ method: 'eth_getBalance', params: [adress, 'latest'] }).then(balance => {
      setBalance(ethers.utils.formatEther(balance));
      console.log(balance);
    })
      .catch(error => {
        console.log(error.message);
      });
  };
  //conversion 
  function hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
  const get = async () => {
    console.log(`llamamos al cotrato ${contractAddress}`);
    const successResult = await contract.latestResponse();
    //console.log(`dato almacenado ${successResult}`);

    const convert = hex_to_ascii(successResult.slice(2));
    // console.log(convert);
    //console.log(typeof convert);
    //string to a JSON object
    const jsonObject = JSON.parse(convert);
    //console.log("litros gastados");
    // console.log(jsonObject);
    setLiters(jsonObject.liters)
    setRelay(jsonObject.relay)

    /*decodedOutput = Buffer.from(successResult.slice(2), 'hex');
    console.log(decodedOutput.toString())*/
  }
  get();
  const getAutomation = async () => {
    console.log(`llamamos al cotrato automation${contractAutomation}`);
    const successResultA = await contractA.latestResponse();
    console.log(`dato almacenado ${successResultA}`);
    const convert = hex_to_ascii(successResultA.slice(2));
    const jsonObject = JSON.parse(convert);
    console.log(jsonObject);
    setRelayA(jsonObject.relay);
    setLitersA(jsonObject.liters);
    if (Aliters < 1) {
      setPriceL(0.45);
    } else if (Aliters > 3) {
      setPriceL(1.35);
    } else {
      setPriceL(0.9);
    }

  }
  getAutomation();
  const payTo = '0x5385A4F6a8eE78b486C314e6Fd37cf6c6dC81D10';
  let Singer = Provider.getSigner();
  const payable = async () => {

    console.log(`Attempting to send transaction from ${myadress} to ${payTo}`);
    console.log(`Liters Used ${Aliters}`);
    console.log(`precio de matic ${mat_usd}`)
    //TotalPay = JSON.stringify(totalP);
    const url = 'https://us-east-1.aws.data.mongodb-api.com/app/application-0-wqmkc/endpoint/newData'; // Replace with your MongoDB API endpoint
    const data = { "relay": 1, "liters": 0 }; // Replace with your data

    axios.put(url, data)
      .then(response => {
        console.log('PUT request successful:', response.data);
      })
      .catch(error => {
        console.error('Error making PUT request:', error);
      });
    // 5. Create tx object
    if (Aliters < 1) {
      const tx = {
        to: payTo,
        value: ethers.utils.parseEther('0.58'),
      };
      // 6. Sign and send tx - wait for receipt
      const createReceipt = await Singer.sendTransaction(tx);
      await createReceipt.wait();
      console.log(`Transaction successful with hash: ${createReceipt.hash}`);
    } else if (Aliters > 3) {
      const tx = {
        to: payTo,
        value: ethers.utils.parseEther('1.75'),
      };
      // 6. Sign and send tx - wait for receipt
      const createReceipt = await Singer.sendTransaction(tx);
      await createReceipt.wait();
      console.log(`Transaction successful with hash: ${createReceipt.hash}`);
    } else {
      const tx = {
        to: payTo,
        value: ethers.utils.parseEther('0.9'),
      };
      // 6. Sign and send tx - wait for receipt
      const createReceipt = await Singer.sendTransaction(tx);
      await createReceipt.wait();
      console.log(`Transaction successful with hash: ${createReceipt.hash}`);
    }
  }
  const abiInterface = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "Received",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [],
      "name": "getLatestData",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const contract2 = new ethers.Contract(payTo, abiInterface, Provider);
  const getPrice = async () => {
    console.log("llamamos a la funcion obtener precio de matic ");
    const USD_mat = await contract2.getLatestData();
    console.log(`precio de matic ${USD_mat / 100000000}`)
    //console.log(typeof USD_mat)
    setMat_usd(USD_mat / 100000000);
  }
  getPrice();
  return (
    <div className="App">
      <button className="button" onClick={BotonConectarWallet}>{isConnected ? 'connectado' : 'connectar wallet'}</button>
      <div className="font">
        <p className="back">{`wallet address :s ${myadress}`}</p>
        <p className="back">{`Your balance ${balance}`}</p>
        <div>
          <p className="back">price for 1 liter : $0.45 uds</p>
          <p className="back">{`liters used ${Aliters} Liters`}</p>
          <p className="back">{`fauced status  ${Arelay}`}{Arelay == 1 ? 'activado' : 'desactivado'}</p>
          <p className="back">{`Pagar $ ${priceL} por ${Aliters} liters`}</p>
          <button className="button" onClick={payable}>Pagar</button>
        </div>
        <div>Automation</div>
        <button className="button" onClick={getAutomation}>Update data</button>
      </div>
    </div>
  );
}

export default App;
