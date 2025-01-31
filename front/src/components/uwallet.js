
let unisatInstalled = false;
let unisatConnectd = false;
let uniAccounts = [];
let uniAddress = "";
let uniUserType = ""//VIP, IP, NORMAL;
let uniBalance = null;

let g_isRightAddress = false;

//let pearl_ids = null ;
//let addressPearlCount = 0 ;

async function warningSwitchingAccounts(uniAddress) {
  const isTaprootAddress = isValidTaprootAddress(uniAddress)
  //testnet to livenet 
  g_isRightAddress = isTaprootAddress && curnetwork == 'livenet';
  if (g_isRightAddress) {
    //$('#generate-show-btn').disabled = false;
    //$("#btnGenerateNew").disabled = false;
    //$('#MintButton-uni').disabled = false;
    //$('#MintButton-uni').innerHTML = `Mint<br>铭刻`;
    //$('#MintButton-uni').innerHTML = `Mint On Testnet<br>铭刻到测试网`;
  }
  else {
    $('#MintButton-uni').disabled = true;
    $('#generate-show-btn').disabled = true;
    $("#btnGenerateNew").disabled = true;
    $('#MintButton-uni').innerHTML = `Please Check Your Address or Network!<br>请切换至闪电网络地址或BTC主网!`;
    //$('#MintButton-uni').innerHTML = `Please Check Your Address or Network!<br>请切换至闪电网络地址或BTC测试网!`;

    var tapRootModel = new bootstrap.Modal(document.getElementById('tapRootModel'));
    tapRootModel.show();
  }
  return g_isRightAddress;
}
async function handleAccountsChanged(_accounts) {
  if (_accounts.length == 0) {
    $("#connectButton").style.display = 'block';
    $("#startBtn").style.display = 'none';
    $("#generate-show-btn").disabled = true;
    $("#btnGenerateNew").disabled = true;

    return;
  }
  if (uniAccounts[0] === _accounts[0]) {
    // prevent from triggering twice
    return;
  }

  uniAccounts = _accounts;
  console.log(uniAccounts[0]);

  if (_accounts.length > 0) {
    uniAccounts = _accounts;
    unisatConnectd = true;
    uniAddress = uniAccounts[0];
    //await getBasicInfo();
  }
  else {
    console.log('ttt--------------------')
    uniAddress = "";
    unisatConnectd = false;
    $("#connectButton").style.display = 'block';
    $("#startBtn").style.display = 'none';
    $("#generate-show-btn").disabled = true;
    $("#btnGenerateNew").disabled = true;
  }

  if (unisatConnectd) {
    let isTaproot = await warningSwitchingAccounts(uniAddress);
    console.log(isTaproot);
    if (isTaproot == true) {

      $("#connectButton").style.display = 'none';
      $("#startBtn").style.display = 'block';
      $('#mint_show_uniaddress').innerHTML = uniAddress;
      $("#generate-show-btn").disabled = false;
      $("#btnGenerateNew").disabled = false;
      
      await getHashCodeByApi(uniAddress,g_isInit);
      await getMoneyAddressByApi(uniAddress,g_isInit);

      // if(g_isInit)
      // {
      //   updatePUI();
      // }

    }

  }
};


async function handleNetworkChanged(network) {
  console.log('network changed: ', network);
  curnetwork = network;
};

async function checkUnisat() {
  let unisat = window.unisat;

  for (let i = 1; i < 10 && !unisat; i += 1) {
    await new Promise(resolve => setTimeout(resolve, 10 * i));
    unisat = window.unisat;
  }

  if (unisat) {
    console.log("Unisat installed");
    unisatInstalled = true;
    $("#div-mint-qr").style.display = 'none';
    $("#div-mint-uni").style.display = 'block';

    curnetwork = await unisat.getNetwork();

    unisat.getAccounts().then((accounts) => {
      handleAccountsChanged(accounts);
    });

    console.log(curnetwork);
    unisat.on("accountsChanged", handleAccountsChanged);
    unisat.on("networkChanged", handleNetworkChanged);

  }
  else {
    $("#div-mint-qr").style.display = 'block';
    $("#div-mint-uni").style.display = 'none';
    $('#mint_show_nft_price').innerHTML = '0';

    var unisatModel = new bootstrap.Modal(document.getElementById('unisatmodel'));
    unisatModel.show();
    return;
  }

  // return () => {
  //   unisat.removeListener("accountsChanged", handleAccountsChanged);
  //   unisat.removeListener("networkChanged", handleNetworkChanged);
  // };
}

