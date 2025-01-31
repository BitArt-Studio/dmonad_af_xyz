// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Demo is ERC721, Ownable {

    mapping(uint256 => string) private _tokenIdToHSeed;
    uint public constant MAX_NUM = 10000; // 总量
    uint256 public constant MINT_PRICE = 0.01 ether;

    uint32 private _tokenCounter = 0;

    string private _baseUri = "https://ngtest.bastudio.xyz/api/static/json/maya?hseed=";
    string private _GACode = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <style>\n        canvas {\n            bottom: 0;\n            height: 100vw;\n            left: 0;\n            margin: auto;\n            max-height: 100vh;\n            max-width: 100vh;\n            position: absolute;\n            right: 0;\n            top: 0;\n            width: 100vw;\n        }\n    </style>\n    <script type=\"module\">\n        import *as fcompress from 'https://static-testnet.unisat.io/content/ad33b21ece6ae27004bfa2e23755c363366fa07ad2cceb914833767ee48c9523i0';\n\n        async function getBaseFile() {\n            const baser = await fetch('https://static-testnet.unisat.io/content/0f967c475f2deb2b17caaba7bc1c7b226d10160b1ec2fdb728442888446f3debi0');\n            const bases = await baser.text();\n            const base = fcompress.strFromU8(fcompress.gunzipSync(new Uint8Array(Array.from(atob(bases)).map((char) => char.charCodeAt(0)))));\n            eval(base);\n        }\n        \n        getBaseFile();\n    </script>\n    <script type=\"text/javascript\" \n            src=\"https://static-testnet.unisat.io/content/0b4e8aaf3293427a00fa37954af618d0434d5e3d2856703955f4d2c143eecfcdi0\"></script>\n   \n</head>\n<body>\n<script type=\"text/javascript\">\n\n        let hashseed = '5elqYOqZd3RVKXlp';\n        \n        function setup() {\n            initData(hashseed);\n        }\n\n</script>\n</body>\n</html>";

    uint32 private _gasLimit = 300000;
    event Response(bytes32 indexed requestId, string indexed hSeed, bytes response, bytes err);
    error TokenUriNotFound();
    receive() external payable {}

    constructor(string memory name_, string memory symbol_) 
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {
    }

    // 简单的mint函数，每次mint后tokenId自动加1
    function mint(string memory hSeed) public payable {
        // 检查支付金额
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        require(_tokenCounter >= 0 && _tokenCounter < MAX_NUM, "tokenId out of range");
        _tokenCounter += 1;
        uint256 tokenId = _tokenCounter;
        _tokenIdToHSeed[tokenId] = hSeed;

        _mint(msg.sender, tokenId);
        
        // 如果支付金额超过要求金额，退还多余的 ETH
        uint256 refund = msg.value - MINT_PRICE;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert TokenUriNotFound(); 
        }
        string memory hSeed = _tokenIdToHSeed[tokenId];
        return string.concat(_baseUri, hSeed, '&tokenid=',Strings.toString(tokenId));
    }


    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Address: insufficient balance");
        (bool success,) = to.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function withdrawUnexpectedERC20(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }

    /* *****************
        Get/Set method
    ***************** */


    function setBaseUri(string memory newBaseUri) external onlyOwner {
        _baseUri = newBaseUri;
    }

    function getBaseUri() public view returns (string memory) {
        return _baseUri;
    }

    function setGasLimit(uint32 newGasLimit) external onlyOwner {
        _gasLimit = newGasLimit;
    }

    function getGasLimit() public view returns (uint32) {
        return _gasLimit;
    }

    function setGACode(string memory code) public onlyOwner {
        _GACode = code;
    }

    function getGACode(string memory hseed) public view returns (string memory) {
        if (keccak256(bytes(hseed)) == keccak256(bytes('0'))) {
            return _GACode;
        }
        return replace(_GACode, "0x@", hseed);
    }

    function getTokenCounter() public view returns (uint32) {
        return _tokenCounter;
    }

    function getTokenIdToHSeed(uint256 tokenId) public view returns (string memory) {
        return _tokenIdToHSeed[tokenId];
    }

    // 自定义字符串替换函数
    function replace(string memory str, string memory from, string memory to) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory fromBytes = bytes(from);
        bytes memory toBytes = bytes(to);

        uint256 resultLength = 0;

        for (uint256 i = 0; i < strBytes.length; i++) {
            bool matchFlag = true;
            for (uint256 j = 0; j < fromBytes.length; j++) {
                if (i + j >= strBytes.length || strBytes[i + j] != fromBytes[j]) {
                    matchFlag = false;
                    break;
                }
            }

            if(matchFlag) {
                resultLength += toBytes.length;
                i += fromBytes.length - 1;
            } else {
                resultLength++;
            }
        }


        bytes memory result = new bytes(resultLength);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < strBytes.length; i++) {
            bool matchFlag = true;
            for (uint256 j = 0; j < fromBytes.length; j++) {
                if (i + j >= strBytes.length || strBytes[i + j] != fromBytes[j]) {
                    matchFlag = false;
                    break;
                }
            }

            if(matchFlag) {
                for (uint256 k = 0; k < toBytes.length; k++) {
                    result[resultIndex++] = toBytes[k];
                }
                i += fromBytes.length - 1;
            } else {
                result[resultIndex++] = strBytes[i];
            }
        }

        return string(result);
    }
}