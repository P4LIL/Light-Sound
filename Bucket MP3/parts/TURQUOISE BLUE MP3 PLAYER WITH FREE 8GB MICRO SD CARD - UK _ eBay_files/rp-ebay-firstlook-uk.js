/**
* Rubicon Project: Solutions Engineering
* Client:          9456/eBay UK
* Name:            rp-ebay-firstlook.js
* Author:          Martin Hill
* Version:         1.2.1
* Description:     Custom tracking script for smart tag jc, first party data & click tracking
**/

// add indexOf for arrays for browsers that don't have native support, i.e. IE < 9.
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item) {
		var i = this.length;
		while (i--) {
			if (this[i] === item) return i;
		}
		return -1;
	}
}

// add array forEach function for browsers that don't have native support, i.e. IE < 9.
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}

// add array filter function for browsers that don't have native support, i.e. IE < 9.
if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun /*, thisp */) {
		"use strict";
		if (this == null)
			throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();

		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in t) {
				var val = t[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, t))
					res.push(val);
			}
		}
		return res;
	};
}

// add array cleaning function
if (!Array.prototype.clean) {
	Array.prototype.clean = function(deleteValue) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == deleteValue) {         
				this.splice(i, 1);
				i--;
			}
		}
		return this;
	}
}

// add JSON.stringify & parse functions for browsers that don't have native support, i.e. IE < 8.
if (!window.JSON) {
  window.JSON = {
    parse: function (sJSON) { return eval("(" + sJSON + ")"); },
    stringify: function (vContent) {
      if (vContent instanceof Object) {
        var sOutput = "";
        if (vContent.constructor === Array) {
          for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
          return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
        }
        if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
        for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ","; }
        return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
      }
      return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
    }
  };
}

// default initialisation object:
var rpx_defaults = {
	clk : false,  // click tracking:    true = enabled, false = disabled, default = false
	rtp : false,  // real time pricing: true = enabled, false = disabled, default = false
	dfp : 'http://ad-emea.doubleclick.net/N3847/adi/ebay.uk.search/keywordsLR;sz=160x600;',  // iframe base url for dfp ad stack
	oif : location.href,
	opg : document.referrer,
	dck : '',
	dbg : false
}

// initialisation object allowed keys
var keys = ['clk','rtp','dfp','oif','opg','dck','dbg','rpi'];

// check for initialisation object & sanitise keys
if (typeof rpx_init === 'object') {
	for (var key in rpx_init) {
		if (rpx_init.hasOwnProperty(key)) {
			if (keys.indexOf(key) < 0) {
				delete rpx_init[key];
			}
		}
	}
}

// initialise variables
var rpx_clk = (typeof rpx_init.clk === 'boolean' && rpx_init.clk) ? rpx_init.clk : rpx_defaults.clk;
var rpx_rtp = (typeof rpx_init.rtp === 'boolean' && rpx_init.rtp) ? rpx_init.rtp : rpx_defaults.rtp;
var rpx_dfp = (typeof rpx_init.dfp === 'string' && rpx_init.dfp.indexOf('//ad-emea.doubleclick.net') >= 0 ) ? rpx_init.dfp : rpx_defaults.dfp;
var rpx_src = (typeof rpx_init.oif === 'string' && rpx_init.oif.indexOf('//ad-emea.doubleclick.net') >= 0 ) ? rpx_init.oif : rpx_defaults.oif;
var rpx_url = (typeof rpx_init.opg === 'string' && rpx_init.opg.indexOf('//www.ebay.co.uk') >= 0 ) ? rpx_init.opg : rpx_defaults.opg;
var rpx_pck = (typeof rpx_init.dck === 'string' && rpx_init.dck.indexOf('http://') >= 0 ) ? rpx_init.dck : rpx_defaults.dck;
var rpx_dbg = (typeof rpx_init.dbg === 'boolean' && rpx_init.dbg) ? rpx_init.dbg : rpx_defaults.dbg;

// function to get values for given parameter name (v) from the given url (u)
var rqs = function(u,v)
{
	u = unescape(u);
	u = u.substring(u.indexOf(';')+1);
	v = v.toLowerCase();
	var o = '';
	var p = u.split(';');
	for (i=0;i<p.length;i++){
		var k = p[i].toLowerCase();
		// special case for combining category parameters 'cat' & 'tcat'
		if (v === 'cat') {
			if( k.indexOf(v) >= 0 ) {
				var pt = p[i].split('=');
				if (pt[0].toLowerCase() === v || pt[0].toLowerCase() === 'tcat') {
					o = o + pt[1] + ',';
				}
			}
		// special case for combining last viewed, bid, searched & bought parameters (f|s[vi|bi|se|bo])
		} else if (['vi','bi','se','bo'].indexOf(v) >= 0) {
			if( k.indexOf(v) >= 0 && ['f','s'].indexOf(k.substring(0,1)) >= 0 ) {
				var pt = p[i].split('=');
				if (pt[0].toLowerCase() === 'f'+v || pt[0].toLowerCase() === 's'+v) {
					o = o + pt[1] + ',';
				}
			}
		} else if (v === 'sz') {
			if( k.indexOf(v) >= 0 ) {
				var pt = p[i].split('=');
				o = pt[1] + ',';
			}
		} else {
			if( k.indexOf(v) >= 0 ) {
				var pt = p[i].split('=');
				if (pt[0].toLowerCase() === v) {
					o = o + pt[1] + ',';
				}
			}
		}
	}
	return o.substring(0,o.length-1) || '';
}

// filtering function v = data value, t = filter type
var rpf = function(v,t)
{
	var r;
	var k = ['aeg a modo mio favola lavazza','aeg lm5000re-u a','bargain shopping','blackberry','bosch t40 tas4011gb','bosch tas2002gb tassimo t20','bosch tassimo','buy now pay 12 months later','buy now pay later','buy now pay later tv','buy wallpaper','carpet cleaner','catalog','catalogs','catalogue','catalogues','catologues','cheap bras','citroen berlingo','citroen c1','citroen c2','citroen c3','citroen c4','citroen estate','citroen nemo','citroen picasso','delonghi en520.s nespresso lattissima plus','dolce gusto','doro phone easy','dulce gusto capsule','dulce gusto capsule machine','dulce gusto capsule maker','fiat 500l','fiat bravo','fiat ducato','fiat panda','ford b-max','ford c-max','ford fiesta','ford focus','ford focus estate','ford galaxy','ford ka','ford mondeo estate','ford s-max','ford transit','ford transit connect','ford transit custom','francis illy','home shopping','home shopping catalogues','honda civic','honda estate','honda jazz','htc desire','htc one','htc one m8','htc one mini','hyundai estate','hyundai i10','hyundai i20','hyundai i30','hyundai tourer','iphone 5c','iphone 5s','iphone 6','iveco daily','kenwood kmix cm022','kia carens','kia ceed','kia ceed sportswagen','kia estate','kia picanto','ladies occasion tops','laptops','laptops on finance','lavazza moda mio','lg l40','lg l50','lg optimus f7','lofbergs uk caffitaly','mazda 2','mazda 3','mazda 5','mazda 6 tourer','mazda estate','mercedes citan','mercedes sprinter','mercedes vito','morphy richards cafe mattino 47070','motorola moto e','motorola moto g','nespresso','nespresso capsule','nespresso citiz and milk m190','nespresso coffee machine','nespresso coffee maker','nespresso inissia','nissan micra','nissan note','nokia 301','nokia lumia 301','nokia lumia 630','nokia lumia 635','nokia lumia 930','nook ereaders','peugeot 107','peugeot 208','peugeot 308','peugeot 5008','peugeot estate','peugeot partner','peugeot tourer','philips senseo','philips senseo quadrante hd7860/60','renault clio','renault estate','renault kangoo','renault master','renault megane','renault scenic','renault trafic','renault twingo','russell hobbs 14597','samsung galaxy ace','samsung galaxy alpha','samsung galaxy fame','samsung galaxy s3','samsung galaxy s3 mini','samsung galaxy s4','samsung galaxy s4 mini','samsung galaxy s5','samsung galaxy s5 mini','samsung galaxy young','seat estate','seat ibiza','seat leon','seat leon st','seat mii','senseo','sony xperia m','sony xperia sp','sony xperia z','sony xperia z2','starbucks verismo','steam cleaner','studio catalog','tassimo','toyota aruis','toyota avensis estate','toyota aygo','toyota verso','underware','vauxhall adam','vauxhall astra','vauxhall corsa','vauxhall estate','vauxhall movano','vauxhall tourer','vauxhall zafira','volkswagen passat estate','volvo estate','volvo v40','vw caddy','vw crafter','vw golf','vw passat estate','vw polo','vw sharan','vw transporter','vw up','assassin\'s creed_','backless bra_','bioshock_','burnout_','call of duty_','catalog_','catalogue_','catalogueco uk_','catologes_','catologues_','citroen berlingo_','citroen c1_','citroen c2_','citroen c3_','citroen c4_','citroen estate_','citroen picasso_','clothes shoppingonline_','clothes shops online_','clothesshops online_','dead space_','department store_','destiny_','fallout_','fiat 500l_','fiat bravo_','fiat panda_','ford b-max_','ford c-max_','ford fiesta_','ford focus estate_','ford focus_','ford galaxy_','ford ka_','ford mondeo estate_','ford s-max_','god of war_','gta_','halo_','home shoping_','honda civic_','honda estate_','honda jazz_','hyundai estate_','hyundai i10_','hyundai i20_','hyundai i30_','hyundai tourer_','kia carens_','kia ceed sportswagen_','kia ceed_','kia estate_','kia picanto_','killzone_','ladies clarks shoes_','mail order_','mario_','mazda 2_','mazda 3_','mazda 5_','mazda 6 tourer_','mazda estate_','nintendo_','nissan micra_','nissan note_','nokia_','peugeot 107_','peugeot 208_','peugeot 308_','peugeot 5008_','peugeot estate_','peugeot tourer_','playstation_','ps2_','ps3_','ps4_','renault clio_','renault estate_','renault megane_','renault scenic_','renault twingo_','rock band_','seat estate_','seat ibiza_','seat leon st_','seat leon_','seat mii_','shops online_','toyota aruis_','toyota avensis estate_','toyota aygo_','toyota verso_','uk catalogue company_','vauxhall adam_','vauxhall astra_','vauxhall corsa_','vauxhall estate_','vauxhall tourer_','vauxhall zafira_','volkswagen passat estate_','volvo estate_','volvo v40_','vw golf_','vw passat estate_','vw polo_','vw sharan_','vw up_','wii u_','wii_','xbox 360_','xbox_','accord$','Adidas$','advent$','aeg$','alcatel$','alhambra$','alpha$','altea$','ampera$','android tablet$','android$','antara$','antivirus$','antler suitcase$','apartments$','apple$','appliance$','asics$','aspire$','astra$','asus$','audi a1$','audi a3$','audi a4$','avengers$','b max$','b-max$','bathroom$','beach$','beko$','bench$','bissell$','blackberry$','bmax$','bmw 3 series$','bmw$','boiler$','bosch$','bose$','bourjois beauty$','bras$','buggies$','buggy$','bungalow$','buy now pay later$','cabinet$','caddy$','camcorder$','camera$','camping$','campsite$','cannondale$','captain america$','car seat$','caravan$','carpet$','carrera$','castelli$','catalog$','cataloge$','catalogue request$','catalogue uk$','catalogue$','catologe$','chalet$','chewbacca$','citan$','citroen berlingo$','citroen c1$','citroen c2$','citroen c3$','citroen c4 cactus$','citroen c4 picasso$','citroen c4$','citroen dispatch$','citroen estate$','citroen gc4p$','citroen picasso$','citroen relay$','civic$','clothing womens$','co ord$','co-ord$','co-ordinates$','computer$','converse$','cooker$','coord$','corsa$','cosmopolitan$','cots$','cr v$','cr-v$','crafter$','cruise$','crv$','cupboard$','daily$','daredevil$','diesel$','dirty dog$','dishwasher$','diy$','dolce & gabbana$','dresses$','dryer$','ds3$','ds4$','ds5$','ducato$','duck and cover$','dulux$','dyson$','eastpack$','electrolux$','electronic$','emporio armani$','epson$','eye frames$','eyeglasses frames$','eyeglasses$','fashion tights$','fat face$','fiat 500$','fiat 500l$','fiat bravo$','fiat doblo cargo$','fiat panda$','fiesta$','fifa$','Fila$','fleet$','flight$','floorboards$','flooring$','football$','ford b max$','ford b-max$','ford c-max$','ford fiesta$','ford focus estate$','ford focus$','ford galaxy$','ford ka$','ford mondeo estate$','ford new transit$','ford s-max$','ford transit connect$','ford transit custom$','freezer$','fridge freezer$','fridge$','gadget$','galaxy tab$','galaxy$','game of thrones$','garmin$','glasses direct$','glasses frames$','glasses$','gore$','grout$','gucci$','Gym$','h&m$','hackett london$','harrington$','haven$','headphones$','heater$','henry$','holiday$','home shopping$','honda civic$','honda estate$','honda jazz$','honda$','hoodies & sweatshirts$','hoover$','hotel$','hotpoint$','htc$','hyundai estate$','hyundai i10$','hyundai i20$','hyundai i30$','hyundai tourer$','ibiza$','indesit$','ink$','insignia$','ipad$','iphone$','iron man$','ix20$','jawbone$','jazz car$','jazz$','jeans$','jedi$','jeff banks$','jil sander$','jimmy choo$','john lennon$','jones new york$','Jordan$','jumpsuits$','kangol$','kangoo$','karl lagerfeld$','kenwood$','kia carens$','kia ceed sportswagen$','kia ceed$','kia estate$','kia picanto$','kimonos$','kindle$','kitchen curtains$','kitchen$','knitwear$','krups$','Lacoste$','ladies coats$','ladies nightwear$','ladies slippers$','laminate$','laptop$','leggings$','leon$','lg$','lighting$','lipsy$','lodge$','london retro$','lucky brand$','luggage$','lumia$','macbook air$','macbook pro$','macbook$','Marathon$','marc by marc jacobs$','marvel$','mascara$','master$','maternity$','mazda 2$','mazda 3$','mazda 5$','mazda 6 tourer$','mazda estate$','mens levi jeans$','mercedes a-class$','mercedes e-class$','mercedes new sprinter$','mercedes vito$','meriva$','microsoft$','microwave$','mii$','mini cman$','mini$','miss kg$','miss selfridge$','mobile home$','mobile phone$','mokka$','monsoon$','mop$','movano$','nautica$','nemo$','new renault trafic$','nexus$','Nike$','nissan juke$','nissan micra$','nissan note$','nissan qashqai$','nokia$','notebook$','numatic$','o2$','oakley$','occasion dresses$','on line shopping$','online catalogue$','online-shopping$','oven$','ovulation$','packard bell$','paint$','panasonic$','park resorts$','partner$','peter werth$','petite$','peugeot 107$','peugeot 108$','peugeot 2008$','peugeot 208$','peugeot 308$','peugeot 5008$','peugeot estate$','peugeot new boxer$','peugeot tourer$','photocopier$','plus size$','polaroid$','polo hatchback$','polo$','potty$','prada sport$','pregnancy$','prescription eye frames$','prescription eyeglasses$','prescription glasses$','prescription specs$','prescription spectacles$','printer$','Puma$','pushchair$','radiator$','ray-ban$','red curtains$','Reebok$','reins$','religion$','renault captur$','renault clio$','renault estate$','renault kangoo$','renault megane$','renault new master$','renault scenic$','renault twingo$','river island$','Rugby$','Running$','samsonite$','samsung tablet$','samsung$','scanner$','sceats$','scout$','seaside$','seat alhambra$','seat estate$','seat ibiza$','seat leon st$','seat leon$','seat mii$','seat$','self catering$','serum$','shelf$','shelving$','shorts$','sim card$','sim only$','skirts$','skoda yeti$','sky box$','skywalker$','sleeping$','Soccer$','software$','sony ericsson$','sony$','speaker$','specialized$','specs frames$','specs$','spectacles frames$','spectacles$','spiderman$','Sport$','sports$','sprinter$','star wars$','stella mccartney$','stvdio by jeff banks$','suitcase$','sun cream$','sun hat$','sunglasses$','suntan$','superdry$','superhero$','surface$','swimwear$','tablet$','tall$','tap$','ted baker$','television$','tent$','thor$','tile$','toledo$','tommy hilfiger$','toshiba$','tourer$','toyota aruis$','toyota auris$','toyota avensis estate$','toyota aygo$','toyota prius$','toyota verso$','toyota yaris$','Tracksuit$','trafic$','trainers$','Training$','transit$','transporter$','travel system$','travel$','trousers$','tv$','underlay$','unit$','vacuum$','vader$','vauxhall adam$','vauxhall astra$','vauxhall combo$','vauxhall corsa$','vauxhall estate$','vauxhall mokka$','vauxhall tourer$','vauxhall vivaro$','vauxhall zafira$','vauxhall$','vax$','vito$','vodafone$','volkswagen passat estate$','volvo estate$','volvo s40/v40$','volvo v40$','vw caddy$','vw crafter$','vw golf$','vw passat estate$','vw polo$','vw sharan$','vw touran$','vw transporter$','vw up$','washing machine$','what to expect$','wolverine$','worktop$','x-perience$','xperia$','yaris$','zafira$'];
    var c = ['1','57','81','137','162','165','177','179','220','222','233','237','246','260','267','281','293','299','312','422','436','519','550','617','618','619','625','631','717','767','870','888','1039','1059','1082','1093','1188','1249','1261','1280','1281','1286','1293','1305','1424','1492','1509','1513','2329','2562','2613','2616','2624','2631','2984','3034','3082','3089','3090','3091','3094','3103','3104','3116','3126','3153','3187','3197','3199','3252','3253','3259','3270','3286','3516','3676','4250','4251','4388','7294','7301','9355','9394','9800','9801','9834','9835','9837','9843','9844','9855','9858','9859','9860','9861','9872','9873','9884','10033','10290','10542','11071','11116','11176','11189','11232','11233','11330','11450','11452','11462','11700','11724','11731','11743','11778','11783','11827','11838','11848','11854','11863','11874','11890','12576','13340','13881','13905','14024','14308','14324','14339','14737','14761','14768','14770','14780','14961','14969','15032','15069','15200','15273','15628','15709','15724','16021','16034','16045','16052','16059','16078','16080','16086','16092','16258','16262','16486','18174','18179','18180','18183','18185','18186','18187','18206','18211','18230','18238','18262','18263','18270','18275','18276','18277','18283','18290','18306','18793','18991','19068','19169','19259','19266','20081','20394','20400','20416','20433','20438','20444','20498','20514','20540','20558','20571','20625','20667','20697','20710','20727','20734','20737','20742','20754','20835','20846','20862','21194','21205','21214','21225','21233','21247','21557','21563','21567','22709','23022','23806','25298','25614','25616','25863','26395','26396','28141','28162','29495','29505','29515','29518','29585','29748','29751','29792','30078','30090','30100','30105','30164','30896','31388','31414','31491','31530','31605','31606','31762','31769','31772','31786','31817','31822','32254','32762','32852','33164','33485','33549','33559','33579','33605','33726','33752','33820','33914','34814','36085','36121','36259','36279','36447','36628','37578','37631','38204','38208','38219','38250','38331','38708','38726','40005','40019','40141','40154','41964','41968','41986','42154','42231','43114','43502','43554','43560','43563','44704','45065','45090','45455','45733','47945','48446','48458','48579','48644','48757','49019','50175','50541','52473','52529','52636','53159','53676','54968','56169','57211','57881','57929','57974','58058','60805','61300','61409','61687','61862','62166','63511','63512','63514','63732','63821','63861','63862','63863','64353','64354','64482','64685','66692','66697','66698','67588','67659','69323','71258','71582','72575','73839','74050','75328','75579','75580','79792','80546','82099','86722','87167','91596','93427','93632','93838','95672','97072','98952','98982','99192','100978','100982','106460','108779','108780','109072','109199','111418','111422','112425','112529','112661','116023','116026','116503','116504','116505','116506','116507','117103','117146','117165','121902','121904','121975','121976','121977','121978','122308','122908','123687','123813','131090','134282','134590','139971','139973','146492','149242','150045','155240','157967','158671','158990','159719','159912','162497','163147','169291','169484','169485','169487','170587','170588','170589','170590','170591','170592','170593','170594','171146','171228','171243','171318','171485','171957','171961','172008','172187','172206','172378','174059','174107','174111','174123','175672','175673','175698','175740','175747','175759','175837','176970','176983','176984','176985','176988','177017','177032','177073','177074','177599','177731','177831','177864','178893','178894','179060'];
	if (t === 'kw') {
		r = ''; m = false;
		if (v.indexOf(',') >= 0) {
			f = function(e,i,a)
			{
				var z = ''; w = v.split(',');
				for (var i=0;i<w.length;i++) {
					rw = ''; m = false;
					if (typeof w[i] === 'string' && typeof w[i] !== 'undefined') z = w[i];
					el = e.toLowerCase();
					kw = decodeURIComponent(z.replace(/[+]/g,' ')).toLowerCase();
					if (kw !== '' && m === false) {
						if  (el.substring(el.length-1,el.length) === '_') {  // broad match $<keyword(s)>$
							bm = el.substring(0,el.length-1);
							if (kw.indexOf(bm) >= 0) { rw = el; m = true; }
						} else if (el.substring(el.length-1,el.length) === '$') { // wildcard match <keyword(s)>$
							wm = el.substring(0,el.length-1);
							if (kw.indexOf(wm) === 0) { rw = el; m = true; }
						} else { // exact match <keyword(s)>
							if (el === kw) { rw = el; m = true; }
						}
					}
					if (rw.length > 0) r += rw + ',';
				}
			}
			k.forEach(f);
			if (r.substring(r.length-1,r.length) === ',') r = r.substring(0,r.length-1);
		} else {
			f = function(e,i,a)
			{
				el = e.toLowerCase();
				kw = decodeURIComponent(v.replace(/[+]/g,' ')).toLowerCase();
				if (kw !== '' && m === false) {
					if  (el.substring(el.length-1,el.length) === '_') {  // broad match $<keyword(s)>$
						bm = el.substring(0,el.length-1);
						if (kw.indexOf(bm) >= 0) { r = el; m = true; }
					} else if (el.substring(el.length-1,el.length) === '$') { // wildcard match <keyword(s)>$
						wm = el.substring(0,el.length-1);
						if (kw.indexOf(wm) === 0) { r = el; m = true; }
					} else { // exact match <keyword(s)>
						if (el === kw) { r = el; m = true; }
					}
				}
			}
			k.forEach(f);
		}
	}
	if (t === 'cat') {
		r = '';
		if (v.indexOf(',') >= 0 ) {
			var a,b=[];
			a = v.split(',');
			function al(e,i,a) { // allowed value filtering function
				if (c.indexOf(e) !== -1) { b[i] = e }
			}
			a.forEach(al); // allow only defined values
			function af(e,i,a) { // duplicate filtering function
				if (a.indexOf(e) !== i) { b[i] = undefined }
			}
			b.filter(af); // remove duplicates
			if (b.length > 1) {
				b = b.clean(undefined); // remove undefined values to tidy up array
				r = b.join(',');
			} else if (b.length === 1){
				b = b.clean(undefined); // remove undefined values to tidy up array
				r = b[0];
			} else {
				r = '';
			}
		} else {
			r = (c.indexOf(v) >= 0) ? v : '';
		}
	}
	return r;
}

var rtp = function()
{
	var t = '';
	if (rpx_rtp) {
		try {
			var r = new RubiconInsight();
			t = r.getAsDFPKeyValues(rp_valuation.estimate) + r.getAsDFPKeyValues(rp_valuation.pmp);
		} catch(e) { }
	}
	return t;
}

// process ad response on callback function
rpc = function(rs)
{
	if (rs.status === 'ok') {
		var ad;
		var html;
		for (var i=0; i < rs.ads.length; i++) {
			ad = rs.ads[i];
			if (ad.status === 'ok') {
				if (ad.type === 'script') {
					document.write('<script type=\'text/javascript\'>'+ad.script+'</scr'+'ipt>');
				}
				if (ad.type === 'html') {
					document.write(ad.html);
				}
				// Publisher impression tracking could be added here
				clk();
			} else {
				rpx_params.dfp.u += rtp();
				rpx_params.dfp.u += ';rpg='+encodeURIComponent(rpx_params.data.u);
				document.write('<iframe id=\'rtm_iframe_srplr\' name=\'rtm_iframe_srplr\' title=\'ADVERTISEMENT\' src='+rpx_params.dfp.u+' width=\''+rpx_params.dfp.w+'\' height=\''+rpx_params.dfp.h+'\' marginwidth=\'0\' marginheight=\'0\' hspace=\'0\' vspace=\'0\' frameborder=\'0\' scrolling=\'no\'><\/iframe>');

			}
		}
	}
}

// click tracking functions
var clk = function()
{
	var oif = false;
	var m_out = function() { oif = false; self.blur(); window.focus(); if (rpx_dbg) { console.log('clk.m_out.focus'); }; }
	var m_over = function() { oif = true; if (rpx_dbg) { console.log('clk.m_over.focus'); }; }
	var if_clk = function() {
		if(oif) {
			var adm  = '';
			adm = (typeof rpx_response !== 'undefined');
			if (adm) {
				var a = rpx_response.account;
				var s = rpx_response.site;
				var z = rpx_response.zone;
				var e = rpx_response.size;
				var d = rpx_response.ad;
				var c = rpx_response.creative;
                var i = rpx_response.imp_id;
				var u = 'http://optimized-by.rubiconproject.com/t/'+a+'/'+s+'/'+z+'-'+e+'.'+d+'.'+c+'?url=0';
				var b = 'http://beacon.rubiconproject.com/beacon/t/'+i+'?url=0';
			}
			if (typeof u === 'string') { var ct = new Image(); ct.src = u; console.log(u); }
			if (typeof b === 'string') { var bc = new Image(); bc.src = b; console.log(b); }
			if (rpx_pck !== '') { var pc = new Image(); pc.src = rpx_pck; console.log(rpx_pck); }
			if (rpx_dbg) { console.log('clk.if_click') };
		}
	}

	var init = function() {
		var element = document.getElementById('rp-clk-fl');
		element.onmouseover = m_over;
		element.onmouseout = m_out;
	
		if (typeof window.attachEvent !== 'undefined') {
			attachEvent('onblur', if_clk);
			if (rpx_dbg) { console.log('clk.attachEvent.onblur') };
		} else if (typeof window.addEventListener !== 'undefined') {
			addEventListener('blur', if_clk, false);
			if (rpx_dbg) { console.log('clk.addEventListener.onblur') };
		}
	}
	if (rpx_clk) { init(); if (rpx_dbg) { console.log('clk.init') }; }
}

// sessionstorage / cookie set function n = name, v = value, x = expiry (days)
rpsc = function(n,v,x)
{
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.setItem(n,v);
	} else {
		var xd = new Date();
		xd.setDate(xd.getDate() + x);
		var cv = escape(v) + ((xd === null) ? '' : '; expires=' + xd.toUTCString());
		document.cookie = n + '=' + cv;
	}
}

// parameters object & macros
rpx_params                         = {};
rpx_params.data                    = {};
rpx_params.data.u                  = rpx_url;
rpx_params.dfp                     = {};
rpx_params.dfp.u                   = rpx_dfp+rpx_src.substring(rpx_src.indexOf(';')+1);
rpx_params.dfp.w                   = rqs(rpx_src,'sz').substring(0,rqs(rpx_src,'sz').indexOf('x'));
rpx_params.dfp.h                   = rqs(rpx_src,'sz').substring(rqs(rpx_src,'sz').indexOf('x')+1,rqs(rpx_src,'sz').indexOf('x').length);
//rpx_params.kw                      = rpf(rqs(rpx_src,'kw'),'kw');
rpx_params.visitor                 = {};
rpx_params.inventory               = {};
rpx_params.visitor.age             = rqs(rpx_src,'um');
rpx_params.visitor.acorn           = rqs(rpx_src,'ac');
rpx_params.visitor.gender          = rqs(rpx_src,'us');
rpx_params.visitor.viewed          = rpf(rqs(rpx_src,'vi'),'cat');
rpx_params.visitor.bid             = rpf(rqs(rpx_src,'bi'),'cat');
rpx_params.visitor.searched        = rpf(rqs(rpx_src,'se'),'cat');
rpx_params.visitor.bought          = rpf(rqs(rpx_src,'bo'),'cat');
rpx_params.visitor.interests       = rqs(rpx_src,'seg');
//rpx_params.visitor.postcode        = rqs(rpx_src,'uz');
rpx_params.inventory['search']     = rpf(rqs(rpx_src,'kw'),'kw');
rpx_params.inventory.categories    = rpf(rqs(rpx_src,'cat'),'cat');
rpx_params.inventory.subcategories = rpf(rqs(rpx_src,'cat'),'cat');

if (rpx_init !== 'undefined' && typeof(rpx_init.rpi === 'object')) {
	for (var key in rpx_init.rpi) {
		if (rpx_init.rpi.hasOwnProperty(key)) {
			if (rpx_init.rpi[key] && (typeof rpx_init.rpi[key] == 'string' || typeof rpx_init.rpi[key] == 'number')) {
				rpx_params.inventory[key] = rpx_init.rpi[key];
			}
		}
	}
}

// debugging
console.log(rpx_params);

// set session cookie containing rp_params object
if (rpx_params && typeof rpx_params === 'object') {
	rpsc('rpx_params',JSON.stringify(rpx_params), Date()-1);
}


