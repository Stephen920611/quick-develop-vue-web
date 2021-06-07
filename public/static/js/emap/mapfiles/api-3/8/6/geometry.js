﻿google.maps.__gjsload__('geometry', function(_){'use strict';var Dy=function(a,b){return Math.abs(_.Ja(b-a,-180,180))};
var Ey=function(a,b,c,d,e){if(!d){c=Dy(a.lng(),c)/Dy(a.lng(),b.lng());if(!e)return e=Math.sin(_.La(a.lat())),e=Math.log((1+e)/(1-e))/2,b=Math.sin(_.La(b.lat())),_.Ma(2*Math.atan(Math.exp(e+c*(Math.log((1+b)/(1-b))/2-e)))-Math.PI/2);a=e.fromLatLngToPoint(a);b=e.fromLatLngToPoint(b);return e.fromPointToLatLng(new _.L(a.x+c*(b.x-a.x),a.y+c*(b.y-a.y))).lat()}e=_.La(a.lat());a=_.La(a.lng());d=_.La(b.lat());b=_.La(b.lng());c=_.La(c);return _.Ja(_.Ma(Math.atan2(Math.sin(e)*Math.cos(d)*Math.sin(c-b)-Math.sin(d)*
Math.cos(e)*Math.sin(c-a),Math.cos(e)*Math.cos(d)*Math.sin(a-b))),-90,90)};var Fy=function(){};
var Gy={containsLocation:function(a,b){for(var c=_.Ja(a.lng(),-180,180),d=!!b.get("geodesic"),e=b.get("latLngs"),f=b.get("map"),f=!d&&f?f.getProjection():null,g=!1,h=0,k=e.getLength();h<k;++h)for(var n=e.getAt(h),p=0,q=n.getLength();p<q;++p){var r=n.getAt(p),v=n.getAt((p+1)%q),x=_.Ja(r.lng(),-180,180),y=_.Ja(v.lng(),-180,180),A=Math.max(x,y),x=Math.min(x,y);(180<A-x?c>=A||c<x:c<A&&c>=x)&&Ey(r,v,c,d,f)<a.lat()&&(g=!g)}return g||Gy.isLocationOnEdge(a,b)},isLocationOnEdge:function(a,b,c){c=c||1E-9;var d=
_.Ja(a.lng(),-180,180),e=b instanceof _.Ud,f=!!b.get("geodesic"),g=b.get("latLngs");b=b.get("map");b=!f&&b?b.getProjection():null;for(var h=0,k=g.getLength();h<k;++h)for(var n=g.getAt(h),p=n.getLength(),q=e?p:p-1,r=0;r<q;++r){var v=n.getAt(r),x=n.getAt((r+1)%p),y=_.Ja(v.lng(),-180,180),A=_.Ja(x.lng(),-180,180),D=Math.max(y,A),C=Math.min(y,A);if(y=1E-9>=Math.abs(_.Ja(y-A,-180,180))&&(Math.abs(_.Ja(y-d,-180,180))<=c||Math.abs(_.Ja(A-d,-180,180))<=c))var y=a.lat(),A=Math.min(v.lat(),x.lat())-c,F=Math.max(v.lat(),
x.lat())+c,y=y>=A&&y<=F;if(y)return!0;if(180<D-C?d+c>=D||d-c<=C:d+c>=C&&d-c<=D)if(v=Ey(v,x,d,f,b),Math.abs(v-a.lat())<c)return!0}return!1}};var Hy={computeHeading:function(a,b){var c=_.Pb(a),d=_.Qb(a),e=_.Pb(b),d=_.Qb(b)-d;return _.Ja(_.Ma(Math.atan2(Math.sin(d)*Math.cos(e),Math.cos(c)*Math.sin(e)-Math.sin(c)*Math.cos(e)*Math.cos(d))),-180,180)},computeOffset:function(a,b,c,d){b/=d||6378137;c=_.La(c);var e=_.Pb(a);a=_.Qb(a);d=Math.cos(b);b=Math.sin(b);var f=Math.sin(e),e=Math.cos(e),g=d*f+b*e*Math.cos(c);return new _.J(_.Ma(Math.asin(g)),_.Ma(a+Math.atan2(b*e*Math.sin(c),d-f*g)))},computeOffsetOrigin:function(a,b,c,d){c=_.La(c);b/=d||
6378137;d=Math.cos(b);var e=Math.sin(b)*Math.cos(c);b=Math.sin(b)*Math.sin(c);c=Math.sin(_.Pb(a));var f=e*e*d*d+d*d*d*d-d*d*c*c;if(0>f)return null;var g=e*c+Math.sqrt(f),g=g/(d*d+e*e),h=(c-e*g)/d,g=Math.atan2(h,g);if(g<-Math.PI/2||g>Math.PI/2)g=e*c-Math.sqrt(f),g=Math.atan2(h,g/(d*d+e*e));if(g<-Math.PI/2||g>Math.PI/2)return null;a=_.Qb(a)-Math.atan2(b,d*Math.cos(g)-e*Math.sin(g));return new _.J(_.Ma(g),_.Ma(a))},interpolate:function(a,b,c){var d=_.Pb(a),e=_.Qb(a),f=_.Pb(b),g=_.Qb(b),h=Math.cos(d),
k=Math.cos(f);b=Hy.Ig(a,b);var n=Math.sin(b);if(1E-6>n)return new _.J(a.lat(),a.lng());a=Math.sin((1-c)*b)/n;c=Math.sin(c*b)/n;b=a*h*Math.cos(e)+c*k*Math.cos(g);e=a*h*Math.sin(e)+c*k*Math.sin(g);return new _.J(_.Ma(Math.atan2(a*Math.sin(d)+c*Math.sin(f),Math.sqrt(b*b+e*e))),_.Ma(Math.atan2(e,b)))},Ig:function(a,b){var c=_.Pb(a),d=_.Qb(a),e=_.Pb(b),f=_.Qb(b);return 2*Math.asin(Math.sqrt(Math.pow(Math.sin((c-e)/2),2)+Math.cos(c)*Math.cos(e)*Math.pow(Math.sin((d-f)/2),2)))},computeDistanceBetween:function(a,
b,c){c=c||6378137;return Hy.Ig(a,b)*c},computeLength:function(a,b){var c=b||6378137,d=0;a instanceof _.wc&&(a=a.getArray());for(var e=0,f=a.length-1;e<f;++e)d+=Hy.computeDistanceBetween(a[e],a[e+1],c);return d},computeArea:function(a,b){return Math.abs(Hy.computeSignedArea(a,b))},computeSignedArea:function(a,b){var c=b||6378137;a instanceof _.wc&&(a=a.getArray());for(var d=a[0],e=0,f=1,g=a.length-1;f<g;++f)e+=Hy.$m(d,a[f],a[f+1]);return e*c*c},$m:function(a,b,c){return Hy.an(a,b,c)*Hy.fo(a,b,c)},
an:function(a,b,c){var d=[a,b,c,a];a=[];for(c=b=0;3>c;++c)a[c]=Hy.Ig(d[c],d[c+1]),b+=a[c];b/=2;d=Math.tan(b/2);for(c=0;3>c;++c)d*=Math.tan((b-a[c])/2);return 4*Math.atan(Math.sqrt(Math.abs(d)))},fo:function(a,b,c){a=[a,b,c];b=[];for(c=0;3>c;++c){var d=a[c],e=_.Pb(d),d=_.Qb(d),f=b[c]=[];f[0]=Math.cos(e)*Math.cos(d);f[1]=Math.cos(e)*Math.sin(d);f[2]=Math.sin(e)}return 0<b[0][0]*b[1][1]*b[2][2]+b[1][0]*b[2][1]*b[0][2]+b[2][0]*b[0][1]*b[1][2]-b[0][0]*b[2][1]*b[1][2]-b[1][0]*b[0][1]*b[2][2]-b[2][0]*b[1][1]*
b[0][2]?1:-1}};var Iy={decodePath:function(a){for(var b=_.u(a),c=Array(Math.floor(a.length/2)),d=0,e=0,f=0,g=0;d<b;++g){var h=1,k=0,n;do n=a.charCodeAt(d++)-63-1,h+=n<<k,k+=5;while(31<=n);e+=h&1?~(h>>1):h>>1;h=1;k=0;do n=a.charCodeAt(d++)-63-1,h+=n<<k,k+=5;while(31<=n);f+=h&1?~(h>>1):h>>1;c[g]=new _.J(1E-5*e,1E-5*f,!0)}c.length=g;return c},encodePath:function(a){a instanceof _.wc&&(a=a.getArray());return Iy.Jp(a,function(a){return[Math.round(1E5*a.lat()),Math.round(1E5*a.lng())]})},Jp:function(a,b){for(var c=[],
d=[0,0],e,f=0,g=_.u(a);f<g;++f)e=b?b(a[f]):a[f],Iy.Lj(e[0]-d[0],c),Iy.Lj(e[1]-d[1],c),d=e;return c.join("")},Lj:function(a,b){return Iy.Kp(0>a?~(a<<1):a<<1,b)},Kp:function(a,b){for(;32<=a;)b.push(String.fromCharCode((32|a&31)+63)),a>>=5;b.push(String.fromCharCode(a+63));return b}};_.cd.google.maps.geometry={encoding:Iy,spherical:Hy,poly:Gy};_.m=Fy.prototype;_.m.decodePath=Iy.decodePath;_.m.encodePath=Iy.encodePath;_.m.computeDistanceBetween=Hy.computeDistanceBetween;_.m.interpolate=Hy.interpolate;_.m.computeHeading=Hy.computeHeading;_.m.computeOffset=Hy.computeOffset;_.m.computeOffsetOrigin=Hy.computeOffsetOrigin;_.nc("geometry",new Fy);});
