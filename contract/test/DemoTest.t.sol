// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import "../src/demo.sol";

contract DemoTest is Test {
    Demo public demo;
    
    function setUp() public {
        demo = new Demo("Maya", "MAYA");
    }
    
    function testTokenURI() public {
        // 模拟铸造一个NFT
        demo.mint{value: 0.1 ether}("test123");
        
        // 获取tokenURI
        string memory uri = demo.tokenURI(1);
        emit log_string(uri);
        
        // 验证URI格式是否正确
        assertTrue(bytes(uri).length > 0);
    }
} 