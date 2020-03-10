const fs = require("fs");
const got = require("got");

fs.readFile("./address.txt", "utf8", async (err, data) => {
  if (err) {
    throw err;
  }

  let addresses = data.split("\n")
  addresses = addresses.map(address => address.trim())
  
  const request = addresses.join("|")

  try
  {
    const balances = await got(`https://blockchain.info/balance?active=${request}`).json();
    const ticker = await got(`https://blockchain.info/ticker`).json()
    const price = ticker.USD.sell; 
    
    let sum = 0, fiat_sum = 0;
    console.log('\x1b[1m%s\x1b[0m', "Printing Bitcoin Balances\n")
    for (let address of addresses)
    {
      let bitcoin_bal = balances[address].final_balance / 1000000000
      let fiat_bal = (bitcoin_bal * price).toFixed(2);
      console.log('\x1b[34m%s\x1b[0m', `${address}: ${bitcoin_bal} ($${fiat_bal.toLocaleString()})`)
      sum += bitcoin_bal;
      fiat_sum += Number(fiat_bal);
    }
    console.log('\x1b[36m%s\x1b[0m', `\nTotal: ${sum} ($${fiat_sum.toLocaleString()})`)
  }
  catch (error)
  {
    console.log(error)
  }
});
