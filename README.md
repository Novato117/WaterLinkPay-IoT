# WaterLinkPay-IoT
#### To get the stored data
Run npm install to install the dependencies
- npm install 
2. initialize the project
- cd functions-hardhad-started-kid 
3. Create and fund a subscription
- npx hardhat functions-sub-fund --subid REPLACE_SUBSCRIPTION_ID --amount 1 --network polygonMumbai
4. Set an encryption password for your environment variables.
- npx env-enc set-pw
5. read data
- npx hardhat functions-read  --contract 0x580E17a6be1935739d4986EB16b57c75383B090E  --network polygonMumbai --configpath tutorials/8-my-api/config.js
## To read data from frontend
1. cd frontend
2. Run npm install to install the dependencies
- npm install  
3. Open 
- Install and configure your Web3 wallet for Polygon Mumbai
- npm start

The App should be running at: http://localhost:3000
  
### To test the sensors
- open IDE arduino
- compile SensorFlowDataAPI.ino
- conected esp32
