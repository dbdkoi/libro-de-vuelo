/* LOGBOOK · emblema y pantalla de arranque. El emblema se dibuja por código (sin imágenes). */
(function(){
  var TAU=Math.PI*2, AMB='#f0b04a';
  var FONT='"Roboto Condensed","Arial Narrow","Helvetica Neue",Roboto,Arial,sans-serif';
  var PALS={
    tactico:{bg:'#1c2014',disc:'#2a2f1c',disc2:'#1f2315',ring:'#b5a982',text:'#cfc39a',sub:'#a39876',wingFill:'#353b23',wingLead:'#454d2d',wingLine:'#b5a982',blade:'#b5a982',bladeLine:'#1c2014',hub:'#b5a982',tick:'#7f7a5c',tickMaj:'#b5a982',accent:'#b5a982'},
    metal:{bg:'#101314',disc:'#1a1e20',disc2:'#111416',ring:'#9ea7aa',text:'#dfe4e5',sub:'#9ea7aa',wingFill:'#3e4549',wingLead:'#596266',wingLine:'#c9d0d2',blade:'#c9d0d2',bladeLine:'#0e1112',hub:'#9ea7aa',tick:'#5d6669',tickMaj:'#c9d0d2',accent:'#a9c47f'},
    hud:{bg:'#0b1009',disc:'#0f150c',disc2:'#0b1009',ring:'#a9c47f',text:'#d4e6b5',sub:'#8fae67',wingFill:'rgba(169,196,127,0.08)',wingLead:'rgba(169,196,127,0.16)',wingLine:'#a9c47f',blade:'rgba(169,196,127,0.14)',bladeLine:'#a9c47f',hub:'#0f150c',tick:'#4e6638',tickMaj:'#a9c47f',accent:'#f0b04a'}
  };
  var P=PALS.hud, LW=1;
  function cl(x){return Math.min(1,Math.max(0,x));}
  function eo(x){x=cl(x);return 1-Math.pow(1-x,3);}
  function eio(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
  function sm(u){u=cl(u);return u*u*u*(u*(u*6-15)+10);}

  // Texto en arco, letra estrechada (independiente de la fuente del móvil). n = letras visibles.
  function arcText(ctx,str,R,size,top,n,color,track,cond){
    ctx.save();ctx.font='700 '+size+'px '+FONT;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;
    var ws=[],tot=0,i;for(i=0;i<str.length;i++){var w=ctx.measureText(str[i]).width*cond+track;ws.push(w);tot+=w;}
    tot-=track;var a=-(top?1:-1)*tot/R/2,dir=top?1:-1;
    for(i=0;i<str.length;i++){var h=(ws[i]-track)/R/2;a+=dir*h;
      if(i<n){ctx.save();ctx.rotate(a);ctx.translate(0,top?-R:R);ctx.scale(cond,1);ctx.fillText(str[i],0,0);ctx.restore();}
      a+=dir*(h+track/R);}
    ctx.restore();
  }
  function feather(ctx,bx,by,ang,len,w,fill){
    var ca=Math.cos(ang),sa=Math.sin(ang),nx=-sa,ny=ca,tx=bx+ca*len,ty=by+sa*len;
    ctx.beginPath();ctx.moveTo(bx+nx*w*0.5,by+ny*w*0.5);
    ctx.quadraticCurveTo(bx+ca*len*0.6+nx*w*0.6,by+sa*len*0.6+ny*w*0.6,tx+nx*w*0.12,ty+ny*w*0.12);
    ctx.lineTo(tx-nx*w*0.22,ty-ny*w*0.22);
    ctx.quadraticCurveTo(bx+ca*len*0.6-nx*w*0.45,by+sa*len*0.6-ny*w*0.45,bx-nx*w*0.5,by-ny*w*0.5);
    ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=LW*(1.2);ctx.strokeStyle=P.wingLine;ctx.stroke();
  }
  function lead(u){return -12-30*Math.pow(u,1.3)+5*Math.sin(Math.PI*u);}
  function wing(ctx,k){
    if(k<=0)return;
    ctx.save();ctx.beginPath();ctx.rect(18,-140,190*k+8,280);ctx.clip();ctx.rotate((1-k)*0.4);
    var N=11,i,u;
    for(i=N-1;i>=0;i--){u=i/(N-1);feather(ctx,32+u*144,lead(u)+3,(1-u)*1.38+u*0.22,40+u*52,15+u*2,P.wingFill);}
    for(i=N-2;i>=0;i--){u=(i+0.5)/(N-1);feather(ctx,28+u*138,lead(u)+1,(1-u)*1.28+u*0.3,20+u*20,13,P.wingLead);}
    ctx.beginPath();ctx.moveTo(24,-18);
    for(i=0;i<=20;i++){u=i/20;ctx.lineTo(26+u*156,lead(u)-5);}
    ctx.lineTo(182,lead(1)+3);
    for(i=20;i>=0;i--){u=i/20;ctx.lineTo(26+u*150,lead(u)+6-3*u);}
    ctx.closePath();ctx.fillStyle=P.wingLead;ctx.fill();ctx.lineWidth=LW*(1.4);ctx.strokeStyle=P.wingLine;ctx.stroke();
    ctx.restore();
  }
  function blade(ctx,alpha){
    ctx.save();ctx.globalAlpha*=alpha;
    ctx.beginPath();ctx.moveTo(14,-3);ctx.lineTo(28,-6);ctx.lineTo(132,-6);ctx.lineTo(138,-2);ctx.lineTo(138,2);ctx.lineTo(132,6);ctx.lineTo(28,6);ctx.lineTo(14,3);ctx.closePath();
    ctx.fillStyle=P.blade;ctx.fill();ctx.lineWidth=LW*(1.4);ctx.strokeStyle=P.bladeLine;ctx.stroke();
    ctx.beginPath();ctx.moveTo(118,-6);ctx.lineTo(118,6);ctx.strokeStyle=P.bladeLine;ctx.lineWidth=LW*(1);ctx.stroke();
    ctx.restore();
  }
  function rotorState(t){
    var t0=1.0,up=1.3,hold=0.8,down=1.5,W=30,s=t-t0,ang,w;
    function I(u){return u*u*u*u*(u*(u-3)+2.5);}
    if(s<=0){ang=0;w=0;}
    else if(s<up){w=W*sm(s/up);ang=W*up*I(s/up);}
    else if(s<up+hold){w=W;ang=W*up*0.5+W*(s-up);}
    else if(s<up+hold+down){var u=(s-up-hold)/down;w=W*(1-sm(u));ang=W*up*0.5+W*hold+W*down*(u-I(u));}
    else{w=0;ang=W*up*0.5+W*hold+W*down*0.5;}
    return {a:ang-(W*up*0.5+W*hold+W*down*0.5)+Math.PI/4,w:w/W};
  }
  function diamond(ctx,x,y,r){ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r*0.6,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r*0.6,y);ctx.closePath();ctx.fill();}

  /* Emblema centrado en (0,0), radio 290. t=null → terminado (icono). p = progreso del arco indicador. */
  function emblem(ctx,t,p){
    var done=t==null; if(done){t=99;p=1;}
    ctx.save();ctx.globalAlpha*=eo(t/0.5);
    ctx.beginPath();ctx.arc(0,0,290,0,TAU);ctx.fillStyle=P.disc;ctx.fill();
    ctx.beginPath();ctx.arc(0,0,214,0,TAU);ctx.fillStyle=P.disc2;ctx.fill();
    ctx.restore();
    var k=eio((t-0.15)/0.9);
    if(k>0){ctx.save();ctx.strokeStyle=P.ring;
      ctx.lineWidth=LW*(4);ctx.beginPath();ctx.arc(0,0,284,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();
      ctx.lineWidth=LW*(1.2);ctx.beginPath();ctx.arc(0,0,274,-Math.PI/2,-Math.PI/2-TAU*k,true);ctx.stroke();
      ctx.lineWidth=LW*(2);ctx.beginPath();ctx.arc(0,0,214,Math.PI/2,Math.PI/2+TAU*k);ctx.stroke();ctx.restore();}
    var kt=cl((t-0.5)/0.9);
    ctx.save();
    for(var i=0;i<72;i++){if(i/72>kt)break;var big=i%6===0,aa=-Math.PI/2+i/72*TAU,r0=big?190:200,r1=207;
      ctx.strokeStyle=big?P.tickMaj:P.tick;ctx.lineWidth=LW*(big?2.2:1);
      ctx.beginPath();ctx.moveTo(Math.cos(aa)*r0,Math.sin(aa)*r0);ctx.lineTo(Math.cos(aa)*r1,Math.sin(aa)*r1);ctx.stroke();}
    if(kt>=1){ctx.fillStyle=P.tickMaj;ctx.beginPath();ctx.moveTo(0,-186);ctx.lineTo(-6,-176);ctx.lineTo(6,-176);ctx.closePath();ctx.fill();}
    ctx.restore();
    if(p>0){ctx.save();ctx.strokeStyle=P.accent;ctx.lineWidth=LW*(2.5);ctx.globalAlpha*=done?0.55:1;
      ctx.beginPath();ctx.arc(0,0,170,-Math.PI/2,-Math.PI/2+TAU*Math.min(p,0.9999));ctx.stroke();
      if(p<1){var ha=-Math.PI/2+TAU*p;ctx.fillStyle=P.accent;ctx.beginPath();ctx.arc(Math.cos(ha)*170,Math.sin(ha)*170,4,0,TAU);ctx.fill();}
      ctx.restore();}
    var kw=eio((t-0.8)/0.9);
    ctx.save();ctx.translate(0,4);wing(ctx,kw);ctx.scale(-1,1);wing(ctx,kw);ctx.restore();
    var ka=eo((t-0.95)/0.4);
    if(ka>0){var rs=done?{a:Math.PI/4,w:0}:rotorState(t);
      ctx.save();ctx.globalAlpha*=ka;
      if(rs.w>0.05){ctx.save();ctx.globalAlpha*=0.35*rs.w;ctx.strokeStyle=P.bladeLine;ctx.lineWidth=LW*(1);ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(0,0,138,0,TAU);ctx.stroke();ctx.restore();}
      var ghosts=rs.w>0.05?6:1;
      for(var gI=ghosts-1;gI>=0;gI--){var al=gI?0.14*(1-gI/ghosts):1-0.6*rs.w;
        for(var b=0;b<4;b++){ctx.save();ctx.rotate(rs.a-gI*rs.w*0.13+b*Math.PI/2);blade(ctx,al);ctx.restore();}}
      ctx.beginPath();ctx.arc(0,0,17,0,TAU);ctx.fillStyle=P.hub;ctx.fill();ctx.lineWidth=LW*(1.6);ctx.strokeStyle=P.bladeLine;ctx.stroke();
      ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fillStyle=P.disc2;ctx.fill();ctx.strokeStyle=P.ring;ctx.lineWidth=LW*(1.2);ctx.stroke();
      ctx.restore();}
    var n1=done?99:Math.floor((t-1.2)*12),n2=done?99:Math.floor((t-1.7)*18);
    arcText(ctx,'LOGBOOK',244,44,true,n1,P.text,12,0.82);
    arcText(ctx,'SERVICIO AÉREO · GRUHEL',247,23,false,n2,P.sub,5,0.85);
    var ks=eo((t-2.3)/0.4);
    if(ks>0){ctx.save();ctx.globalAlpha*=ks;ctx.fillStyle=P.ring;diamond(ctx,-245,0,8);diamond(ctx,245,0,8);ctx.restore();}
  }
  window.LogbookEmblem={draw:emblem,pals:PALS,setPal:function(n){P=PALS[n]||P;},
    icon:function(size,pad,pal){var old=P,oLW=LW;if(pal)P=PALS[pal];LW=size<=200?2.6:size<=520?1.7:1.2;var c=document.createElement('canvas');c.width=c.height=size;var x=c.getContext('2d');
      x.fillStyle=P.bg;x.fillRect(0,0,size,size);var s=size*(1-2*(pad==null?0.1:pad))/600;x.translate(size/2,size/2);x.scale(s,s);emblem(x,null,1);P=old;LW=oLW;return c;}};

  /* ---------- pantalla de arranque ---------- */
  var ov=document.getElementById('boot'); if(!ov||!document.documentElement.classList.contains('booting'))return;
  var cv=ov.querySelector('canvas'),ctx=cv.getContext('2d'),W=600,H=1300,sc=1,done=false,T0=0,wall0=Date.now();
  var MONO='ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace',G1='#a9c47f',G2='#4cc38a',TXT='#d3dcc4',MUT='#8a937e';
  var END=5.2,LOCK=3.1,syncT=null,syncOk=true;
  function hash(a,b){var h=(a*374761393+b*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;}
  function size(){var w=window.innerWidth,h=window.innerHeight,dpr=Math.min(window.devicePixelRatio||1,2);
    sc=Math.min(w/600,h/1000);W=w/sc;H=h/sc;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);ctx.setTransform(sc*dpr,0,0,sc*dpr,0,0);}
  function finish(){if(done)return;done=true;ov.classList.add('out');document.documentElement.classList.remove('booting');
    setTimeout(function(){ov.remove();},650);window.removeEventListener('resize',size);}
  function synced(){try{if(typeof S==='undefined'||typeof syncConfigured!=='function'||!syncConfigured())return {off:false};
      if((S.sync.lastOk||0)>=wall0)return {off:false}; if(!navigator.onLine)return {off:true};}catch(e){return {off:false};} return null;}
  function hours(){try{var m=0;S.flights.forEach(function(f){if(typeof isSim==='function'&&isSim(f))return;m+=Number(f.min)||0;});return m/60;}catch(e){return 0;}}
  function frame(t){
    var X0=W/2-252,X1=W/2+252,EY=Math.min(500,H*0.385),ex=W/2,ey=EY,x,y;
    if(syncT===null&&t>1.4){var s=synced();if(s){syncT=Math.max(t,2.0);syncOk=!s.off;}else if(t>3.3){syncT=t;syncOk=false;}}
    ctx.clearRect(0,0,W,H);
    var g=ctx.createRadialGradient(ex,EY,40,ex,EY,900);g.addColorStop(0,'#1b2415');g.addColorStop(.55,'#10150c');g.addColorStop(1,'#080a06');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.font='11px '+MONO;ctx.textAlign='center';ctx.textBaseline='middle';
    var ra=eo((t-0.3)/1.2);
    for(var c=0;c<W/22;c++){ if(hash(c,7)>0.55)continue;
      x=11+c*22;var sp=22+hash(c,3)*40,len=7+Math.floor(hash(c,5)*10),off=hash(c,9)*H,head=((off+sp*t)%(H+len*18))-len*9;
      for(var r=0;r<len;r++){ y=head-r*18; if(y<-10||y>H+10)continue;
        var d=Math.hypot(x-ex,y-EY),a=(r===0?0.38:0.17*(1-r/len))*cl((d-270)/160)*ra; if(a<0.01)continue;
        ctx.fillStyle='rgba('+(r===0?'196,226,150':'120,160,90')+','+a+')';ctx.fillText('0123456789ABCDEF'[Math.floor(hash(c*131+r,Math.floor(t*3+c))*16)],x,y);}}
    var ga=eo(t/0.8);ctx.lineWidth=1;
    for(x=0;x<=W;x+=36){ctx.strokeStyle='rgba(169,196,127,'+(ga*((x/36)%4===0?0.06:0.025))+')';ctx.beginPath();ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,H);ctx.stroke();}
    for(y=0;y<=H;y+=36){ctx.strokeStyle='rgba(169,196,127,'+(ga*((y/36)%4===0?0.06:0.025))+')';ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(W,y+.5);ctx.stroke();}
    if(t>0.2&&t<2.6){var pp=(t-0.2)/2.4,yy=-80+pp*(H+160),sg=ctx.createLinearGradient(0,yy-100,0,yy);sg.addColorStop(0,'rgba(169,196,127,0)');sg.addColorStop(1,'rgba(169,196,127,0.10)');
      ctx.fillStyle=sg;ctx.fillRect(0,yy-100,W,100);ctx.fillStyle='rgba(196,226,150,0.30)';ctx.fillRect(0,yy,W,1.2);}
    // lavado del rotor: anillos que salen del emblema mientras gira
    var rs=rotorState(t);
    if(rs.w>0.05){ctx.save();ctx.strokeStyle=G1;for(var q=0;q<3;q++){var u=((t*0.55+q/3)%1),rw=290+u*300;ctx.globalAlpha=(1-u)*0.22*rs.w;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(ex,ey,rw,0,TAU);ctx.stroke();}ctx.restore();}
    var tl=t-LOCK,pulse=(tl>0&&tl<0.55)?Math.sin(Math.PI*tl/0.55):0;
    if(tl>0&&tl<0.9){var q2=tl/0.9,rw2=285+eo(q2)*260;ctx.save();ctx.globalAlpha=(1-q2)*0.6;ctx.strokeStyle=G1;ctx.lineWidth=2.4*(1-q2)+0.4;ctx.beginPath();ctx.arc(ex,ey,rw2,0,TAU);ctx.stroke();ctx.restore();}
    // mira
    var qa=sm((t-0.1)/3.0),half=262,m=26,L=(60-22*qa)*eo(t/0.5),rr=14;
    ctx.lineCap='round';ctx.lineJoin='round';
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(s){
      var sx=s[0]<0?m:W-m,sy=s[1]<0?m:H-m,px=sx+(ex+s[0]*half-sx)*qa,py=sy+(ey+s[1]*half-sy)*qa,dx=-s[0],dy=-s[1];
      function arm(ax,ay,len,r){ctx.beginPath();ctx.moveTo(ax+dx*len,ay);ctx.arcTo(ax,ay,ax,ay+dy*len,r);ctx.lineTo(ax,ay+dy*len);}
      var gr=ctx.createLinearGradient(px,py,px+dx*L,py+dy*L);gr.addColorStop(0,'#e9f2d6');gr.addColorStop(0.5,'#a9c47f');gr.addColorStop(1,'#4f7a52');
      ctx.save();ctx.shadowColor='rgba(169,196,127,'+(0.45+0.4*pulse)+')';ctx.shadowBlur=9+8*pulse;arm(px,py,L,rr);ctx.lineWidth=3.6+1.4*pulse;ctx.strokeStyle=gr;ctx.stroke();ctx.restore();
      ctx.save();ctx.globalAlpha=0.75;arm(px+dx*9,py+dy*9,L*0.62,rr-4);ctx.lineWidth=1.3;ctx.strokeStyle='#a9c47f';ctx.stroke();ctx.restore();
      ctx.fillStyle='#4cc38b';ctx.fillRect(px+dx*L-2.5,py-2.5,5,5);ctx.fillRect(px-2.5,py+dy*L-2.5,5,5);
    });
    var tk=eo(tl/0.4);
    if(tk>0){ctx.save();ctx.globalAlpha=tk;ctx.strokeStyle='#a9c47f';ctx.lineWidth=2;
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){var ax=ex+d[0]*half,ay=ey+d[1]*half;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax-d[0]*14,ay-d[1]*14);ctx.stroke();});
      ctx.font='11px '+MONO;ctx.fillStyle=G2;ctx.textAlign='right';ctx.textBaseline='bottom';ctx.fillText('LOCK',ex+half-4,ey-half-8);ctx.restore();}
    ctx.save();ctx.globalAlpha=eo((t-0.5)/0.6)*0.6;ctx.fillStyle=MUT;ctx.font='12px '+MONO;ctx.textBaseline='top';
    ctx.textAlign='left';ctx.fillText('SAER · GRUHEL',X0,48);ctx.textAlign='right';ctx.fillText('pilot logbook',X1,48);ctx.restore();
    // emblema
    var p=eio((t-0.2)/3.6); if(syncT===null)p=Math.min(p,0.82);
    ctx.save();ctx.translate(ex,EY);ctx.scale(0.86,0.86);emblem(ctx,t,p);
    // destello que cruza el emblema al fijarse la mira
    if(tl>0&&tl<0.7){ctx.beginPath();ctx.arc(0,0,290,0,TAU);ctx.clip();var gx=-420+tl/0.7*840,sh=ctx.createLinearGradient(gx-90,0,gx+90,0);
      sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(0.5,'rgba(255,250,225,0.34)');sh.addColorStop(1,'rgba(255,255,255,0)');
      ctx.transform(1,0,-0.45,1,0,0);ctx.fillStyle=sh;ctx.fillRect(gx-90,-320,180,640);}
    ctx.restore();
    // contador de horas reales
    var hv=hours(),kc=eo((t-2.3)/1.2),ka=eo((t-2.2)/0.4);
    if(ka>0){ctx.save();ctx.globalAlpha=ka;ctx.textAlign='center';ctx.textBaseline='alphabetic';var cy=EY+half+74;
      ctx.font='12px '+MONO;ctx.fillStyle=MUT;ctx.fillText('TOTAL FLIGHT TIME',ex,cy-40);
      ctx.font='700 40px '+MONO;ctx.fillStyle=kc>=1?'#f3e3a6':TXT;ctx.shadowColor='rgba(240,176,74,'+(0.5*pulse)+')';ctx.shadowBlur=14*pulse;
      var v=hv*kc,hh=Math.floor(v),mm=Math.floor((v-hh)*60+1e-6);ctx.fillText(hh.toLocaleString('en-US')+':'+(mm<10?'0':'')+mm+' h',ex,cy);ctx.restore();}
    // terminal
    ctx.save();ctx.font='15px '+MONO;ctx.textBaseline='alphabetic';ctx.textAlign='left';
    var y0=Math.min(1010,H*0.777),cps=34,by=Math.min(1150,H*0.885),rdy=syncT===null?1e9:Math.max(2.5,syncT+0.15);
    [[0.35,'Initializing system',1.15],[1.4,'Syncing flight log',syncT===null?1e9:syncT],[rdy,'Ready',1e9]].forEach(function(l,i){
      var s=t-l[0];if(s<0)return;var n=Math.min(l[1].length,Math.floor(s*cps)),txt=l[1].slice(0,n),yy=y0+i*26,last=i===2;
      ctx.fillStyle=G1;ctx.fillText('>',X0,yy);ctx.fillStyle=last?G1:TXT;ctx.fillText(txt,X0+22,yy);
      if(!last&&t>l[2]){var off=i===1&&!syncOk;ctx.fillStyle=off?AMB:G2;ctx.textAlign='right';ctx.fillText(off?'OFFLINE':'OK',X1,yy);ctx.textAlign='left';}
      else if(!last&&n>=l[1].length){ctx.fillStyle=MUT;ctx.fillText('.'.repeat(1+Math.floor(t*4)%3),X0+22+ctx.measureText(txt).width+4,yy);}
      if(n<l[1].length&&(Math.floor(t*6)%2===0)){ctx.fillStyle=G1;ctx.fillRect(X0+22+ctx.measureText(txt).width+2,yy-12,8,15);}
    });
    ctx.fillStyle='rgba(169,196,127,0.12)';ctx.fillRect(X0,by,504,4);
    var pg=ctx.createLinearGradient(X0,0,X1,0);pg.addColorStop(0,'#3d8a63');pg.addColorStop(1,G1);ctx.fillStyle=pg;ctx.fillRect(X0,by,504*p,4);
    ctx.fillStyle=MUT;ctx.font='12px '+MONO;ctx.textAlign='right';ctx.fillText(Math.round(p*100)+'%',X1,by+32);
    ctx.textAlign='left';ctx.fillText(p>=1?'System ready':'Initializing',X0,by+32);ctx.restore();
  }
  function loop(now){if(done)return;var t=(now-T0)/1000;try{frame(t);}catch(e){finish();return;}if(t>=END){finish();return;}requestAnimationFrame(loop);}
  ov.addEventListener('click',finish);
  window.LogbookBoot={frame:function(t){size();frame(t);},finish:finish};
  size();window.addEventListener('resize',size);
  if(!window.__bootManual){T0=performance.now();requestAnimationFrame(loop);setTimeout(finish,(END+1.5)*1000);}
})();
