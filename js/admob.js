// // fix wp8 view port issue, see:
// // https://github.com/floatinghotpot/cordova-admob-pro/issues/109
// // https://coderwall.com/p/zk_2la/responsive-design-in-ie-10-on-windows-phone-8
// // http://stackoverflow.com/questions/24007577/windows-phone-8-viewport-issue
// (function() {
// if ("-ms-user-select" in document.documentElement.style && navigator.userAgent.match(/IEMobile\/10\.0/)) {
//   var msViewportStyle = document.createElement("style");
//   msViewportStyle.appendChild(
//     document.createTextNode("@-ms-viewport{width:auto!important}")
//   );
//   document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
// }
// })();

//banner: 'ca-app-pub-3940256099942544/6300978111',
//interstitial: 'ca-app-pub-3940256099942544/1033173712',

// place our admob ad unit id here
var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) {
  admobid = { // for Android
    banner: 'ca-app-pub-2470457105053641/5668858722',
    interstitial: 'ca-app-pub-2470457105053641/7890241114',
    rewardvideo: 'ca-app-pub-3940256099942544/5224354917',
  };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
  admobid = { // for iOS
    banner: 'ca-app-pub-3940256099942544/4480807092',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
  };
} else {
  admobid = { // for Windows Phone
    banner: 'ca-app-pub-6869992474017983/8878394753',
    interstitial: 'ca-app-pub-6869992474017983/1355127956',
    rewardvideo: '',
  };
}
// i am only interested in android right now

function show_inter(){
  try{
    if(Math.floor(Math.random()*3) === 0)
    AdMob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: true
    });
  }catch(e) {console.log('no adds');}
}

function showBanner(){
      try{
        al(AdMob);
        AdMob.createBanner( {
          adId: admobid.banner,
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          overlap: false,
          offsetTopBar: false,
          bgColor: 'white'
        } );
      }catch(e){}

}

function hideBanner(){
  try{
    AdMob.hideBanner();
  }catch(e){}

}

function al(obj){
  alert(JSON.stringify(obj));
}
