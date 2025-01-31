// ProjectName: Maya Fresco
export { renderMain, initData }
import Hashids from 'hashids'

let palettes = {
    elegant: [
      [246, 141, 108], // 珊瑚红
      [253, 215, 130], // 暖黄
      [147, 190, 171], // 青绿
      [92, 128, 188],  // 深蓝
      [243, 166, 191]  // 粉红
    ],
    sanyu: [
      [142, 51, 39],   // 深褐红
      [230, 225, 207], // 米白
      [44, 59, 42],    // 墨绿
      [161, 143, 122], // 暖灰
      [89, 39, 32]     // 赭红
    ],
    sanyu2: [
      [214, 199, 183], // 象牙白（人物肤色）
      [171, 138, 127], // 淡褐（背景常用色）
      [93, 101, 98],   // 深灰（轮廓线条）
      [224, 155, 137], // 淡粉（花瓣色）
      [71, 70, 62]     // 墨黑（花瓶色）
    ]
  };
  
  let colorPalette;
  let bgColor;
  let shapeColors;
  let shapeMaxRnd = 7 ;
  
  function initData(hseed){

    hseed = 'ZOoWdr1zAJPGNJbV'
    const hashids = new Hashids('76faccf3211631cf8b56cd1b89e6bf28', 16);

    hseed = hashids.decode(hseed)[0];
    console.log(hseed);
    randomSeed(hseed);

    noFill();
    //frameRate(1);
    rectMode(CENTER);
    noLoop();

    // 随机选择一个调色板
    let paletteKeys = Object.keys(palettes);
    let selectedPalette = random(paletteKeys);
    colorPalette = palettes[selectedPalette];
    console.log('使用调色板:', selectedPalette);
    
    // 随机选择一个颜色作为背景色
    let bgIndex = ~~random(colorPalette.length);
    bgColor = color(colorPalette[bgIndex]);
    
    // 创建形状颜色数组，移除被选为背景的颜色
    shapeColors = colorPalette.filter((_, index) => index !== bgIndex);
    shapeMaxRnd = ~~random(1,15);
  }
  
  let sarr = [];

  function renderMain() {
    background(bgColor);
    sarr = [];
    // let n = 30 ;
    // for(let i = 0 ; i < n ; i++){
    //   let x = 100 + random(600) ;
    //   let y = 100 + random(600) ;
    //   let w = ~~random(10,150);
    //   //console.log(x,y);
    //   drawShape(x,y,w);
    // }
  
    translate(width/2,height/2);
    scale(0.7);
    translate(-width/2,-height/2);
  
    let seg = 6 ;
    let w = width / seg ;
    let rnd = ~~random(3);
    for(let i = 0 ; i < seg ; i++){
      for(let j = 0 ; j < seg ; j++){
        let x = j * w + w / 2 ;
        let y = i * w + w / 2 ;
  
        let num = ~~random(5,60);
        for(let k = 0 ; k < num ; k++){
          let sw = w / 4 * random(1,6);
          let xnew = x;
          let ynew = y;
          if(rnd == 1){
            let offx = ~~random(-2,2) * w / 2 ;
            xnew += offx;
          }
          else if(rnd == 2){
            let offy = ~~random(-2,2) * w / 2 ;
            ynew += offy ;
          }
          if(random(10) < 3)
          {
            sarr.push({x:xnew,y:ynew,sw});
          }
        }
      }
    }
    shuffle(sarr,true);
    let r1 = random(25,50);
    let r2 = random(5,r1-5);
    for(let sobj of sarr){
      drawShape(sobj.x,sobj.y,sobj.sw,r1,r2);
    }
  }
  
  function drawShape(x,y,w,r1,r2){
    let shapeColor = color(random(shapeColors));
  
    let h = w / 4 * ~~random(1,6);
    push();
    translate(x,y);
    rotate(~~random(4) * HALF_PI);
    let rd = ~~random(shapeMaxRnd);
    // 随机选择一个形状颜色
    
    if(rd == 0)
    {
      stroke(bgColor);
      strokeWeight(r1);
      circle(0,0,w);
      stroke(shapeColor);
      strokeWeight(r2);
      circle(0,0,w);
    }
    else if(rd == 1)
    {
      stroke(bgColor);
      strokeWeight(r1);
      rect(0,0,w,h);
      stroke(shapeColor);
      strokeWeight(r2);
      rect(0,0,w,h);
    }
    else if(rd == 2)
    {
      stroke(bgColor);
      strokeWeight(r1);
      rect(0,0,w,w);
      stroke(shapeColor);
      strokeWeight(r2);
      rect(0,0,w,w);
    }
    else if(rd == 3)
    {
      stroke(bgColor);
      strokeWeight(r1);
      point(0,0);
      stroke(shapeColor);
      strokeWeight(r2);
      point(0,0);
    }
    else if(rd == 4)
    {
      stroke(bgColor);
      strokeWeight(r1);
      triangle(-w/2, w/2, 0, -w/2, w/2, w/2);
      stroke(shapeColor);
      strokeWeight(r2);
      triangle(-w/2, w/2, 0, -w/2, w/2, w/2);
    }
    else if(rd == 5){
      stroke(bgColor);
      strokeWeight(r1);
      ellipse(0,0,w,h);
      stroke(shapeColor);
      strokeWeight(r2);
      ellipse(0,0,w,h);
    }
    else if(rd == 6){
      stroke(bgColor);
      strokeWeight(r1);
      line(-w,0,w,0);
      stroke(shapeColor);
      strokeWeight(r2);
      line(-w,0,w,0);
    }
    pop();
  }