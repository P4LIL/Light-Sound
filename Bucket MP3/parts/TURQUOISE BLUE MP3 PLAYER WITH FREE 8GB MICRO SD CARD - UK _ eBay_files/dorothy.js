
        

/*! Copyright 2009,2010 the Rubicon Project.  All Rights Reserved.  No permission is granted to use, copy or extend this code */

oz_partner = "rubicon";


function RubiconInsight(){this.config={statichost:"http://tap-cdn.rubiconproject.com",hosts:{insight:"http://tap.rubiconproject.com",valuation:"http://anvil.rubiconproject.com",stats:"http://tap.rubiconproject.com"}};this.default_context={oz_partner:"rubicon",oz_partner_user_id:null,oz_partner_channel:null,oz_partner_tracking:null,oz_ad_slot_size:null,oz_ad_slot_sizes:null,oz_rtb_demand:true,oz_price_bands:[0,5,20,50,100,200,400],oz_price_fuzz:{bias:0,scale:1.05},oz_api:"insight",oz_api_key:null,oz_view:null,oz_ad_server:null,oz_callback:null,oz_estimation_mode:"full",stats_sample:0,beacon_sample:100,coeffs_sample:0,min_pacing:0.5,allow_uncapped:true,allow_partner:true,rtb_cap:20,emit_cpm:false,oz_async:false,oz_cached_only:false};
this.context=null;this.init=function(C){try{if(C){this.context=this.mergeProperties(C,this.default_context);}else{this.context=this.default_context;}var B;var J=["api","ad_slot_size","ad_slot_sizes","price_bands","ad_server","callback","zone","ad_size_id","async","cached_only"];for(var F=0;F<J.length;
F++){B=J[F];this.context["oz_"+B]=this.context["rp_"+B]||this.context["oz_"+B];}if(this.context.rp_account&&this.context.rp_site){this.context.oz_site=this.context.rp_account+"/"+this.context.rp_site;}else{var E=this.context.oz_site.split("/");this.context.rp_account=new Number(E[0]).valueOf();this.context.rp_site=new Number(E[1]).valueOf();
}if(this.context.rp_zonesize){var G=this.context.rp_zonesize.split("-");this.context.rp_zone=G[0];this.context.rp_size_id=G[1];this.context.oz_zone=this.context.rp_zone;this.context.oz_ad_size_id=this.context.rp_size_id;}var I={9262:true,1110:true,7891:true,10677:true,1019:true};this.context.emit_cpm=I[this.context.rp_account]||this.context.emit_cpm;
var D={8488:1};this.context.beacon_sample=D[this.context.rp_account]||this.context.beacon_sample;this.context.stats_sample=D[this.context.rp_account]||this.context.stats_sample;if(this.context.oz_host&&this.context.oz_api){this.config.hosts[this.context.oz_api]=this.context.oz_host;}if(this.context.oz_statichost){this.config.statichost=this.context.oz_statichost;
}if(typeof oz_insight_config!="undefined"&&this.context.oz_api){this.copyProperties(oz_insight_config[this.context.oz_api],this.context);}if(typeof oz_insight_config_site!="undefined"&&this.context.oz_api){this.copyProperties(oz_insight_config_site[this.context.oz_api],this.context);}}catch(H){}};this.oz_scripts_loaded={};
this.addScript=function(C,D){var B;if(this.oz_scripts_loaded[C]){return ;}this.oz_scripts_loaded[C]=true;B=document.createElement("script");if(D){B.setAttribute("id",D);}B.setAttribute("type","text/javascript");C=C.replace(/\s/g,"+");B.setAttribute("src",C);document.getElementsByTagName("head").item(0).appendChild(B);
};this.trim=function(B){return B.replace(/^\s+|\s+$/g,"");};this.mergeProperties=function(C,B){if(typeof (C)=="undefined"||!C){return B;}if(typeof (B)=="undefined"||!B){return new Object();}for(var D in B){if(!B.hasOwnProperty(D)){continue;}if(typeof C[D]=="undefined"){C[D]=B[D];}}return C;};this.copyProperties=function(C,D){if(typeof C=="undefined"||!C){return D;
}for(var B in C){D[B]=C[B];}return D;};this.addParam=function(B,C){if(C){return"&"+B+"="+C;}return"";};this.start=function(){if(this.context.oz_api=="insight"){this.fetchInsight();}if(this.context.oz_api=="valuation"){this.fetchValuation();}};this.fetchInsight=function(){var B;if(this.insightRetrieved){return ;
}this.insightRetrieved=true;if(!this.context.oz_partner_channel){return ;}try{B=this.config.hosts.insight+"/partner/agent/"+this.context.oz_partner+"/"+this.context.oz_api+".js?";if(this.context.oz_api_key){B+="&ak="+this.context.oz_api_key;}if(this.context.oz_partner_user_id){B+="&afu="+this.context.oz_partner_user_id;
}if(this.context.oz_partner_channel){B+="&pc="+this.context.oz_partner_channel;}if(this.context.oz_partner_tracking){B+="&ptc="+this.context.oz_partner_tracking;}if(this.context.oz_view){B+="&uv="+this.context.oz_view;}if(this.context.oz_ad_server){B+="&as="+this.context.oz_ad_server;}B+="&cb=oz_onInsightLoaded";
try{if(this.oz_source.referrer){host=this.oz_source.referrer.split("/")[2];}if(host&&(host!=this.oz_source.location.host)){B+="&rd="+host;}}catch(C){}document.write("<scr"+"ipt type='text/javascript' src='"+B+"'></scr"+"ipt>");}catch(C){}};this.ad_sizes={"1000x40":"63","1000x90":"58","1024x90":"50","120x60":"6","120x600":"8","120x90":"5","125x125":"7","140x350":"36","160x600":"9","1800x1000":"68","180x150":"18","180x500":"33","200x200":"13","234x60":"3","250x250":"14","250x360":"32","2x4":"42","300x100":"19","300x1050":"54","300x250":"15","300x300":"48","300x50":"44","300x600":"10","320x150":"60","320x50":"43","320x80":"59","336x280":"16","468x60":"1","480x400":"69","480x75":"45","640x480":"65","728x90":"2","750x100":"39","750x200":"40","768x90":"51","900x250":"56","930x180":"38","930x600":"66","970x250":"57","970x90":"55","980x120":"31","980x150":"35","980x240":"78","980x300":"79","980x50":"62","Pop":"20"};
this.getAdSizeById=function(C){for(var B in this.ad_sizes){if(!this.ad_sizes.hasOwnProperty(B)){continue;}if(this.ad_sizes[B]==C){return B;}}return null;};this.getPriceBands=function(){if(typeof (this.context.oz_price_bands)=="string"){this.context.oz_price_bands=this.context.oz_price_bands.replace(/ /g,"").split(",");
}return this.context.oz_price_bands;};this.fetchValuation=function(){var B;if(this.valuationRetrieved){return ;}this.valuationRetrieved=true;if(!this.context.oz_site){return ;}try{B=this.config.hosts.valuation+"/a/api/market.js?$tg_i$$tg_v$";if(this.context.oz_ad_size_id){this.context.oz_ad_slot_size=this.getAdSizeById(this.context.oz_ad_size_id);
}else{this.context.oz_ad_size_id=this.ad_sizes[this.context.oz_ad_slot_size];}if(this.context.oz_site){var J=this.context.oz_site.split("/")[0];var H=this.context.oz_site.split("/")[1];B+="&account_id="+J;B+="&site_id="+H;}if(this.context.oz_zone){B+="&zone_id="+this.context.oz_zone;}B=this.appendObject("tg_i","tg_i",this.context.rp_inventory,B);
B=this.appendObject("tg_v","tg_v",this.context.rp_visitor,B);B+="&rtb_model=1";var C="oz_onValuationLoaded_"+this.context.oz_zone+"_"+this.context.oz_ad_size_id;window[C]=window.oz_onValuationLoaded;B+="&cb="+C;try{var I;if(this.oz_source.referrer){I=this.oz_source.referrer.split("/")[2];}if(I&&(I!=this.oz_source.location.host)){B+="&rd="+I;
}}catch(G){}if(this.context.oz_ad_slot_size){B+="&size_id="+this.context.oz_ad_size_id;if(this.context.oz_async){rp_request_context={};this.addScript(B);}else{var F=this.getImpressionCount(this.context.oz_site,this.context.oz_ad_slot_size);if(F==1&&this.context.oz_cached_only){rp_valuation={};if(this.context.oz_callback){var E={estimate:{},pmp:{}};
this.callCallback(this.context.oz_callback,E);this.context.oz_callback=null;}this.addScript(B);}else{document.write("<scr"+"ipt type='text/javascript'>rp_request_context = {};</scr"+"ipt>");document.write("<scr"+"ipt type='text/javascript' src='"+B+"'></scr"+"ipt>");}}}else{if(this.context.oz_ad_slot_sizes){for(var D=0;
D<this.context.oz_ad_slot_sizes.length;D++){this.context.oz_ad_slot_size=this.context.oz_ad_slot_sizes[D];size_url=B+"&size_id="+this.ad_sizes[this.context.oz_ad_slot_sizes[D]];if(this.context.oz_async){rp_request_context={oz_ad_slot_size:this.context.oz_ad_slot_sizes[D]};this.addScript(size_url);}else{document.write("<scr"+"ipt type='text/javascript'>rp_request_context = { oz_ad_slot_size : \""+this.context.oz_ad_slot_sizes[D]+'" };</scr'+"ipt>");
document.write("<scr"+"ipt type='text/javascript' src='"+size_url+"'></scr"+"ipt>");}}}}}catch(G){}};this.onPageLoad=function(){if(this.pageLoadHandled){return ;}this.pageLoadHandled=true;};var A=function(C,B,D){if(typeof C==="string"&&C!==null&&C.length>0){return D.replace("$"+C+"$",B);}else{return D;
}};this.appendObject=function(D,F,G,C,I){var H="";if(G){I=I||".";var E;for(var B in G){if(!G.hasOwnProperty(B)){continue;}E=G[B];if(E!=null&&(typeof E.length=="undefined"||E.length>0)){if(typeof E=="boolean"){H+="&"+F+I+B+"="+(E?1:0);}else{H+="&"+F+I+B+"="+encodeURIComponent(E);}}}}C=A(D,H,C);return C;
};this.getAsQueryTerms=function(B){var D="";if(typeof B!="undefined"&&B){for(var C in B){var E;if(!B.hasOwnProperty(C)){continue;}if(typeof B[C]=="object"){continue;}E=new String(B[C]);E=E.replace(/\s/g,"+");E=E.replace(/&/g,"%26");D+="&"+C+"="+E;}}return D;};this.getAsDFPKeyValues=function(B){var E="";
if(typeof B!="undefined"&&B){for(var C in B){var G;var F;if(!B.hasOwnProperty(C)){continue;}F=B[C];if(typeof F!="object"){F=new Array();F[F.length]=B[C];}for(var D=0;D<F.length;D++){G=new String(F[D]);if(G.length>0){G=G.replace(/\s/g,"%20");G=G.replace(/&/g,"%26");E+=";"+C+"="+G;}}}}return E;};this.getAsAdTechKeyValues=function(B){var E="";
if(typeof B!="undefined"&&B){for(var C in B){var G;var F;if(!B.hasOwnProperty(C)){continue;}F=B[C];if(typeof F!="object"){F=new Array();F[F.length]=B[C];}E+=";kv"+C+"=";for(var D=0;D<F.length;D++){G=new String(F[D]);if(G.length>0){G=G.replace(/\s/g,"%20");G=G.replace(/&/g,"%26");E+=G;if(D<F.length-1){E+=":";
}}}}}return E;};this.normalizeAttributeValue=function(B){return B;};this.normalize=function(B){var C;for(C in B){if(!B.hasOwnProperty(C)){continue;}if(typeof B[C]=="string"){B[C]=this.normalizeAttributeValue(B[C]);}else{if(typeof B[C]=="object"){this.normalize(B[C]);}}}return B;};this.genericAdServerHookInsight=function(C,F){var B=C.insight||{};
try{for(var D in B){var H;var G;if(!B.hasOwnProperty(D)){continue;}G=B[D];if(typeof G!="object"){G=new Array();G[G.length]=B[D];}for(var E=0;E<G.length;E++){H=new String(G[E]);if(H.length>0){F(D,H);}}}}catch(I){}};this.setDFPTargeting=function(C,E){if(typeof GA_googleAddAttr=="function"){GA_googleAddAttr(C,E);
}else{if(typeof googletag!="undefined"){if(this.context.rp_slot){var D=googletag.pubads().getSlots();for(var B=0;B<D.length;B++){if(D[B].getName()==this.context.rp_slot){D[B].setTargeting(C,E);}}}else{googletag.cmd.push(function(){googletag.pubads().setTargeting(C,E);});}}}};this.gamAdServerHookInsight=function(C){var B=this;
this.genericAdServerHookInsight(C,function(D,E){E=E.replace(/\+/g,"plus");E=E.replace(/[^\w\d-_\.]+/g,"");E=E.substring(0,40);B.setDFPTargeting(D,E);});};this.gam1AdServerHookInsight=function(C){var B=this;this.genericAdServerHookInsight(C,function(D,E){E=E.replace(/\+/g,"plus");E=E.replace(/[^\w\d-_\.]+/g,"");
E=E.substring(0,10);B.setDFPTargeting(D,E);});};this.gam2AdServerHookInsight=function(C){var B=this;this.genericAdServerHookInsight(C,function(D,E){E=E.replace(/\+/g,"plus");E=E.replace(/[^\w\d-_\.]+/g,"");E=E.substring(0,10);D=D.substring(0,10);B.setDFPTargeting(D,E);});};this.gptAdServerHookInsight=function(C){var B=this;
this.genericAdServerHookInsight(C,function(D,E){E=E.replace(/\+/g,"plus");E=E.replace(/[^\w\d-_\.]+/g,"");E=E.substring(0,10);D=D.substring(0,10);B.setDFPTargeting(D,E);});};this.onInsightLoaded=function(D){try{var B=D.insight;var F;this.normalize(B);if(D.context.oz_ad_server&&typeof this[D.context.oz_ad_server.toLowerCase()+"AdServerHookInsight"]=="function"){this[D.context.oz_ad_server.toLowerCase()+"AdServerHookInsight"](D);
}var H=new Array();for(F in B){if(!B.hasOwnProperty(F)){continue;}H[H.length]=F;}if(H.length>0&&((Math.random()*100)<this.context.stats_sample)){var E="";E+=this.config.hosts.stats+"/stats/insight?";E+=this.addParam("p",this.context.oz_partner);E+=this.addParam("ak",this.context.oz_api_key);if(D.context.oz_partner_channel){E+=this.addParam("pc",D.context.oz_partner_channel);
}else{if(this.context.oz_partner_channel){E+=this.addParam("pc",this.context.oz_partner_channel);}}E+=this.addParam("ptc",this.context.oz_partner_tracking);E+=this.addParam("api",this.context.oz_api);E+=this.addParam("uv",this.context.oz_view);E+=this.addParam("as",this.context.oz_ad_server);E+=this.addParam("upn",H.join(","));
setTimeout((function(J){return function(){new Image().src=J;};})(E),1000);}if(this.context.use_stats){var C=(window!=top);var E=this.config.hosts.stats+"/stats/inventory?";E+=this.addParam("p",this.context.oz_partner);E+=this.addParam("ak",this.context.oz_api_key);if(D.context.oz_partner_channel){E+=this.addParam("pc",D.context.oz_partner_channel);
}else{if(this.context.oz_partner_channel){E+=this.addParam("pc",this.context.oz_partner_channel);}}E+=this.addParam("ptc",this.context.oz_partner_tracking);E+=this.addParam("api","inventory");if(C){E+=this.addParam("aso",(C?"framed":""));}if(document.referrer){host=document.referrer.split("/")[2];}if(host&&(host!=document.location.host)){E+=this.addParam("rd",host);
}setTimeout((function(J){return function(){new Image().src=J;};})(E),1000);}}catch(G){}try{var B=D.insight;var I=this.context.oz_callback;this.callCallback(I,B);}catch(G){}};this.callCallback=function(C,B){if(C&&typeof C=="function"){C(B);}if(C&&typeof C=="string"&&window[C]&&typeof window[C]=="function"){window[C](B);
}};this.createCookie=function(D,E,F){if(F){var C=new Date();C.setTime(C.getTime()+(F*24*60*60*1000));var B="; expires="+C.toGMTString();}else{var B="";}document.cookie=D+"="+E+B+"; path=/";};this.createTodayCookie=function(D,E){var C=new Date();C=new Date(C.getTime()+(86400*1000));C=new Date(C.getFullYear(),C.getMonth(),C.getDate(),0,0,0,0);
var B="; expires="+C.toGMTString();document.cookie=D+"="+E+B+"; path=/";};this.readCookie=function(C){var E=C+"=";var B=document.cookie.split(";");for(var D=0;D<B.length;D++){var F=B[D];while(F.charAt(0)==" "){F=F.substring(1,F.length);}if(F.indexOf(E)==0){return F.substring(E.length,F.length);}}return null;
};this.getImpressionCount=function(B,C){var D=this.readCookie("_trp_hit_"+B+"_"+C);if(!D){D=this.readCookie("_trp_hit_"+C);if(D){this.createCookie("_trp_hit_"+C,D,-1);}}if(D){D=Number(D);}D=Math.max(D||1,1);return D;};this.setImpressionCount=function(D,B,C){this.createTodayCookie("_trp_hit_"+B+"_"+C,D);
};this.selectBestAd=function(D){var H={cpm:0};var K;var L;var G;var I={partner:true,rtb:true,static_bid:true,direct:true};var J={rtb:true,static_bid:true};var F={rtb:true};var B=this.getImpressionCount(this.context.oz_site,this.context.oz_ad_slot_size);if(this.context.oz_estimation_mode=="piggyback"){B-=1;
}for(var E=0;E<D.valuation.ads.length;E++){K=D.valuation.ads[E];if(!I[K.type]){continue;}if(K.type=="partner"&&!this.context.allow_partner){continue;}if(K.cpm<0){continue;}if(K.pacing&&K.pacing<this.context.min_pacing){continue;}if(K.fct!="open"){if(typeof K.fcl=="undefined"&&K.type=="partner"&&!this.context.allow_uncapped){break;
}L=(typeof K.fcl=="undefined")?(F[K.type]?1:0):K.fcl;L-=(K.fcc||0);G=(K.fcp||86400);if(L==0){continue;}var C=Math.floor(L/(G/86400));B-=C;if(B>0){continue;}}H=K;if(J[K.type]&&(E<D.valuation.ads.length-1)){H.bid=K.cpm;H.cpm=D.valuation.ads[E+1].cpm;}break;}H.hit=this.getImpressionCount(this.context.oz_site,this.context.oz_ad_slot_size);
if(this.context.oz_estimation_mode=="piggyback"){H.hit-=1;}return H;};this.generateEstimateForAllAds=function(B){for(var C=0;C<B.valuation.ads.length;C++){ad=B.valuation.ads[C];ad.estimate=this.generateEstimate(ad);}};this.generateEstimate=function(C){var H={tier:0};if(C){var B=0;var F=this.getPriceBands();
var D=this.context.oz_price_fuzz.bias||0;var G=this.context.oz_price_fuzz.scale||1;for(var E=0;E<F.length;E++){if(((D+(G*C.cpm))*100)>=F[E]){B=F[E];}}H={tier:B,cpm:C.cpm,hit:C.hit,type:C.type};if(C.ad_id){H.ad_id=C.ad_id;}}return H;};this.tranformRtbCoeffs=function(F){var E=[];F.meta=F.meta||{algorithm:"default"};
F.user_score=F.user_score||-99;for(var G in F){if(!F.hasOwnProperty(G)){continue;}var C=F[G];if(!C||!C.vec||G=="meta"||G=="user_score"){continue;}var D={algorithm:F.meta.algorithm||"missing",user_score:F.user_score,nid:G,baseline:C.vec[0],session:{10:C.vec[1]||0,30:C.vec[2]||0,100:C.vec[3]||0,1000:C.vec[4]||0},historical:{cpm:C.vec[29],probability:C.vec[30]},coeffs:C};
var B=C.vec.slice(5,29);if(B.length==24){D.hours=B;}E[E.length]=D;}return E;};this.convertToAds=function(D,H,B){var F=[];for(var E in D){if(!D.hasOwnProperty(E)){continue;}var C=D[E];var G={nid:C.nid,type:"rtb",algorithm:"rtb."+C.algorithm+".session",user_score:C.user_score,fcl:this.context.rtb_cap,cpm:C.baseline,coeffs:C.coeffs};
for(depth in C.session){if(!C.session.hasOwnProperty(depth)){continue;}if(H<depth){G.cpm+=C.session[depth];break;}}if(C.hours&&(typeof B!="undefined")&&B>=0&&B<=23){G.cpm+=C.hours[B];}if((C.historical.cpm>0)&&Math.random()<C.historical.probability){G.cpm=C.historical.cpm;G.algorithm="rtb."+C.algorithm+".historical";
}G.cpm=Math.min(Math.max(G.cpm,0),100);F[F.length]=G;}return F;};this.adjustAds=function(C){for(var B=0;B<C.length;B++){ad=C[B];ad.ecpm=ad.cpm;ad.cpm=ad.dcpm?Math.min(ad.ecpm,ad.dcpm):ad.ecpm;}};this.dropStatsPixel=function(B,C){if(this.context.oz_impression_id){setTimeout((function(D){return function(){new Image().src=D;
};})(C),1000);}else{setTimeout((function(D,E){return function(){if(typeof oz_ad_context!="undefined"&&oz_ad_context[E]&&oz_ad_context[E].iid){D+="&iid="+oz_ad_context[E].iid;}new Image().src=D;};})(C,this.context.oz_ad_size_id||this.ad_sizes[this.context.oz_ad_slot_size]),2000);}};this.onValuationLoaded=function(B){try{var M=B.valuation;
var T;rp_valuation={};B.valuation.ads=B.valuation.ads||[];if(typeof rp_request_context!="undefined"){this.copyProperties(rp_request_context,this.context);}if(B.valuation.rtb_coeffs&&this.context.oz_rtb_demand){var S=this.tranformRtbCoeffs(B.valuation.rtb_coeffs);var Q=this.getImpressionCount(this.context.oz_site,this.context.oz_ad_slot_size);
if(this.context.oz_estimation_mode=="piggyback"){Q-=1;}var H=new Date().getHours();var G=this.convertToAds(S,Q,H);B.valuation.ads=G.concat(B.valuation.ads);}this.adjustAds(B.valuation.ads);B.valuation.ads=B.valuation.ads.sort(function(V,U){return(U.cpm-V.cpm);});this.generateEstimateForAllAds(B);B.valuation.best_ad=this.selectBestAd(B);
B.valuation.estimate=this.generateEstimate(B.valuation.best_ad);B.valuation.estimate.size=this.context.oz_ad_slot_size;if(this.context.oz_estimation_mode!="piggyback"){this.setImpressionCount(1+this.getImpressionCount(this.context.oz_site,this.context.oz_ad_slot_size),this.context.oz_site,this.context.oz_ad_slot_size);
}var P="";var O={size:"size",tier:"tier"};if(this.context.emit_cpm){O.cpm="cpm";}if(this.context.oz_ad_slot_sizes){if(this.context.oz_ad_server=="gam2"){P="-"+this.context.oz_ad_slot_size;O={tier:"rt",cpm:"rc"};}if(this.context.oz_ad_server=="gpt"){P="-"+this.context.oz_ad_slot_size;O={tier:"rt",cpm:"rc"};
}rp_valuation_cb=rp_valuation_cb||{estimates:{}};B.valuation.estimate.size=this.context.oz_ad_slot_size;B.insight={};for(var T in B.valuation.estimate){if(!B.valuation.estimate.hasOwnProperty(T)){continue;}if(O[T]){B.insight[O[T]+P]=B.valuation.estimate[T];}}rp_valuation_cb.estimates[B.valuation.estimate.size]=B.insight;
rp_valuation.estimates=rp_valuation_cb.estimates;}else{rp_valuation.estimate={};for(var T in B.valuation.estimate){if(!B.valuation.estimate.hasOwnProperty(T)){continue;}if(O[T]){rp_valuation.estimate[O[T]+P]=B.valuation.estimate[T];}}rp_valuation.pmp={};if(B.valuation.pmp&&B.valuation.pmp.deals){if(B.valuation.pmp.deals&&B.valuation.pmp.deals.length>0){rp_valuation.pmp.eligible=true;
rp_valuation.pmp.deals=new Array();for(var N in B.valuation.pmp.deals){rp_valuation.pmp.deals[N]=B.valuation.pmp.deals[N].id;}}}}B.insight=rp_valuation;if(this.context.oz_ad_server&&typeof this[this.context.oz_ad_server.toLowerCase()+"AdServerHookInsight"]=="function"){this[this.context.oz_ad_server.toLowerCase()+"AdServerHookInsight"](B);
}var J=new Array();for(var T in M){if(!M.hasOwnProperty(T)){continue;}J[J.length]=T;}if(J.length>0&&((Math.random()*100)<this.context.beacon_sample)){var E="";E+=this.addParam("p",this.context.oz_partner);E+=this.addParam("ak",this.context.oz_api_key);E+=this.addParam("pc",this.context.oz_site);E+=this.addParam("ptc",this.context.oz_zone);
E+=this.addParam("api",this.context.oz_api);E+=this.addParam("as",this.context.oz_ad_server);E+=this.addParam("asz",this.context.oz_ad_slot_size);E+=this.addParam("asid",this.context.oz_ad_size_id);E+=this.addParam("tier",B.valuation.estimate.tier);E+=this.addParam("cpm",B.valuation.estimate.cpm);E+=this.addParam("ecpm",B.valuation.estimate.ecpm);
E+=this.addParam("hit",B.valuation.estimate.hit);E+=this.addParam("type",B.valuation.estimate.type);E+=this.addParam("iid",this.context.oz_impression_id);E+=this.addParam("ad",B.valuation.estimate.ad_id);if(B.context){E+=this.addParam("co",B.context.country);}E+=this.addParam("rnd",Math.floor((Math.random()*10000)));
if(B.valuation.best_ad.coeffs&&((Math.random()*100)<this.context.coeffs_sample)){E+=this.addParam("rc",B.valuation.best_ad.coeffs.vec.join(","));}E+=this.addParam("rtc",(B.valuation.rtb_coeffs?1:0));if(B.valuation.best_ad.algorithm){E+=this.addParam("rta",B.valuation.best_ad.algorithm);}if(B.valuation.best_ad.user_score){E+=this.addParam("ruc",B.valuation.best_ad.user_score);
}var K=B.valuation.pmp;if(K&&K.deals){var C=new Array();for(var N=0;N<K.deals.length;N++){var I=K.deals[N];if(I&&I.id){C[N]=I.id;if(I.network_ids){E+=this.addParam("deal."+I.id+".partners",I.network_ids.join());}}}E+=this.addParam("deals",C.join());}var D;if((Math.random()*100)<this.context.stats_sample){D=this.config.hosts.stats+"/stats/valuation?";
D+=E;this.dropStatsPixel(B,D);}if((Math.random()*100)<this.context.beacon_sample){D="http://beacon.rubiconproject.com/beacon/p/rtp/valuation?";D+=E;this.dropStatsPixel(B,D);}}}catch(R){}try{var L=B.insight;var F=this.context.oz_callback;if(F&&typeof F=="function"){F(L);}if(F&&typeof F=="string"&&window[F]&&typeof window[F]=="function"){window[F](L);
}}catch(R){}};}function oz_insight(B){try{var E=new RubiconInsight();var D=new Object();var G=["oz_host","oz_statichost","oz_api","oz_api_key","oz_partner","oz_partner_user_id","oz_partner_channel","oz_partner_tracking","oz_site","oz_zone","oz_ad_slot_size","oz_ad_slot_sizes","oz_rtb_demand","oz_price_bands","oz_price_fuzz","oz_view","oz_ad_server","oz_callback","oz_impression_id","oz_ad_size_id","oz_estimation_mode","oz_async"];
var A;E.oz_source=document;for(var C=0;C<G.length;C++){A=G[C];if(typeof window[A]!="undefined"){D[A]=window[A];}}G=["rp_ad_slot_size","rp_ad_slot_sizes","rp_price_bands","rp_ad_server","rp_callback","rp_ad_size_id",];for(var C=0;C<G.length;C++){A=G[C];if(typeof window[A]!="undefined"){D[A]=window[A];
}}G=["rp_account","rp_site","rp_zone","rp_zonesize","rp_api","rp_slot"];for(var C=0;C<G.length;C++){A=G[C];if((window[A]!=null)&&(typeof window[A]=="string"||typeof window[A]=="number")){D[A]=window[A];window[A]=undefined;}}G=["rp_inventory","rp_visitor","oz_async","rp_async","oz_cached_only","rp_cached_only"];
for(var C=0;C<G.length;C++){A=G[C];if(window[A]&&(typeof window[A]=="object"||typeof window[A]=="boolean")){D[A]=window[A];window[A]=undefined;}}D=E.mergeProperties(B,D);E.init(D);oz_insight_partner_hook(E);window.oz_onInsightLoaded=function(H){E.onInsightLoaded(H);};window.oz_onValuationLoaded=function(H){E.onValuationLoaded(H);
};E.start();if(D.autorun||E.autorun){E.onPageLoad();}}catch(F){}}function rp_insight(A){oz_insight(A);}function oz_insight_partner_hook(A){return A;}function oz_insight_adserver_hook(A){return A;}try{if(typeof rp_valuation_cb=="undefined"){var rp_valuation_cb;}}catch(e){}

/*
	
*/


oz_insight_config_site = {"valuation":{"oz_price_bands":[0,30,50,70,100,135,170,267]}}


oz_insight();
