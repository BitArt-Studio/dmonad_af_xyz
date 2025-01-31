// ProjectName: Maya Fresco

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
  
    noFill();
    frameRate(1);
    rectMode(CENTER);
    noLoop();

    const hashids = new Hashids('76faccf3211631cf8b56cd1b89e6bf28', 16);
    hseed = hashids.decode(hseed)[0];
    randomSeed(hseed);


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


! function(t, e) {
	"object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define("Hashids", [], e) : "object" == typeof exports ? exports.Hashids = e() : t.Hashids = e()
}(self, () => (() => {
	"use strict";
	var n = {
			d: (t, e) => {
				for (var i in e) n.o(e, i) && !n.o(t, i) && Object.defineProperty(t, i, {
					enumerable: !0,
					get: e[i]
				})
			},
			o: (t, e) => Object.prototype.hasOwnProperty.call(t, e)
		},
		t = {};
	n.d(t, {
		default: () => e
	});
	const s = t => "bigint" == typeof t || !Number.isNaN(Number(t)) && Math.floor(Number(t)) === t,
		r = t => "bigint" == typeof t || 0 <= t && Number.isSafeInteger(t);

	function g(t, n) {
		if (0 === n.length) return t;
		const s = [...t];
		for (let t = s.length - 1, e = 0, i = 0; 0 < t; t--, e++) {
			e %= n.length, i += r = n[e].codePointAt(0);
			var r = (r + e + i) % t,
				h = s[t],
				o = s[r];
			s[r] = h, s[t] = o
		}
		return s
	}
	const h = /^\+?\d+$/,
		p = t => new RegExp(t.map(t => c(t)).sort((t, e) => e.length - t.length).join("|")),
		c = t => t.replace(/[\s#$()*+,.?[\\\]^{|}-]/g, "\\$&"),
		o = (t = "BigInt is not available in this environment") => {
			if ("function" != typeof BigInt) throw new TypeError(t)
		};
	class e {
		constructor(t = "", e = 0, i = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", n = "cfhistuCFHISTU") {
			if ("number" != typeof(this.minLength = e)) throw new TypeError(`Hashids: Provided 'minLength' has to be a number (is ${typeof e})`);
			if ("string" != typeof t) throw new TypeError(`Hashids: Provided 'salt' has to be a string (is ${typeof t})`);
			if ("string" != typeof i) throw new TypeError(`Hashids: Provided alphabet has to be a string (is ${typeof i})`);
			const s = Array.from(t),
				r = Array.from(i),
				h = Array.from(n),
				o = (this.salt = s, [...new Set(r)]);
			var a;
			if (o.length < 16) throw new Error("Hashids: alphabet must contain at least 16 unique characters, provided: " + o.join(""));
			this.alphabet = (a = h, o.filter(t => !a.includes(t)));
			l = o;
			var l, e = h.filter(t => l.includes(t)),
				n = (this.seps = g(e, s), (0 === this.seps.length || 3.5 < this.alphabet.length / this.seps.length) && ((t = Math.ceil(this.alphabet.length / 3.5)) > this.seps.length && (i = t - this.seps.length, this.seps.push(...this.alphabet.slice(0, i)), this.alphabet = this.alphabet.slice(i))), this.alphabet = g(this.alphabet, s), Math.ceil(this.alphabet.length / 12));
			this.alphabet.length < 3 ? (this.guards = this.seps.slice(0, n), this.seps = this.seps.slice(n)) : (this.guards = this.alphabet.slice(0, n), this.alphabet = this.alphabet.slice(n)), this.guardsRegExp = p(this.guards), this.sepsRegExp = p(this.seps), this.allowedCharsRegExp = (e = [...this.alphabet, ...this.guards, ...this.seps], new RegExp(`^[${e.map(t=>c(t)).sort((t,e)=>e.length-t.length).join("")}]+$`))
		}
		encode(t, ...e) {
			let i = Array.isArray(t) ? t : [...null != t ? [t] : [], ...e];
			return 0 === i.length ? "" : (i = i.every(s) ? i : i.map(t => {
				if ("bigint" == typeof t || "number" == typeof t) return t;
				t = String(t);
				if (!h.test(t)) return Number.NaN;
				var e = Number.parseInt(t, 10);
				return Number.isSafeInteger(e) ? e : (o("Unable to encode the provided BigInt string without loss of information due to lack of support for BigInt type in the current environment"), BigInt(t))
			})).every(r) ? this._encode(i).join("") : ""
		}
		decode(t) {
			return t && "string" == typeof t && 0 !== t.length ? this._decode(t) : []
		}
		encodeHex(t) {
			let e = t;
			switch (typeof e) {
				case "bigint":
					e = e.toString(16);
					break;
				case "string":
					if (/^[\dA-Fa-f]+$/.test(e)) break;
					return "";
				default:
					throw new Error(`Hashids: The provided value is neither a string, nor a BigInt (got: ${typeof e})`)
			}
			i = e, n = t => Number.parseInt("1" + t, 16);
			var i, n, t = Array.from({
				length: Math.ceil(i.length / 12)
			}, (t, e) => n(i.slice(12 * e, 12 * (e + 1))));
			return this.encode(t)
		}
		decodeHex(t) {
			return this.decode(t).map(t => t.toString(16).slice(1)).join("")
		}
		isValidId(t) {
			return this.allowedCharsRegExp.test(t)
		}
		_encode(s) {
			let r = this["alphabet"];
			var t = s.reduce((t, e, i) => t + ("bigint" == typeof e ? Number(e % BigInt(i + 100)) : e % (i + 100)), 0);
			let h = [r[t % r.length]];
			const o = [...h],
				a = this["seps"],
				e = this["guards"];
			if (s.forEach((t, e) => {
					var i = o.concat(this.salt, r);
					const n = ((t, e) => {
						const i = [];
						let n = t;
						if ("bigint" == typeof n) {
							const t = BigInt(e.length);
							for (; i.unshift(e[Number(n % t)]), (n /= t) > BigInt(0););
						} else
							for (; i.unshift(e[n % e.length]), 0 < (n = Math.floor(n / e.length)););
						return i
					})(t, r = g(r, i));
					if (h.push(...n), e + 1 < s.length) {
						const s = n[0].codePointAt(0) + e,
							r = "bigint" == typeof t ? Number(t % BigInt(s)) : t % s;
						h.push(a[r % a.length])
					}
				}), h.length < this.minLength) {
				const s = (t + h[0].codePointAt(0)) % e.length;
				if (h.unshift(e[s]), h.length < this.minLength) {
					const s = (t + h[2].codePointAt(0)) % e.length;
					h.push(e[s])
				}
			}
			for (var i = Math.floor(r.length / 2); h.length < this.minLength;) {
				r = g(r, r), h.unshift(...r.slice(i)), h.push(...r.slice(0, i));
				const s = h.length - this.minLength;
				if (0 < s) {
					const r = s / 2;
					h = h.slice(r, r + this.minLength)
				}
			}
			return h
		}
		_decode(t) {
			if (!this.isValidId(t)) throw new Error(`The provided ID (${t}) is invalid, as it contains characters that do not exist in the alphabet (${this.guards.join("")}${this.seps.join("")}${this.alphabet.join("")})`);
			const e = t.split(this.guardsRegExp),
				i = e[3 === e.length || 2 === e.length ? 1 : 0];
			if (0 === i.length) return [];
			const n = i[Symbol.iterator]().next().value,
				s = i.slice(n.length).split(this.sepsRegExp);
			let r = this.alphabet;
			const h = [];
			for (const t of s) {
				const e = g(r, [n, ...this.salt, ...r].slice(0, r.length));
				h.push(((n, s) => n.reduce((t, e) => {
					e = s.indexOf(e);
					if (-1 === e) throw new Error(`The provided ID (${n.join("")}) is invalid, as it contains characters that do not exist in the alphabet (${s.join("")})`);
					if ("bigint" == typeof t) return t * BigInt(s.length) + BigInt(e);
					var i = t * s.length + e;
					return Number.isSafeInteger(i) ? i : (o("Unable to decode the provided string, due to lack of support for BigInt numbers in the current environment"), BigInt(t) * BigInt(s.length) + BigInt(e))
				}, 0))(Array.from(t), e)), r = e
			}
			return this._encode(h).join("") !== t ? [] : h
		}
	}
	return t.default
})());
