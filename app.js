"use strict";
/* PPL Defteri — bağımsız site. Kayıtlar cihazda önbelleğe alınır; Supabase ayarlıysa hesapla her cihaza eşitlenir. */
const CFG = window.PPL_CONFIG || {};
const SYNC = !!(CFG.supabaseUrl && CFG.supabaseKey);
const APP_VERSION = "1.0.0";
let START = 95, GOAL = 85, PROT = [170, 190], KCAL = [2200, 2400];
const BARKG = 20, PLATES = [25, 20, 15, 10, 5, 2.5, 1.25], WATER_GOAL = 12, STEP_GOAL = 8000, SLEEP_GOAL = 7;
const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
const A = (id, n, q, tip) => ({ id, n, q, tip });

const DAYS = [
 {key:"pushA",name:"Push A",sub:"Güç · Göğüs, omuz, arka kol",c:"--plate-red",ex:[
  {id:"bench",n:"Bench Press",s:4,lo:6,hi:8,rest:150,bar:true,m:"Göğüs, ön omuz, arka kol",q:"bench press",cues:["Sehpaya uzan, gözlerin barın altında olsun. Kürek kemiklerini geriye ve aşağı sıkıştır.","Barı omuz genişliğinden biraz geniş tut, ayakların yere sağlam bassın.","Barı kontrollü şekilde göğüs ucuna indir; dirsekler gövdeyle yaklaşık 45° açı yapsın.","Göğse hafifçe değince ayaklarla yere basarak barı yukarı it. Kalçan sehpadan kalkmasın."],
   alts:[A("dbbench_a","Dumbbell Bench Press","dumbbell bench press","Dambıllarla aynı hareket. Her kol ayrı çalıştığı için dengeyi de geliştirir."),A("chestpress","Machine Chest Press","machine chest press","Tutacaklar göğüs ortası hizasında olacak şekilde koltuğu ayarla, kürek kemiklerini sık ve it.")]},
  {id:"dbsp",n:"Dumbbell Shoulder Press (oturarak)",s:3,lo:8,hi:10,rest:120,m:"Ön ve yan omuz, arka kol",q:"seated dumbbell shoulder press",cues:["Sırtı dik sehpaya otur, dambılları kulak hizasında tut.","Önkolların yere dik dursun, avuç içleri öne baksın.","Dambılları başının üstüne doğru it, yukarıda dirseği kilitleme.","Yavaşça kulak hizasına indir. Belini kavislendirme, karnını sıkı tut."],
   alts:[A("machsp_a","Machine Shoulder Press","machine shoulder press","Tutacaklar omuz hizasında olsun, sırtını yasla ve yukarı it."),A("arnold","Arnold Press","arnold press","Avuçlar sana bakarak başla, iterken bileklerini dışa döndür.")]},
  {id:"idbp",n:"Incline Dumbbell Press",s:3,lo:8,hi:10,rest:120,m:"Üst göğüs, ön omuz",q:"incline dumbbell press",cues:["Sehpayı 30° eğime ayarla; daha dik açı yükü omza kaydırır.","Dambılları göğsün üst kısmı hizasında başlat.","Hafif içe doğru yay çizerek yukarı it, dambıllar yukarıda birbirine yaklaşsın.","2–3 saniyede kontrollü indir, göğsünde esneme hisset."],
   alts:[A("inclsmith_a","Incline Smith Press","incline smith machine press","Sehpa 30°, bar köprücük kemiğinin biraz altına insin."),A("inclmach","Incline Machine Press","incline chest press machine","Koltuğu tutacaklar üst göğüs hizasına gelecek şekilde ayarla.")]},
  {id:"fly",n:"Cable Fly / Pec Deck",s:3,lo:12,hi:15,rest:75,m:"Göğüs",q:"cable chest fly",cues:["Kablolar omuz hizasında ya da biraz yukarıda olsun, bir adım öne çık.","Dirseklerin hafif bükük kalsın ve hareket boyunca açı değişmesin.","Kolları önde, göğüs hizasında birleştir; 1 saniye sık.","Göğsün gerilene kadar yavaşça aç, omuzları öne düşürme."],
   alts:[A("dbfly","Dumbbell Fly","dumbbell fly","Dirsekler hafif bükük, kolları yay çizerek aç ve göğüs üstünde birleştir.")]},
  {id:"lat",n:"Lateral Raise",s:4,lo:12,hi:15,rest:60,m:"Yan omuz",q:"dumbbell lateral raise",cues:["Dik dur, dizler hafif bükük, dambıllar yanlarda.","Dirsekleri hafif bükerek kolları yana kaldır; dirsekler önde gitsin.","Omuz hizasında dur, omuzlarını kulağa doğru kaldırma.","Yavaş indir. Sallanma yapıyorsan ağırlık fazladır."],
   alts:[A("cablelat_a","Cable Lateral Raise","cable lateral raise","Kablo en altta, makineye yan dur ve kolu yana omuz hizasına kaldır."),A("machlat","Machine Lateral Raise","machine lateral raise","Dirsekleri pedlere yasla, yana omuz hizasına kaldır.")]},
  {id:"pushdown",n:"Triceps Pushdown (ip)",s:3,lo:10,hi:12,rest:60,m:"Arka kol",q:"rope triceps pushdown",cues:["Kabloyu en üste tak, ipi iki elinle tut.","Dirsekler gövdene yapışık kalsın, sadece önkol hareket etsin.","Aşağıda ipi iki yana açarak kolu tamamen düzelt.","Önkollar yere paralel olana kadar kontrollü geri bırak."],
   alts:[A("barpushdown","Düz Bar Pushdown","straight bar triceps pushdown","Dirsekler gövdeye yapışık, barı uyluklarına doğru it.")]},
  {id:"ohte",n:"Overhead Triceps Extension",s:3,lo:10,hi:12,rest:60,m:"Arka kol (uzun baş)",q:"overhead triceps extension",cues:["Dambılı ya da kablo ipini iki elle başının üstünde tut.","Dirsekler tavana baksın ve kulaklara yakın dursun.","Ağırlığı başının arkasına doğru yavaşça indir.","Dirsekleri oynatmadan kolu yukarı düzelt."],
   alts:[A("cableohte","Cable Overhead Extension","cable overhead triceps extension","Makineye sırtını dön, ipi başının arkasından öne doğru düzelt.")]}
 ]},
 {key:"pullA",name:"Pull A",sub:"Güç · Sırt, ön kol, arka omuz",c:"--plate-blue",ex:[
  {id:"pullup",n:"Barfiks (veya Lat Pulldown)",s:4,lo:6,hi:8,rest:150,m:"Kanat (lat), ön kol",q:"pull up proper form",cues:["Barı omuz genişliğinden biraz geniş tut, kollar tam açık başla.","Önce kürek kemiklerini aşağı çek, sonra dirsekleri belin yanına doğru sür.","Çene barın üstüne çıkana kadar çek; bacakları sallama.","Kontrollü olarak kollar tam açılana kadar in. Yapamıyorsan lastik ya da makine destekli yap."],
   alts:[A("latpd_a","Lat Pulldown","lat pulldown","Barı göğsünün üst kısmına çek, dirsekler aşağı ve geriye gitsin."),A("asstpullup","Destekli Barfiks Makinesi","assisted pull up machine","Seçtiğin kilo seni destekler; zamanla desteği azalt.")]},
  {id:"bbrow",n:"Barbell Row",s:4,lo:6,hi:8,rest:150,bar:true,m:"Orta sırt, kanat, arka omuz",q:"barbell row",cues:["Barı tut, dizleri hafif bük ve gövdeni 45°'ye kadar öne eğ. Sırt düz kalsın.","Barı göbek hizasına doğru çek, dirsekler geriye gitsin.","Yukarıda kürek kemiklerini sık.","Kontrollü indir; gövdeyle hız alma."],
   alts:[A("tbar_a","T-Bar Row","t bar row","Göğüs pedine yaslan ya da sırt düz eğil, tutacağı göğsüne çek."),A("smithrow","Smith Machine Row","smith machine row","Barbell row ile aynı hareket; bar sabit rayda olduğu için dengesi kolay.")]},
  {id:"cablerow",n:"Seated Cable Row",s:3,lo:10,hi:12,rest:90,m:"Orta sırt, kanat",q:"seated cable row",cues:["Otur, ayaklar platformda, dizler hafif bükük.","Göğsünü dik tut, tutacağı karnına doğru çek.","Kürek kemiklerini birbirine yaklaştır, 1 saniye tut.","Öne doğru kollar açılsın ama belini yuvarlama."],
   alts:[A("machrow","Machine Row","seated machine row","Göğsünü pede yasla, tutacakları gövdene çek.")]},
  {id:"facepull",n:"Face Pull",s:3,lo:15,hi:15,rest:60,m:"Arka omuz, üst sırt",q:"face pull",cues:["Kabloyu yüz hizasına ayarla, ipi avuçlar aşağı bakacak şekilde tut.","İpi yüzüne doğru çekerken iki ucu kulak yanlarına ayır.","Sonda elleri geriye döndür (kol kası poz verir gibi).","Hafif ağırlık kullan; amaç omuz sağlığı ve duruş."],
   alts:[A("revfly_a","Reverse Pec Deck","reverse pec deck","Kolları yana ve geriye aç, arka omzu sık.")]},
  {id:"bbcurl",n:"Barbell Curl",s:3,lo:8,hi:10,rest:75,m:"Ön kol (biceps)",q:"barbell curl",cues:["Barı omuz genişliğinde, avuç içleri öne bakacak şekilde tut.","Dirsekler yanlarda sabit dursun.","Barı göğüs hizasına kaldır, gövdeni geriye atma.","2–3 saniyede kollar tam açılana kadar indir."],
   alts:[A("ezcurl","EZ Bar Curl","ez bar curl","Kıvrık bar bileklere daha rahat gelir; dirsekleri sabit tut."),A("dbcurl","Dumbbell Curl","dumbbell curl","Avuçlar yukarı bakarak iki kolu birlikte ya da sırayla kaldır.")]},
  {id:"hammer",n:"Hammer Curl",s:3,lo:10,hi:12,rest:60,m:"Ön kol, önkol (brachialis)",q:"hammer curl",cues:["Dambılları avuç içleri birbirine bakacak şekilde tut.","Dirsekleri sabit tutarak omza doğru kaldır.","Bileğini döndürme, çekiç tutar gibi kalsın.","Yavaşça indir; sırayla ya da birlikte yapabilirsin."],
   alts:[A("ropehammer","Cable Rope Hammer Curl","rope hammer curl","İpi avuçlar birbirine bakacak şekilde tut, dirsekleri sabit tutarak çek.")]}
 ]},
 {key:"legs",name:"Legs",sub:"Bacak, kalça, karın · haftanın tek bacak günü",c:"--plate-yellow",ex:[
  {id:"squat",n:"Squat (veya Hack Squat)",s:4,lo:6,hi:8,rest:180,bar:true,m:"Ön bacak, kalça, iç bacak",q:"barbell back squat",cues:["Barı trapez kasının üstüne yerleştir, ayaklar omuz genişliğinde, uçlar hafif dışa.","Derin nefes al, karnını sık ve kalçanı geriye-aşağı göndererek otur.","Dizler ayak uçları yönünde gitsin, içe kapanmasın. Uyluk en az yere paralel olsun.","Topuklardan iterek kalk; sırt açısını koru."],
   alts:[A("hack_a","Hack Squat","hack squat","Sırtını pede yasla, ayaklar platformun ortasında, kontrollü çök ve topuklardan it."),A("smithsq","Smith Machine Squat","smith machine squat","Ayakları barın biraz önüne koy, kalçayı geri göndererek otur."),A("gobsq","Goblet Squat","goblet squat","Dambılı göğsünde tut, dik gövdeyle derin otur.")]},
  {id:"rdl",n:"Romanian Deadlift",s:4,lo:8,hi:10,rest:150,bar:true,m:"Arka bacak, kalça, bel",q:"romanian deadlift",cues:["Barı kalça önünde tut, dizler hafif bükük ve sabit.","Kalçanı geriye iterek gövdeni öne eğ; bar bacaklarına yakın kayarak insin.","Arka bacakta gerilme hissedince dur (genelde diz altı). Sırt düz kalsın.","Kalçayı öne iterek doğrul, yukarıda kalçanı sık."],
   alts:[A("dbrdl","Dumbbell RDL","dumbbell romanian deadlift","Dambıllar bacaklarına yakın insin; sırt düz, kalça geride.")]},
  {id:"legpress",n:"Leg Press",s:3,lo:10,hi:12,rest:120,m:"Ön bacak, kalça",q:"leg press",cues:["Sırtın ve kalçan sırt pedine tam yaslı olsun.","Ayakları platformun ortasına, omuz genişliğinde koy.","Dizler göğse yaklaşana kadar indir; kalçan pedden kalkmasın.","İterken dizleri en üstte kilitleme."],
   alts:[A("hack_b","Hack Squat","hack squat","Sırtını pede yasla, kontrollü çök ve topuklardan it.")]},
  {id:"lunge",n:"Walking Lunge",s:3,lo:10,hi:10,rest:90,m:"Ön bacak, kalça",q:"dumbbell walking lunge",note:"her bacak",cues:["Ellerinde dambıllarla dik dur.","Uzun bir adım at, arka diz yere yaklaşana kadar çök.","Ön diz ayak bileğinin üstünde kalsın, gövde dik.","Ön topuktan iterek diğer bacakla adım at. Tekrarı her bacak için say."],
   alts:[A("bss","Bulgarian Split Squat","bulgarian split squat","Arka ayağın sehpada, ön bacakla dik çök. Tekrarı her bacak için say."),A("stepup","Step-Up","dumbbell step up","Sehpaya ön ayaktan iterek çık, kontrollü in.")]},
  {id:"legcurl",n:"Leg Curl",s:3,lo:10,hi:12,rest:75,m:"Arka bacak",q:"lying leg curl",cues:["Makinede ped topuk üstünde, dizler makinenin eksen noktasıyla aynı hizada olsun.","Kalçanı pedden kaldırmadan topuklarını kalçana doğru çek.","En üstte 1 saniye sık.","Yavaşça geri bırak, ağırlık yığına çarpmasın."],
   alts:[A("seatcurl","Seated Leg Curl","seated leg curl","Ped bileğin üstünde, topukları aşağı ve geriye çek.")]},
  {id:"legext",n:"Leg Extension",s:3,lo:12,hi:15,rest:60,m:"Ön bacak",q:"leg extension",cues:["Sırtını yasla, ped ayak bileğinin hemen üstünde olsun.","Bacakları düzelene kadar kaldır, yukarıda 1 saniye sık.","Kontrollü indir.","Tutacakları tutarak kalçanı koltukta sabit tut."],alts:[]},
  {id:"calf",n:"Standing Calf Raise",s:4,lo:12,hi:15,rest:60,m:"Baldır",q:"standing calf raise",cues:["Ayak uçlarını basamağa koy, topuklar boşta.","Topukları olabildiğince aşağı indirip baldırı esnet.","Parmak uçlarında en yükseğe çık, 1 saniye tut.","Zıplatma yapma; her tekrar yavaş ve tam açıklıkta."],
   alts:[A("seatcalf","Seated Calf Raise","seated calf raise","Oturarak yapılır; baldırın alt kısmını çalıştırır."),A("lpcalf","Leg Press Calf Raise","leg press calf raise","Leg press'te ayak uçlarıyla platformu it.")]},
  {id:"legraise",n:"Hanging Leg Raise / Cable Crunch",s:3,lo:12,hi:15,rest:60,m:"Karın",q:"hanging leg raise",cues:["Bara asıl, omuzları hafif aşağı çek.","Dizleri (ya da düz bacakları) göğsüne doğru kaldır, kalçanı hafif öne kıvır.","Sallanmadan kontrollü indir.","Zorlanırsan dizler bükük yap ya da cable crunch'a geç."],
   alts:[A("cablecrunch","Cable Crunch","cable crunch","Diz çök, ipi başının yanında tut ve karnınla aşağı kıvrıl."),A("plank","Plank","plank proper form","Tekrar yerine saniye yaz. Kalça düz, karın sıkı.")]}
 ]},
 {key:"pushB",name:"Push B",sub:"Hacim · Göğüs, omuz, arka kol",c:"--plate-green",ex:[
  {id:"incline",n:"Incline Barbell / Smith Press",s:4,lo:8,hi:10,rest:120,bar:true,m:"Üst göğüs, ön omuz",q:"incline barbell bench press",cues:["Sehpayı 30° eğime ayarla, kürek kemiklerini sık.","Barı köprücük kemiğinin biraz altına indir.","Dirsekler 45° açıda, bilekler dik kalsın.","Göğse değince güçlü şekilde yukarı it."],
   alts:[A("incldb_b","Incline Dumbbell Press","incline dumbbell press","Sehpa 30°, dambılları üst göğüsten yukarı it.")]},
  {id:"dbbench",n:"Dumbbell Bench Press",s:3,lo:10,hi:12,rest:90,m:"Göğüs, arka kol",q:"dumbbell bench press",cues:["Dambılları dizlerinden yardımla göğüs hizasına al ve uzan.","Dambılları göğüs yanlarında başlat, kürek kemikleri sıkılı.","Yukarı ve hafif içe doğru it.","Göğüste esneme hissedene kadar kontrollü indir."],
   alts:[A("chestpress_b","Machine Chest Press","machine chest press","Tutacaklar göğüs ortası hizasında, kürek kemikleri sıkı."),A("pushup","Şınav (Push-Up)","push up proper form","Vücut düz bir çizgi; göğüs yere yaklaşana kadar in. Kilo yerine 0 yaz.")]},
  {id:"machsp",n:"Machine Shoulder Press",s:3,lo:10,hi:12,rest:90,m:"Omuz, arka kol",q:"machine shoulder press",cues:["Koltuğu tutacaklar omuz hizasına gelecek şekilde ayarla.","Sırtını tamamen yasla.","Yukarı it, dirseği kilitlemeden dur.","Yavaşça omuz hizasına indir."],
   alts:[A("dbsp_b","Dumbbell Shoulder Press","seated dumbbell shoulder press","Oturarak, dambılları kulak hizasından yukarı it.")]},
  {id:"lat2",n:"Lateral Raise (cable veya dumbbell)",s:4,lo:15,hi:15,rest:60,m:"Yan omuz",q:"cable lateral raise",cues:["Kabloyu en alta tak, karşı elinle tut ve makineye yan dur.","Dirsek hafif bükük, kolu yana omuz hizasına kaldır.","Omuzlarını kulağa doğru kaldırma.","Yavaş indir; kablo hareket boyunca kası yükte tutar."],
   alts:[A("dblat_b","Dumbbell Lateral Raise","dumbbell lateral raise","Dirsekler önde, omuz hizasına kadar kaldır."),A("machlat_b","Machine Lateral Raise","machine lateral raise","Dirsekleri pedlere yasla, yana kaldır.")]},
  {id:"dips",n:"Dips (veya Machine Dip)",s:3,lo:8,hi:12,rest:90,m:"Göğüs alt, arka kol",q:"chest dips",cues:["Paralel barlarda kollar düz başla.","Gövdeni hafif öne eğerek dirsekler 90° olana kadar in.","Omuzlar öne düşmesin, ağrı varsa derinliği azalt.","Avuçlardan iterek yukarı çık. Zorsa destekli makine kullan."],
   alts:[A("machdip","Machine Dip","machine dip","Tutacakları aşağı iterek kolları düzelt, kontrollü geri bırak."),A("benchdip","Bench Dip","bench dip","Ellerin sehpada, kalçanı aşağı indir ve geri it.")]},
  {id:"skull",n:"Skull Crusher",s:3,lo:10,hi:12,rest:75,m:"Arka kol",q:"ez bar skull crusher",cues:["Sehpaya uzan, EZ barı kollar düz göğüs üstünde tut.","Dirsekleri sabit tutarak barı alnına doğru indir.","Dirsekler dışa açılmasın.","Kolları düzelterek başlangıca dön."],
   alts:[A("ohte_b","Overhead Triceps Extension","overhead triceps extension","Dirsekler tavana baksın, ağırlığı başın arkasına indir.")]}
 ]},
 {key:"pullB",name:"Pull B",sub:"Hacim · Sırt, ön kol, + kalça takviyesi",c:"--plate-steel",ex:[
  {id:"pulldown",n:"Lat Pulldown (geniş tutuş)",s:4,lo:10,hi:12,rest:90,m:"Kanat (lat)",q:"lat pulldown",cues:["Diz pedini ayarla, barı omuzdan geniş tut.","Göğsünü hafif yukarı kaldır, gövdeni çok az geriye yatır.","Barı göğsünün üst kısmına çek, dirsekler aşağı ve geriye gitsin.","Kollar tam açılana kadar yavaşça bırak."],
   alts:[A("pullup_b","Barfiks","pull up proper form","Geniş tutuş, çene barın üstüne çıkana kadar çek."),A("closepd","Dar Tutuş Pulldown","close grip lat pulldown","V tutacakla göğsüne çek, dirsekler gövdeye yakın.")]},
  {id:"tbar",n:"Chest-Supported / T-Bar Row",s:3,lo:10,hi:12,rest:90,m:"Orta sırt, kanat",q:"chest supported row",cues:["Göğsünü pede yasla, tutacakları tut.","Dirsekleri geriye çekerek tutacakları gövdene getir.","Kürek kemiklerini sık, 1 saniye tut.","Kontrollü bırak; göğüs pedden kalkmasın."],
   alts:[A("machrow_b","Machine Row","seated machine row","Göğsünü pede yasla, tutacakları gövdene çek."),A("cablerow_b","Seated Cable Row","seated cable row","Göğüs dik, tutacağı karnına çek.")]},
  {id:"dbrow",n:"Tek Kol Dumbbell Row",s:3,lo:10,hi:12,rest:75,m:"Kanat, orta sırt",q:"one arm dumbbell row",cues:["Bir dizini ve elini sehpaya koy, sırt düz.","Dambılı kalçana doğru çek, dirsek gövdeye yakın.","Gövdeni döndürme.","Yavaşça kol tam açılana kadar indir. Tekrarı her kol için say."],
   alts:[A("cablerow1","Tek Kol Cable Row","single arm cable row","Tek kolla kabloyu kalçana doğru çek, gövdeni döndürme.")]},
  {id:"revfly",n:"Reverse Pec Deck",s:3,lo:15,hi:15,rest:60,m:"Arka omuz",q:"reverse pec deck",cues:["Makineye yüzün pede dönük otur, tutacaklar omuz hizasında.","Kollar hafif bükük, yana ve geriye doğru aç.","Kürek kemiklerini çok sıkmadan arka omuzla çalış.","Yavaşça başlangıca dön."],
   alts:[A("facepull_b","Face Pull","face pull","İpi yüzüne çek, uçları kulak yanlarına ayır."),A("dbrevfly","Dumbbell Reverse Fly","bent over dumbbell reverse fly","Öne eğil, kolları yana aç, arka omzu sık.")]},
  {id:"incurl",n:"Incline Dumbbell Curl",s:3,lo:10,hi:12,rest:60,m:"Ön kol (uzun baş)",q:"incline dumbbell curl",cues:["Sehpayı 45–60° eğime ayarla ve yaslan, kollar aşağı sarksın.","Dirsekler geride sabit kalsın.","Dambılları omza doğru kaldır.","Aşağıda kolu tam aç, esneme hisset."],
   alts:[A("preacher","Preacher Curl","preacher curl","Kolunu pede yasla, yukarı kaldır ve yavaş indir.")]},
  {id:"cablecurl",n:"Cable Curl",s:3,lo:12,hi:15,rest:60,m:"Ön kol",q:"cable curl",cues:["Kabloyu en alta tak, düz bar ya da EZ tutacak kullan.","Dirsekler yanlarda sabit dursun.","Yukarıda 1 saniye sık.","Kontrollü indir; kablo kası sürekli yükte tutar."],
   alts:[A("hammer_b","Hammer Curl","hammer curl","Avuçlar birbirine bakar, dirsekler sabit.")]},
  {id:"hipthrust",n:"Hip Thrust / 45° Back Extension",s:3,lo:10,hi:12,rest:90,bar:true,opt:true,m:"Kalça, arka bacak",q:"barbell hip thrust",cues:["Sırtının üst kısmını sehpaya yasla, bar kalça kıvrımında (ped kullan).","Ayakları kalça genişliğinde koy; yukarıda diz 90° olacak mesafede.","Topuklardan iterek kalçayı gövde düz olana kadar kaldır, en üstte sık.","Belini aşırı bükme, çene hafif içeride kalsın."],
   alts:[A("backext","45° Back Extension","45 degree back extension glutes","Kalçadan katlan, yukarıda kalçanı sık; beli aşırı bükme."),A("kickback","Cable Glute Kickback","cable glute kickback","Bacağı geriye it, kalçayı sık. Tekrarı her bacak için say.")]}
 ]}
];
const DAYMAP = Object.fromEntries(DAYS.map(d => [d.key, d]));
const WEEK = {1:"pushA",2:"pullA",3:"legs",4:"pushB",5:"pullB"};
const BAND = {pushA:["--band-red","#FFFFFF"],pullA:["--band-blue","#FFFFFF"],legs:["--band-yellow","#17140A"],pushB:["--band-green","#FFFFFF"],pullB:["--band-steel","#FFFFFF"]};
const LV = [[0,"Çaylak"],[300,"Isınan"],[800,"Demir Dostu"],[1600,"Plaka Avcısı"],[2800,"Bar Ustası"],[4500,"Demirhane"],[7000,"Efsane"],[11000,"Titan"]];
const QUOTES = ["Bugün yaptığın her set seni hedefine bir adım yaklaştırıyor.","Motivasyon gelir gider. Disiplin seni salona getirir.","Bar seni bekliyor. Bir set daha, belki bir rekor daha.","Zor olan başlamak. Gerisi sadece tekrar.","Tek rakibin geçen haftaki sensin.","Ter bugün, gurur yarın.","Plakayı tak, bahaneleri çıkar.","Yavaş ilerlemek de ilerlemektir. Durma yeter."];
const FOODS = [["Yumurta (1 adet)",6,75],["Tavuk göğsü 150 g",46,250],["Whey (1 ölçek)",24,120],["Yoğurt 200 g",8,120],["Lor peyniri 100 g",12,90],["Ton balığı (1 kutu)",25,140],["Kırmızı et 150 g",39,330],["Süt (1 bardak)",7,120],["Pilav (1 tabak)",4,250],["Ekmek (1 dilim)",3,80],["Mercimek çorbası",9,180],["Yulaf 50 g",7,190]];
const LIFTS = [["squat","Squat",10],["bench","Bench Press",5],["rdl","Romanian Deadlift",10],["bbrow","Barbell Row",5]];
const MEAS = [["waist","Bel"],["chest","Göğüs"],["arm","Kol"],["hip","Kalça"]];
const ACT = [[1.2,"Masa başı, az hareket"],[1.375,"Hafif hareketli"],[1.55,"Orta: haftada 3–5 antrenman"],[1.725,"Çok hareketli: her gün antrenman"],[1.9,"Ağır fiziksel iş + antrenman"]];

/* ---------- utils ---------- */
function iso(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function today(){return iso(new Date())}
function toDate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)}
function fmt(s,opt){return toDate(s).toLocaleDateString("tr-TR",opt||{day:"numeric",month:"long",weekday:"long"})}
function short(s){return fmt(s,{day:"numeric",month:"short"})}
function mmss(sec){sec=Math.max(0,Math.ceil(sec));return Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0")}
function hms(ms){const s=Math.max(0,Math.floor(ms/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(x).padStart(2,"0")}
function esc(t){return String(t??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function num(v){const n=parseFloat(String(v??"").replace(",","."));return isFinite(n)?n:null}
function fmtKg(v){return Number(v).toLocaleString("tr-TR",{maximumFractionDigits:1})}
function fmtN(v){return Math.round(v).toLocaleString("tr-TR")}
function fmtTon(v){return v>=1000?(v/1000).toLocaleString("tr-TR",{maximumFractionDigits:1})+" t":fmtN(v)+" kg"}
function quote(off){const d=new Date();const n=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);return QUOTES[(n+off)%QUOTES.length]}
function weekStart(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate()-((d.getDay()+6)%7))}
function wkKey(s){return iso(weekStart(toDate(s)))}
function addDays(s,n){const d=toDate(s);d.setDate(d.getDate()+n);return iso(d)}
function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function round25(v){return Math.round(v/2.5)*2.5}
function slug(t){return String(t).toLocaleLowerCase("tr-TR").replace(/[çğıöşü]/g,c=>({"ç":"c","ğ":"g","ı":"i","ö":"o","ş":"s","ü":"u"}[c])).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40)||"hareket"}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}

/* ---------- state ---------- */
let view=WEEK[new Date().getDay()]||"pushA";
let date=today(), dayDate=today();
const docs=new Map(), openCharts=new Set();
let outbox={}, uidKey="local", sb=null, user=null, pendingRender=false, confirmDel=null, rtChannel=null;
const prefs=Object.assign({wake:true,sound:true},lsGet("ppl:prefs",{}));
const main=document.getElementById("main"), statusEl=document.getElementById("status");
function setStatus(s,text){statusEl.dataset.s=s;statusEl.textContent=text}

/* ---------- storage & sync ---------- */
function loadCache(){
  docs.clear();
  Object.entries(lsGet("ppl:docs:"+uidKey,{})).forEach(([k,v])=>docs.set(k,v));
  outbox=lsGet("ppl:out:"+uidKey,{});
}
let persistT=null;
function persist(){
  clearTimeout(persistT);
  persistT=setTimeout(()=>{
    const ok=lsSet("ppl:docs:"+uidKey,Object.fromEntries(docs));
    lsSet("ppl:out:"+uidKey,outbox);
    if(!ok)setStatus("error","Cihazda yer kalmadı");
  },150);
}
let flushT=null,flushing=false,flushAgain=false;
function queueSave(id){
  outbox[id]=Date.now();persist();
  setStatus("saving","Kaydediliyor…");
  clearTimeout(flushT);flushT=setTimeout(flush,800);
}
function syncLabel(){return SYNC?(user?"Eşitlendi":"Bu cihazda kaydedildi"):"Bu cihazda kaydedildi"}
async function flush(){
  if(!SYNC||!sb||!user){outbox={};persist();setStatus("saved",SYNC?"Çevrimdışı · bu cihazda kayıtlı":"Bu cihazda kaydedildi");return}
  if(!navigator.onLine){setStatus("saving","Çevrimdışı · bağlanınca eşitlenecek");return}
  if(flushing){flushAgain=true;return}
  const snap={...outbox},ids=Object.keys(snap);
  if(!ids.length){setStatus("saved",syncLabel());return}
  flushing=true;
  const ups=[],dels=[],now=new Date().toISOString();
  ids.forEach(id=>{const d=docs.get(id);if(d)ups.push({user_id:user.id,id,data:d,updated_at:now});else dels.push(id)});
  try{
    for(let i=0;i<ups.length;i+=200){const {error}=await sb.from("docs").upsert(ups.slice(i,i+200));if(error)throw error}
    if(dels.length){const {error}=await sb.from("docs").delete().eq("user_id",user.id).in("id",dels);if(error)throw error}
    ids.forEach(id=>{if(outbox[id]===snap[id])delete outbox[id]});
    persist();setStatus("saved","Eşitlendi");
  }catch(e){
    console.warn("Eşitleme hatası",e);
    setStatus("error","Eşitlenemedi · tekrar denenecek");
    setTimeout(flush,15000);
  }
  flushing=false;
  if(flushAgain||Object.keys(outbox).length&&Object.keys(outbox).some(k=>outbox[k]!==snap[k])){flushAgain=false;flush()}
}
async function pull(){
  if(!SYNC||!sb||!user||!navigator.onLine)return;
  try{
    const rows=[];
    for(let from=0;;from+=1000){
      const {data,error}=await sb.from("docs").select("id,data").order("id").range(from,from+999);
      if(error)throw error;
      rows.push(...data);if(data.length<1000)break;
    }
    const server=new Map(rows.map(r=>[r.id,r.data]));
    let changed=false;
    server.forEach((v,k)=>{if(outbox[k])return;if(JSON.stringify(docs.get(k))!==JSON.stringify(v)){docs.set(k,v);changed=true}});
    [...docs.keys()].forEach(k=>{if(!server.has(k)&&!outbox[k]){docs.delete(k);changed=true}});
    persist();if(changed)maybeRender();
    if(Object.keys(outbox).length)flush();else setStatus("saved","Eşitlendi");
  }catch(e){console.warn("Kayıtlar alınamadı",e);setStatus("error","Kayıtlar alınamadı · çevrimdışı mısın?")}
}
function subscribeRealtime(){
  if(!sb||!user)return;
  if(rtChannel){sb.removeChannel(rtChannel);rtChannel=null}
  rtChannel=sb.channel("docs-"+user.id).on("postgres_changes",{event:"*",schema:"public",table:"docs",filter:"user_id=eq."+user.id},p=>{
    const id=(p.new&&p.new.id)||(p.old&&p.old.id);if(!id||outbox[id])return;
    if(p.eventType==="DELETE")docs.delete(id);else if(p.new&&p.new.data)docs.set(id,p.new.data);
    persist();maybeRender();
  }).subscribe();
}
window.addEventListener("online",()=>{pull();flush()});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"){pull();syncWake()}else syncWake()});

/* ---------- photos ---------- */
const urlCache=new Map();
function blobToDataURL(b){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(b)})}
async function shrink(file,max){
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
    const sc=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
    const c=document.createElement("canvas");c.width=Math.round(img.naturalWidth*sc);c.height=Math.round(img.naturalHeight*sc);
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    return await new Promise(res=>c.toBlob(b=>res(b),"image/jpeg",0.82));
  }finally{URL.revokeObjectURL(url)}
}
async function storePhoto(file){
  if(SYNC&&sb&&user){
    const blob=await shrink(file,1280);const path=user.id+"/"+newId()+".jpg";
    const {error}=await sb.storage.from("photos").upload(path,blob,{contentType:"image/jpeg"});
    if(error)throw error;return {photo:path};
  }
  const blob=await shrink(file,800);return {photoData:await blobToDataURL(blob)};
}
async function dropPhoto(m){if(m&&m.photo&&SYNC&&sb&&user){try{await sb.storage.from("photos").remove([m.photo])}catch(e){}}}
async function photoURL(m){
  if(m.photoData)return m.photoData;
  if(!m.photo||!SYNC||!sb||!user)return null;
  if(urlCache.has(m.photo))return urlCache.get(m.photo);
  const {data,error}=await sb.storage.from("photos").createSignedUrl(m.photo,3600);
  if(error||!data)return null;urlCache.set(m.photo,data.signedUrl);return data.signedUrl;
}
function fillPhotos(){
  main.querySelectorAll("[data-photo]").forEach(async el=>{
    const m=docs.get(el.dataset.photo);if(!m)return;
    const url=await photoURL(m).catch(()=>null);
    if(!url){el.textContent=navigator.onLine?"Fotoğraf yüklenemedi":"Fotoğraf internete bağlanınca görünür";return}
    const img=document.createElement("img");img.src=url;img.alt=el.dataset.alt||"";img.loading="lazy";
    img.addEventListener("error",()=>{img.replaceWith(Object.assign(document.createElement("div"),{className:"ph",textContent:"Fotoğraf yüklenemedi"}))});
    el.replaceWith(img);
  });
}

/* ---------- doc helpers ---------- */
function settings(){return docs.get("settings")||{kind:"settings",deloads:[]}}
function ensureSettings(){if(!docs.has("settings"))docs.set("settings",{kind:"settings",deloads:[]});const s=docs.get("settings");s.deloads=s.deloads||[];return s}
function notesMap(){return (docs.get("notes")||{}).map||{}}
function sid(day,dt){return "s_"+dt+"_"+day}
function session(day,dt){return docs.get(sid(day,dt))||{kind:"session",day,date:dt,ex:{}}}
function ensureSession(day,dt){const id=sid(day,dt);if(!docs.has(id))docs.set(id,{kind:"session",day,date:dt,ex:{}});const s=docs.get(id);s.ex=s.ex||{};return s}
function dailyDoc(ds){return docs.get("n_"+ds)||{kind:"food",date:ds,items:[]}}
function ensureDaily(ds){const id="n_"+ds;if(!docs.has(id))docs.set(id,{kind:"food",date:ds,items:[]});const d=docs.get(id);d.items=d.items||[];return d}
function effEx(s,x){
  if(x.custom)return {...x,base:x.id};
  const aid=(s.sw||{})[x.id];const a=aid&&(x.alts||[]).find(z=>z.id===aid);
  return a?{...x,id:a.id,base:x.id,n:a.n,q:a.q,cues:[a.tip],bar:false,alt:true}:{...x,base:x.id};
}
function customEx(c){return {id:c.id,n:c.n,s:3,lo:8,hi:12,rest:90,m:"Kendi eklediğin hareket",q:c.n,cues:["Bu hareketi sen ekledin. Doğru formu görmek için aşağıdaki videoya bak."],alts:[],custom:true,opt:true}}
function dayExercises(s){return [...DAYMAP[s.day].ex,...(s.custom||[]).map(customEx)]}
function setCount(s,e,x){return Math.max(1,x.s+((s.extra||{})[e.id]||0))}
function isDeload(ds){return (settings().deloads||[]).includes(wkKey(ds))}
function req(x,ds){return isDeload(ds)?Math.ceil(x.s/2):x.s}
function okSets(s){let n=0,vol=0;Object.values(s.ex||{}).forEach(a=>(a||[]).forEach(r=>{if(r&&r.ok){n++;if(r.kg&&r.r)vol+=r.kg*r.r}}));return {n,vol}}
function isComplete(s){const d=DAYMAP[s.day];return !!d&&d.ex.filter(x=>!x.opt).every(x=>{const e=effEx(s,x);return ((s.ex||{})[e.id]||[]).filter(r=>r&&r.ok).length>=Math.min(req(x,s.date),setCount(s,e,x))})}
function sessions(){return [...docs.values()].filter(d=>d.kind==="session"&&DAYMAP[d.day]).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0)}
function topKg(arr){let t=null;(arr||[]).forEach(r=>{if(r&&r.ok&&r.kg)t=Math.max(t??0,r.kg)});return t}
function lastFor(eid,before){let best=null;for(const d of docs.values()){if(d.kind!=="session"||d.date>=before)continue;const sets=(d.ex||{})[eid];if(!sets||!sets.some(x=>x&&(x.kg!=null||x.r!=null)))continue;if(!best||d.date>best.date)best={date:d.date,sets}}return best}
function bestIn(eid,from,to){let b=null;for(const d of docs.values()){if(d.kind!=="session"||d.date<from||d.date>=to)continue;const t=topKg((d.ex||{})[eid]);if(t!=null)b=Math.max(b??0,t)}return b}
function prevBest(eid,before){return bestIn(eid,"0000-00-00",before)}
function dayTotals(ds){const d=docs.get("n_"+ds)||{};let p=0,k=0;(d.items||[]).forEach(i=>{p+=i.p||0;k+=i.k||0});return {p,k,items:d.items||[],water:d.water||0,sleep:d.sleep??null,steps:d.steps??null}}
function weights(){return [...docs.values()].filter(d=>d.kind==="weight"&&typeof d.kg==="number").sort((a,b)=>a.date<b.date?-1:1)}
function meas(){return [...docs.values()].filter(d=>d.kind==="meas").sort((a,b)=>a.date<b.date?-1:1)}
function minutes(s){return s.start&&s.end&&s.end>s.start?Math.min(240,(s.end-s.start)/60000):0}
function cardioMin(s){return (s.cardio&&num(s.cardio.min))||0}

/* ---------- profile & targets ---------- */
function profile(){return Object.assign({start:95,goal:85,height:null,age:null,sex:"m",activity:1.55,protPerKg:1.9,kcal:null,prot:null},settings().profile||{})}
function targets(){
  const p=profile(),ws=weights(),cur=ws.length?ws[ws.length-1].kg:+p.start;
  let K=[2200,2400],src="default",tdee=null;
  if(p.height&&p.age){
    const bmr=10*cur+6.25*p.height-5*p.age+(p.sex==="f"?-161:5);
    tdee=Math.round(bmr*p.activity/10)*10;
    const c=Math.max(p.sex==="f"?1200:1500,Math.round((tdee-500)/50)*50);
    K=[c-100,c+100];src="calc";
  }
  if(p.kcal){K=[p.kcal-100,p.kcal+100];src="manual"}
  const pc=p.prot||Math.round(p.protPerKg*cur/5)*5;
  return {K,P:[pc-10,pc+10],src,tdee,cur};
}
function applyProfile(){const p=profile();START=+p.start||95;GOAL=+p.goal||85;const t=targets();PROT=t.P;KCAL=t.K}
function milestones(){const out=[];for(let m=Math.floor(START)-2;m>GOAL;m-=2)out.push(m);out.push(GOAL);return out}

/* ---------- stats ---------- */
function computeStats(){
  const ss=sessions().filter(s=>okSets(s).n>0||cardioMin(s)>0);
  let xp=0,prs=0,ton=0,cardioCount=0,workouts=0;const best={},prMap={},wk={};
  const W=k=>wk[k]=wk[k]||{n:0,sets:0,vol:0,prs:0,xp:0,min:0,cardio:0};
  ss.forEach(s=>{
    const o=okSets(s),w=W(weekStart(toDate(s.date)).getTime()),cm=cardioMin(s);
    let x=o.n*10+(isComplete(s)?50:0)+(cm>=15?15:0);
    if(cm>=15)cardioCount++;w.cardio+=cm;
    if(o.n>0){workouts++;w.n++}
    ton+=o.vol;w.sets+=o.n;w.vol+=o.vol;w.min+=minutes(s);
    const id=sid(s.day,s.date);
    Object.entries(s.ex||{}).forEach(([ex,a])=>{
      const top=topKg(a);if(top==null)return;
      if(best[ex]!=null&&top>best[ex]){prs++;w.prs++;x+=25;(prMap[id]=prMap[id]||{})[ex]=true}
      best[ex]=Math.max(best[ex]??0,top);
    });
    xp+=x;w.xp+=x;
  });
  let protDays=0,stepDays=0;
  [...docs.values()].filter(d=>d.kind==="food").forEach(d=>{
    const t=dayTotals(d.date),w=W(weekStart(toDate(d.date)).getTime());let x=0;
    if(t.p>=PROT[0]){protDays++;x+=20}
    if(t.steps>=STEP_GOAL){stepDays++;x+=10}
    if(t.water>=WATER_GOAL)x+=5;
    if(t.sleep>=SLEEP_GOAL)x+=5;
    xp+=x;w.xp+=x;
  });
  const mon=weekStart(new Date());
  const thisWeek=ss.filter(s=>okSets(s).n>0&&weekStart(toDate(s.date)).getTime()===mon.getTime());
  const cnt=m=>(wk[m.getTime()]||{n:0}).n;
  let streak=0;const m=new Date(mon);if(cnt(m)<4)m.setDate(m.getDate()-7);
  while(cnt(m)>=4&&streak<300){streak++;m.setDate(m.getDate()-7)}
  let bestStreak=0,run=0,prevK=null;
  Object.keys(wk).map(Number).sort((a,b)=>a-b).forEach(k=>{
    if(wk[k].n>=4){run=(prevK!=null&&Math.round((k-prevK)/(7*864e5))===1)?run+1:1;prevK=k;bestStreak=Math.max(bestStreak,run)}else{run=0;prevK=null}
  });
  const fullWeek=Object.values(wk).some(w=>w.n>=5);
  return {xp,prs,ton,workouts,thisWeek,streak,bestStreak:Math.max(bestStreak,streak),fullWeek,prMap,wk,protDays,stepDays,cardioCount};
}
function level(xp){let i=0;while(i+1<LV.length&&xp>=LV[i+1][0])i++;const cur=LV[i][0],nx=LV[i+1]?LV[i+1][0]:null;return {n:i+1,name:LV[i][1],nx,pct:nx?(xp-cur)/(nx-cur)*100:100}}
function weeksSinceDeload(st){
  const dl=new Set(settings().deloads||[]);const m=weekStart(new Date());m.setDate(m.getDate()-7);let n=0;
  while(n<52){if(dl.has(iso(m)))break;if(((st.wk[m.getTime()]||{}).n||0)<3)break;n++;m.setDate(m.getDate()-7)}
  return n;
}
function forecast(ws){
  if(ws.length<3)return null;
  const last=ws[ws.length-1];
  const from=addDays(last.date,-28);const pts=ws.filter(w=>w.date>=from);if(pts.length<3)return last.kg<=GOAL?{done:true}:null;
  const t0=toDate(pts[0].date).getTime();const xs=pts.map(p=>(toDate(p.date).getTime()-t0)/864e5),ys=pts.map(p=>p.kg);
  const span=xs[xs.length-1]-xs[0];if(span<7)return last.kg<=GOAL?{done:true}:null;
  const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;
  let sxy=0,sxx=0;xs.forEach((x,i)=>{sxy+=(x-mx)*(ys[i]-my);sxx+=(x-mx)*(x-mx)});
  const b=sxx?sxy/sxx:0,fit=my+b*(xs[xs.length-1]-mx);
  const res={weekly:b*7,tooFast:b*7<-1};
  if(last.kg<=GOAL){res.done=true;return res}
  if(b<-0.005){const days=(fit-GOAL)/(-b);if(days<=730){const d=toDate(last.date);d.setDate(d.getDate()+Math.round(days));res.eta=iso(d);res.days=Math.round(days)}}
  return res;
}
function challenges(y,mo){
  const ms=iso(new Date(y,mo,1)),nx=iso(new Date(y,mo+1,1));
  const ss=sessions().filter(s=>s.date>=ms&&s.date<nx&&okSets(s).n>0).length;
  const pd=[...docs.values()].filter(d=>d.kind==="food"&&d.date>=ms&&d.date<nx&&dayTotals(d.date).p>=PROT[0]).length;
  const L=LIFTS[mo%4],base=bestIn(L[0],"0000-00-00",ms),mb=bestIn(L[0],ms,nx);
  const lift=base==null?{t:`${L[1]}: ilk kaydın`,txt:mb!=null?`${fmtKg(mb)} kg kaydedildi`:"bu ay henüz yapılmadı",p:mb!=null?1:0}
    :{t:`${L[1]}: ${fmtKg(base)} → ${fmtKg(base+L[2])} kg`,txt:mb!=null?`bu ay en iyi ${fmtKg(mb)} kg`:"bu ay henüz yapılmadı",p:mb==null?0:(mb-base)/L[2]};
  const ws=weights(),bef=ws.filter(w=>w.date<ms),inM=ws.filter(w=>w.date>=ms&&w.date<nx);
  const sw=bef.length?bef[bef.length-1].kg:(inM[0]?inM[0].kg:null),ew=inM.length?inM[inM.length-1].kg:null;
  const lost=sw!=null&&ew!=null?sw-ew:0;
  const list=[
    {t:"20 antrenman",txt:`${ss} / 20`,p:ss/20},
    {t:"20 gün protein hedefi",txt:`${pd} / 20 gün`,p:pd/20},
    lift,
    {t:"Bu ay 2 kg ver",txt:`${fmtKg(Math.max(0,lost))} / 2 kg`,p:lost/2}
  ].map(c=>({...c,p:Math.max(0,Math.min(1,c.p))}));
  return {list,all:list.every(c=>c.p>=1)};
}
function monthChampion(){
  const ds=[...docs.values()].map(d=>d.date).filter(Boolean).sort();if(!ds.length)return false;
  const s=toDate(ds[0]),now=new Date();let y=s.getFullYear(),m=s.getMonth();
  while(y<now.getFullYear()||(y===now.getFullYear()&&m<=now.getMonth())){if(challenges(y,m).all)return true;m++;if(m>11){m=0;y++}}
  return false;
}

/* ---------- hero & banners ---------- */
function barbell(wk){
  const w=22,g=5;
  let s=`<svg viewBox="0 0 600 120" role="img" aria-label="Bu hafta ${wk.length} antrenman yapıldı, bara ${Math.min(wk.length,5)} plaka takıldı">`;
  s+=`<rect x="4" y="55" width="592" height="10" rx="4" fill="var(--hero-muted)" fill-opacity=".5"/>`;
  s+=`<rect x="148" y="42" width="11" height="36" rx="2" fill="var(--hero-muted)"/><rect x="441" y="42" width="11" height="36" rx="2" fill="var(--hero-muted)"/>`;
  for(let i=0;i<5;i++){
    const sess=wk[i],lx=148-5-(i+1)*(w+g)+g,rx=452+5+i*(w+g);
    [lx,rx].forEach(x=>{
      if(sess)s+=`<rect x="${x}" y="10" width="${w}" height="100" rx="5" fill="var(${BAND[sess.day][0]})"/><rect x="${x+4}" y="18" width="3" height="84" rx="1.5" fill="#FFFFFF" fill-opacity=".22"/>`;
      else s+=`<rect x="${x+.75}" y="10.75" width="${w-1.5}" height="98.5" rx="5" fill="none" stroke="var(--hero-muted)" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    });
  }
  s+=`<text x="300" y="42" text-anchor="middle" style="font-family:var(--f-display);font-weight:700" font-size="30" fill="var(--hero-ink)">${wk.length}/5</text>`;
  s+=`<text x="300" y="92" text-anchor="middle" style="font-family:var(--f-body);font-weight:600;letter-spacing:.16em" font-size="11" fill="var(--hero-muted)">BU HAFTA</text></svg>`;
  return s;
}
function renderHero(st){
  const lv=level(st.xp),ws=weights(),cur=ws.length?ws[ws.length-1].kg:START,fc=forecast(ws);
  const n=st.thisWeek.length;
  const wl=n>=5?"Tam hafta! Bar dolu.":n>=4?"Seri bu hafta da devam ediyor.":`Seriyi sürdürmek için bu hafta <b>${4-n}</b> antrenman daha.`;
  document.getElementById("subtitle").textContent=`${fmtKg(START)} → ${fmtKg(GOAL)} kg · haftada 5 gün`;
  document.getElementById("hero").innerHTML=`
  <div class="hrow">
    <div class="lvl"><p class="tt">Seviye ${lv.n}</p><span class="nm">${lv.name}</span>
      <div class="xp" role="progressbar" aria-valuenow="${Math.round(lv.pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="Sonraki seviyeye ilerleme"><i style="width:${lv.pct}%"></i></div>
      <span class="xpt">${fmtN(st.xp)} XP${lv.nx?` · ${fmtN(lv.nx-st.xp)} XP sonra ${LV[lv.n][1]}`:" · en üst seviye"}</span></div>
    <div class="streak"><div class="n">${st.streak}</div><div class="l">hafta seri</div></div>
  </div>
  <div class="barbell">${barbell(st.thisWeek)}</div>
  <p class="weekline">${wl} Her antrenman bara bir plaka takar; haftada 4+ antrenman seriyi büyütür.</p>
  <div class="hstats">
    <div><b>${fmtTon(st.ton)}</b><span>toplam kaldırdığın</span></div>
    <div><b>${st.prs}</b><span>kişisel rekor</span></div>
    <div><b>${fmtKg(Math.max(0,cur-GOAL))} kg</b><span>${fc&&fc.eta?"hedef: "+short(fc.eta):"hedefe kalan"}</span></div>
  </div>
  <p class="quote">${quote(0)}</p>`;
}
function renderBanners(st){
  const out=[],dlNow=isDeload(today()),n=weeksSinceDeload(st),dow=new Date().getDay(),fc=forecast(weights()),p=profile();
  if(fc&&fc.tooFast)out.push(`<div class="banner bad"><p><b>Çok hızlı kilo veriyorsun: haftada ${fmtKg(-fc.weekly)} kg.</b> Haftada 1 kg'ın üstü kas kaybı riskini artırır. Günlük kaloriyi 150–200 kcal artır, proteini yüksek tut.</p><button class="btn ghost" type="button" data-act="goweight">Kilo grafiği</button></div>`);
  if(dlNow)out.push(`<div class="banner info"><p><b>Deload haftası.</b> Her harekette setlerin yarısını yap ve kiloyu yaklaşık %10 azalt. Gelecek hafta daha güçlü dönersin.</p><button class="btn ghost" type="button" data-act="undeload">Deload'u iptal et</button></div>`);
  else if(n>=6)out.push(`<div class="banner"><p><b>${n} haftadır ara vermeden çalışıyorsun.</b> Bu hafta deload zamanı: setler yarıya, kilo %10 aşağı. Vücudun toparlanır, rekorlar sonra gelir.</p><button class="btn" type="button" data-act="deload">Bu hafta deload yapıyorum</button></div>`);
  if(!p.height&&!p.age&&view!=="settings")out.push(`<div class="banner info"><p><b>Kalori hedefin şu an kaba bir tahmin.</b> Boyunu ve yaşını girersen sana özel hesaplarım.</p><button class="btn ghost" type="button" data-act="gosettings">Ayarlar</button></div>`);
  if((dow===0||dow===1)&&view!=="progress")out.push(`<div class="banner info"><p><b>Haftalık özetin hazır.</b> Bu haftayı geçen haftayla karşılaştır.</p><button class="btn ghost" type="button" data-act="summary">Özeti aç</button></div>`);
  document.getElementById("banners").innerHTML=out.join("");
}

/* ---------- tabs ---------- */
function renderTabs(st){
  const items=[...DAYS.map(d=>({k:d.key,n:d.name,c:d.c})),{k:"daily",n:"Günlük",c:"--accent"},{k:"weight",n:"Kilo",c:"--good"},{k:"progress",n:"İlerleme",c:"--gold"},{k:"settings",n:"Ayarlar",c:"--muted"}];
  const did=new Set(st.thisWeek.map(s=>s.day));
  document.getElementById("tabs").innerHTML=items.map(t=>`<button class="tab${did.has(t.k)?" did":""}" role="tab" id="tab-${t.k}" data-view="${t.k}" aria-selected="${view===t.k}" style="--c:var(${t.c})"><span class="dot"></span>${t.n}${did.has(t.k)?'<span class="ok" aria-label="bu hafta yapıldı">✓</span>':""}</button>`).join("");
}
document.getElementById("tabs").addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(!b)return;view=b.dataset.view;confirmDel=null;render();const t=document.getElementById("tab-"+view);if(t)t.scrollIntoView({block:"nearest",inline:"nearest"})});

/* ---------- render ---------- */
function render(){
  pendingRender=false;
  applyProfile();
  const st=computeStats();
  renderHero(st);renderBanners(st);renderTabs(st);
  if(view==="weight")renderWeight();
  else if(view==="daily")renderDaily();
  else if(view==="progress")renderProgress(st);
  else if(view==="settings")renderSettings();
  else renderDay();
  fillPhotos();syncWake();
}
function isEditing(){const a=document.activeElement;return a&&main.contains(a)&&((a.tagName==="INPUT"&&!["date","file","checkbox"].includes(a.type))||a.tagName==="TEXTAREA")}
function maybeRender(){if(isEditing())pendingRender=true;else render()}
document.addEventListener("focusout",()=>{setTimeout(()=>{if(pendingRender&&!isEditing())render()},0)});

/* ---------- day ---------- */
function ring(done,total,on){
  const r=27,c=2*Math.PI*r,p=total?Math.min(1,done/total):0;
  return `<svg class="ring" width="76" height="76" viewBox="0 0 76 76" role="img" aria-label="${done}/${total} set tamamlandı"><circle cx="38" cy="38" r="${r}" fill="none" stroke="${on}" stroke-opacity=".25" stroke-width="8"/>${p>0?`<circle cx="38" cy="38" r="${r}" fill="none" stroke="${on}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(c*p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 38 38)"/>`:""}<text x="38" y="45" text-anchor="middle" font-size="20" fill="${on}">${Math.round(p*100)}%</text></svg>`;
}
function sessBarHTML(s){
  if(s.start&&s.end)return `<div><div class="lbl">Antrenman süresi</div><div class="clock">${Math.round(minutes(s))} dk</div></div><button class="tbtn" type="button" data-act="sessresume">Devam et</button>`;
  if(s.start)return `<div><div class="lbl">Antrenman sürüyor${wakeLock?" · ekran açık tutuluyor":""}</div><div class="clock" id="sessClock">${hms(Date.now()-s.start)}</div></div><button class="btn" type="button" data-act="sessend">Antrenmanı bitir</button>`;
  return `<div><div class="lbl">Süre tutulmuyor</div><div class="note">İlk seti işaretleyince kendiliğinden başlar.</div></div><button class="btn" type="button" data-act="sessstart">Antrenmanı başlat</button>`;
}
function renderDay(){
  const day=DAYMAP[view],s=session(view,date);
  let total=0,done=0;
  day.ex.forEach(x=>{if(x.opt)return;const e=effEx(s,x);const need=Math.min(req(x,date),setCount(s,e,x));total+=need;done+=Math.min(need,((s.ex||{})[e.id]||[]).filter(r=>r&&r.ok).length)});
  const vol=okSets(s).vol,planned=WEEK[toDate(date).getDay()],cm=s.cardio||{};
  main.innerHTML=`
  <section class="band" style="--b:var(${BAND[view][0]});--on:${BAND[view][1]}">
    <div><h2>${day.name}</h2><p class="sub">${day.sub}</p></div>
    ${ring(done,total,BAND[view][1])}
  </section>
  ${isDeload(date)?`<div class="banner info"><p><b>Deload haftası:</b> her harekette setlerin yarısını yap ve kiloyu %10 azalt. Halka yarım setlerle dolar.</p></div>`:""}
  <div class="sessbar" id="sessbar">${sessBarHTML(s)}</div>
  <div class="row">
    <label class="note" for="dateIn">Tarih</label><input type="date" id="dateIn" value="${date}">
    <span class="progress"><b>${done}</b> / ${total} set · hacim <b>${fmtN(vol)}</b> kg</span>
  </div>
  ${planned&&planned!==view?`<p class="note">Bu tarihin programdaki günü: <b>${DAYMAP[planned].name}</b></p>`:""}
  ${dayExercises({...s,day:view}).map(x=>exCard(x,s)).join("")}
  <section class="card">
    <h3>Hareket ekle</h3>
    <p class="note">Programda olmayan bir hareket yaptıysan ekle. Aynı adı kullanırsan geçmişi ve rekorları birlikte tutulur.</p>
    <div class="row"><input type="text" id="cxName" placeholder="Örn. Pec Deck" style="flex:1 1 180px" aria-label="Hareket adı"><button class="btn" type="button" id="cxAdd">Ekle</button></div>
  </section>
  <section class="card">
    <div class="row" style="justify-content:space-between"><h3>Kardiyo</h3>${cardioMin(s)>=15?'<span class="chip up">Tamam · +15 XP</span>':""}</div>
    <p class="note">${view==="legs"?"Bacak gününde kardiyo isteğe bağlı; yaparsan en fazla 10 dk hafif tut.":"Antrenmandan sonra 15–20 dk eğimli yürüyüş: eğim %8–12, hız 4,5–5,5 km/s."}</p>
    <div class="formgrid">
      <label>Süre (dk)<input type="number" id="cMin" data-cardio="min" inputmode="numeric" min="0" step="1" value="${cm.min??""}"></label>
      <label>Eğim (%)<input type="number" id="cInc" data-cardio="inc" inputmode="decimal" min="0" step="0.5" value="${cm.inc??""}"></label>
      <label>Hız (km/s)<input type="number" id="cSpd" data-cardio="spd" inputmode="decimal" min="0" step="0.1" value="${cm.spd??""}"></label>
    </div>
    <div class="quick"><button class="tbtn" type="button" data-cquick="15">15 dk eğimli yürüyüş</button><button class="tbtn" type="button" data-cquick="20">20 dk eğimli yürüyüş</button></div>
  </section>
  <p class="note">Her sette 1–2 tekrar yedek bırak. Bir harekette tüm setler üst sınıra ulaşınca bir sonraki antrenmanda ağırlığı artır (üst vücut +1–2,5 kg, bacak +2,5–5 kg).</p>`;
}
function plateTarget(arr,last){
  let kg=null;(arr||[]).forEach(r=>{if(r&&r.kg)kg=Math.max(kg??0,r.kg)});
  if(kg==null&&last)last.sets.forEach(r=>{if(r&&r.kg)kg=Math.max(kg??0,r.kg)});
  return kg;
}
function platesHTML(kg){
  if(kg==null)return `<span>Kilo girince bara her yana hangi plakaları takacağını burada görürsün.</span>`;
  if(kg<=BARKG)return `<span>${fmtKg(kg)} kg: boş bar (${BARKG} kg) yeterli.</span>`;
  let per=(kg-BARKG)/2;const used=[];
  PLATES.forEach(p=>{while(per>=p-1e-9){used.push(p);per-=p}});
  const cls=p=>p>=25?"p25":p>=20?"p20":p>=15?"p15":p>=10?"p10":p>=5?"p5":p>=2.5?"p2":"p1";
  return `<span>${fmtKg(kg)} kg için her yana:</span>${used.map(p=>`<span class="pl ${cls(p)}">${fmtKg(p)}</span>`).join("")}<span>· bar ${BARKG} kg${per>0.01?` · ${fmtKg(per*2)} kg tam denk gelmiyor`:""}</span>`;
}
function warmHTML(kg){
  if(kg==null)return `<p class="note">Çalışma kilonu girince ısınma setlerini hesaplarım.</p>`;
  if(kg<=40)return `<p class="note">Boş bar × 10–12 tekrar yeterli, sonra çalışma setlerine geç.</p>`;
  const steps=[[0,10],[.5,5],[.7,3]];if(kg>=80)steps.push([.85,1]);
  const rows=[];let lastKg=0;
  steps.forEach(([p,r])=>{const w=p?Math.max(BARKG,round25(kg*p)):BARKG;if(w>lastKg&&w<kg){rows.push(`<li>${w===BARKG?"Boş bar":fmtKg(w)+" kg"} × ${r}</li>`);lastKg=w}});
  return `<ol class="warm">${rows.join("")}</ol><p class="note">Isınma setleri yorulmak için değil; aralarında 60–90 sn dinlen. Sonra ${fmtKg(kg)} kg ile çalışma setlerine geç.</p>`;
}
function exChart(eid){
  const pts=sessions().map(s=>({d:s.date,kg:topKg((s.ex||{})[eid])})).filter(p=>p.kg!=null);
  if(pts.length<2)return `<p class="note">Grafik için bu harekette en az 2 antrenman kaydı gerekiyor${pts.length?` (şu an 1: ${fmtKg(pts[0].kg)} kg)`:""}.</p>`;
  const W=560,H=150,L=38,R=14,T=16,B=24,kgs=pts.map(p=>p.kg);
  const lo=Math.floor(Math.min(...kgs)-2.5),hi=Math.ceil(Math.max(...kgs)+2.5),bestKg=Math.max(...kgs);
  const x=i=>L+i*(W-L-R)/(pts.length-1),y=k=>T+(hi-k)/(hi-lo)*(H-T-B);
  let g="";[lo,(lo+hi)/2,hi].forEach(k=>{g+=`<line x1="${L}" x2="${W-R}" y1="${y(k)}" y2="${y(k)}" stroke="var(--line)"/><text x="${L-6}" y="${y(k)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${fmtKg(k)}</text>`});
  const line=pts.map((p,i)=>`${x(i).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");
  const bi=kgs.lastIndexOf(bestKg),diff=pts[pts.length-1].kg-pts[0].kg;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kilo gelişimi grafiği">${g}
    <polygon points="${x(0)},${H-B} ${line} ${x(pts.length-1)},${H-B}" fill="var(--accent)" fill-opacity=".1"/>
    <polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.kg)}" r="3" fill="var(--accent)"/>`).join("")}
    <circle cx="${x(bi)}" cy="${y(bestKg)}" r="6" fill="var(--gold)" stroke="var(--surface)" stroke-width="2"/>
    <text x="${L}" y="${H-6}" font-size="11" fill="var(--muted)">${short(pts[0].d)}</text>
    <text x="${W-R}" y="${H-6}" text-anchor="end" font-size="11" fill="var(--muted)">${short(pts[pts.length-1].d)}</text></svg>
    <p class="note">İlk ${fmtKg(pts[0].kg)} kg → son ${fmtKg(pts[pts.length-1].kg)} kg (${diff>=0?"+":""}${fmtKg(diff)} kg) · en iyi <b>${fmtKg(bestKg)} kg</b></p>`;
}
function exCard(x,s){
  const e=effEx(s,x),arr=(s.ex||{})[e.id]||[],last=lastFor(e.id,date),T=setCount(s,e,x),need=Math.min(req(x,date),T);
  const reps=x.lo===x.hi?`${x.lo}`:`${x.lo}–${x.hi}`;
  let chip=x.custom?'<span class="chip">Eklediğin hareket</span>':x.opt?'<span class="chip opt">İsteğe bağlı</span>':"";
  if(last&&last.sets.length>=x.s&&last.sets.slice(0,x.s).every(r=>r&&r.r!=null&&r.r>=x.hi))chip='<span class="chip up">Ağırlığı artır</span>';
  const pb=prevBest(e.id,date),isPr=r=>pb!=null&&r&&r.ok&&r.kg&&r.kg>pb;
  if(arr.some(isPr))chip='<span class="chip pr">Yeni rekor!</span>';
  const lastTxt=last?`<p class="last">Geçen sefer (${short(last.date)}): ${last.sets.filter(r=>r&&(r.kg!=null||r.r!=null)).map(r=>`<b>${r.kg??"–"}×${r.r??"–"}</b>`).join(" · ")}</p>`:"";
  const allDone=arr.filter(r=>r&&r.ok).length>=need;
  const note=notesMap()[e.id]||"",tk=plateTarget(arr,last);
  let rows="";
  for(let i=0;i<T;i++){
    const r=arr[i]||{},ph=last&&last.sets[i]?last.sets[i]:null;
    rows+=`<div class="set${isPr(r)?" pr":""}${i>=need?" extra":""}">
      <span class="no">${i+1}</span>
      <label class="field"><input type="number" inputmode="decimal" step="0.5" min="0" id="kg-${e.id}-${i}" data-ex="${e.id}" data-i="${i}" data-f="kg" value="${r.kg??""}" placeholder="${ph&&ph.kg!=null?ph.kg:"kg"}" aria-label="${esc(e.n)} set ${i+1} kilo"><span>kg</span></label>
      <label class="field"><input type="number" inputmode="numeric" step="1" min="0" id="r-${e.id}-${i}" data-ex="${e.id}" data-i="${i}" data-f="r" value="${r.r??""}" placeholder="${ph&&ph.r!=null?ph.r:reps}" aria-label="${esc(e.n)} set ${i+1} tekrar"><span>tekrar</span></label>
      <button type="button" class="tick" data-tick="${e.id}" data-base="${x.id}" data-i="${i}" aria-pressed="${!!r.ok}" aria-label="Set ${i+1} tamamlandı">${TICK}</button>
    </div>`;
  }
  const yt="https://www.youtube.com/results?search_query="+encodeURIComponent(e.q+" doğru form nasıl yapılır");
  const swap=(x.alts||[]).length?`<select id="sw-${x.id}" data-swap="${x.id}" aria-label="${esc(x.n)} yerine başka hareket seç"><option value="">${esc(x.n)}${e.alt?"":" (program)"}</option>${x.alts.map(a=>`<option value="${a.id}"${a.id===e.id?" selected":""}>${esc(a.n)}</option>`).join("")}</select>`:"";
  return `<article class="ex${allDone?" done":""}">
    <div class="ex-head"><div>${e.alt?`<span class="alt">Yerine: ${esc(x.n)}</span>`:""}<h3>${esc(e.n)}</h3><p class="meta">${T} × ${reps}${x.note?" ("+x.note+")":""} · dinlenme ${mmss(x.rest)}${need<x.s&&!x.custom?" · deload":""}</p></div>${chip}</div>
    ${lastTxt}
    ${note?`<p class="exnote"><b>Not:</b> ${esc(note)}</p>`:""}
    ${e.bar?`<div class="plates" id="pl-${e.id}">${platesHTML(tk)}</div>`:""}
    <div class="sets">${rows}</div>
    <div class="tools">
      <button class="tbtn" type="button" data-setadd="${e.id}" data-base="${x.id}" aria-label="${esc(e.n)} için set ekle">+ Set</button>
      <button class="tbtn" type="button" data-setdel="${e.id}" data-base="${x.id}" aria-label="${esc(e.n)} için son seti kaldır"${T<=1?" disabled":""}>− Set</button>
      <button class="tbtn" type="button" data-chart="${e.id}" aria-pressed="${openCharts.has(e.id)}">Gelişim grafiği</button>
      ${swap}
      ${x.custom?`<button class="tbtn" type="button" data-cxdel="${x.id}">Hareketi kaldır</button>`:""}
    </div>
    ${openCharts.has(e.id)?`<div class="exchart">${exChart(e.id)}</div>`:""}
    ${e.bar?`<details class="how"><summary>Isınma setleri</summary><div id="wu-${e.id}">${warmHTML(tk)}</div></details>`:""}
    <details class="how"><summary>Nasıl yapılır</summary><div>
      <p class="mus">Çalışan kaslar: ${esc(x.m)}</p>
      <ol>${e.cues.map(c=>`<li>${esc(c)}</li>`).join("")}</ol>
      <a class="vid" href="${yt}" target="_blank" rel="noopener">${PLAY}Videosunu izle (YouTube)</a></div>
    </details>
    <details class="how"><summary>${note?"Notu düzenle":"Not ekle"}</summary><div>
      <textarea id="note-${e.id}" data-note="${e.id}" placeholder="Örn. koltuk ayarı 4, sağ omuzda hafif ağrı">${esc(note)}</textarea>
      <p class="note">Not bu harekete kalıcı olarak eklenir ve her antrenmanda görünür.</p></div>
    </details>
  </article>`;
}
function updatePlates(eid){
  const s=session(view,date),k=plateTarget((s.ex||{})[eid],lastFor(eid,date));
  const el=document.getElementById("pl-"+eid);if(el)el.innerHTML=platesHTML(k);
  const w=document.getElementById("wu-"+eid);if(w)w.innerHTML=warmHTML(k);
}
function autoStart(s){if(!s.start&&date===today()){s.start=Date.now();const b=document.getElementById("sessbar");if(b)b.innerHTML=sessBarHTML(s);syncWake()}}
function findEx(s,base){return dayExercises({...s,day:view}).find(z=>z.id===base)}

/* ---------- daily (food, water, sleep, steps) ---------- */
function renderDaily(){
  const t=dayTotals(dayDate),pMax=PROT[1]*1.15,kMax=KCAL[1]*1.2;
  const pTxt=t.p>=PROT[0]?"Protein hedefi tamam! +20 XP":`Hedefe ${fmtN(PROT[0]-t.p)} g kaldı`;
  const kTxt=t.k<KCAL[0]?`${fmtN(KCAL[0]-t.k)} kcal daha yiyebilirsin`:t.k<=KCAL[1]?"Kalori aralığındasın":`Aralığın ${fmtN(t.k-KCAL[1])} kcal üstündesin`;
  const days=[];for(let i=6;i>=0;i--){const d=addDays(today(),-i);days.push({d,p:dayTotals(d).p})}
  let streak=0;for(let i=0;i<120;i++){const p=dayTotals(addDays(today(),-i)).p;if(p>=PROT[0])streak++;else if(i>0)break}
  const W=560,H=150,L=34,R=10,T=12,B=24,mx=Math.max(PROT[1]*1.2,...days.map(d=>d.p));
  const y=v=>T+(1-v/mx)*(H-T-B),bw=(W-L-R)/7;
  const chart=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Son 7 gün protein">
    <rect x="${L}" y="${y(PROT[1])}" width="${W-L-R}" height="${y(PROT[0])-y(PROT[1])}" fill="var(--good)" fill-opacity=".14"/>
    <text x="${L-6}" y="${y(PROT[0])+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${PROT[0]}</text>
    <line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="var(--line)"/>
    ${days.map((d,i)=>{const h=(H-B)-y(d.p);return `<rect x="${L+i*bw+bw*.2}" y="${y(d.p)}" width="${bw*.6}" height="${Math.max(0,h)}" rx="4" fill="${d.p>=PROT[0]?"var(--good)":"var(--accent)"}"/><text x="${L+i*bw+bw/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--muted)">${fmt(d.d,{weekday:"short"})}</text>${d.p?`<text x="${L+i*bw+bw/2}" y="${y(d.p)-4}" text-anchor="middle" font-size="10" fill="var(--ink)" font-family="var(--f-mono)">${fmtN(d.p)}</text>`:""}`}).join("")}
  </svg>`;
  const cups=Array.from({length:WATER_GOAL},(_,i)=>`<i class="${i<t.water?"on":""}"></i>`).join("");
  main.innerHTML=`
  <section class="card">
    <div class="row" style="justify-content:space-between"><h2>Günlük</h2><input type="date" id="dDate" value="${dayDate}" aria-label="Gün"></div>
    <div class="habits">
      <div class="habit${t.water>=WATER_GOAL?" ok":""}"><span class="k">Su</span><span class="v">${fmtKg(t.water*0.25)} L</span><div class="cups" aria-hidden="true">${cups}</div>
        <div class="stepper"><button type="button" data-water="-1" aria-label="Bir bardak çıkar">−</button><button type="button" data-water="1" aria-label="Bir bardak su ekle">+</button></div></div>
      <div class="habit${t.sleep>=SLEEP_GOAL?" ok":""}"><span class="k">Uyku (saat)</span><span class="v">${t.sleep!=null?fmtKg(t.sleep):"–"}</span><input type="number" id="hSleep" data-habit="sleep" inputmode="decimal" min="0" max="16" step="0.5" value="${t.sleep??""}" aria-label="Uyku saati"></div>
      <div class="habit${t.steps>=STEP_GOAL?" ok":""}"><span class="k">Adım</span><span class="v">${t.steps!=null?fmtN(t.steps):"–"}</span><input type="number" id="hSteps" data-habit="steps" inputmode="numeric" min="0" step="100" value="${t.steps??""}" aria-label="Adım sayısı"></div>
    </div>
    <p class="note">Hedefler: ${WATER_GOAL} bardak (3 L) su, ${SLEEP_GOAL}+ saat uyku, ${fmtN(STEP_GOAL)}+ adım. Her biri gün içinde XP kazandırır.</p>
  </section>
  <section class="card">
    <h3>Beslenme</h3>
    <div class="macro"><div class="top"><span><span class="big">${fmtN(t.p)}</span> <span class="of">/ ${PROT[0]}–${PROT[1]} g protein</span></span><span class="note">${pTxt}</span></div>
      <div class="bar"><span class="tgt" style="left:${PROT[0]/pMax*100}%;width:${(PROT[1]-PROT[0])/pMax*100}%"></span><i class="prot" style="width:${Math.min(100,t.p/pMax*100)}%"></i></div></div>
    <div class="macro"><div class="top"><span><span class="big">${fmtN(t.k)}</span> <span class="of">/ ${fmtN(KCAL[0])}–${fmtN(KCAL[1])} kcal</span></span><span class="note">${kTxt}</span></div>
      <div class="bar"><span class="tgt" style="left:${KCAL[0]/kMax*100}%;width:${(KCAL[1]-KCAL[0])/kMax*100}%"></span><i class="${t.k>KCAL[1]?"over":""}" style="width:${Math.min(100,t.k/kMax*100)}%"></i></div></div>
    <div class="quick">
      <button class="tbtn" type="button" data-quick="p:10">+10 g protein</button><button class="tbtn" type="button" data-quick="p:20">+20 g protein</button><button class="tbtn" type="button" data-quick="p:30">+30 g protein</button>
      <button class="tbtn" type="button" data-quick="k:100">+100 kcal</button><button class="tbtn" type="button" data-quick="k:250">+250 kcal</button><button class="tbtn" type="button" data-quick="k:500">+500 kcal</button>
    </div>
  </section>
  <section class="card">
    <h3>Hızlı ekle</h3>
    <div class="foods">${FOODS.map((f,i)=>`<button class="food" type="button" data-food="${i}">${esc(f[0])}<small>${f[1]} g protein · ${f[2]} kcal</small></button>`).join("")}</div>
    <p class="note">Değerler yaklaşık. Paketli ürünlerde etiketteki değeri aşağıdan elle gir.</p>
    <div class="formgrid">
      <label class="wide">Yiyecek<input type="text" id="fLabel" placeholder="Örn. tavuk dürüm"></label>
      <label>Protein (g)<input type="number" id="fP" inputmode="decimal" min="0" step="1"></label>
      <label>Kalori (kcal)<input type="number" id="fK" inputmode="numeric" min="0" step="10"></label>
      <button class="btn" type="button" id="fAdd">Ekle</button>
    </div>
    <p class="note" id="fMsg"></p>
  </section>
  <section class="card">
    <h3>${dayDate===today()?"Bugün yediklerin":fmt(dayDate)}</h3>
    <div class="list">${t.items.length?t.items.slice().reverse().map(i=>`<div class="li"><div><div class="d">${esc(i.l)}</div><div class="s">${fmtN(i.p||0)} g protein · ${fmtN(i.k||0)} kcal</div></div><button class="x" type="button" data-fdel="${i.id}" aria-label="${esc(i.l)} sil">×</button></div>`).join(""):'<p class="empty">Henüz bir şey eklemedin. Yukarıdaki butonlarla ya da hazır listeden ekle.</p>'}</div>
  </section>
  <section class="card">
    <h3>Son 7 gün protein</h3>
    <div class="chart">${chart}</div>
    <p class="note">${streak?`<b>${streak} gündür</b> protein hedefini tutturuyorsun.`:"Protein hedefini tutturduğun her gün +20 XP kazanırsın."} Yeşil bant ${PROT[0]}–${PROT[1]} g hedef aralığı.</p>
  </section>`;
}
function addFood(l,p,k){
  const before=dayTotals(dayDate).p,d=ensureDaily(dayDate);
  d.items.push({id:newId(),l,p:p||0,k:k||0});
  queueSave("n_"+dayDate);render();
  if(before<PROT[0]&&dayTotals(dayDate).p>=PROT[0])toast("Protein hedefi tamam!","+20 XP · kasların teşekkür ediyor");
}

/* ---------- weight & measurements ---------- */
function renderWeight(){
  const ws=weights(),cur=ws.length?ws[ws.length-1].kg:START,lost=Math.max(0,START-cur);
  const pct=Math.max(0,Math.min(100,(START-cur)/((START-GOAL)||1)*100)),fc=forecast(ws);
  const recent=ws.slice(-7),avg=recent.length?recent.reduce((a,b)=>a+b.kg,0)/recent.length:null;
  let fcHTML;
  if(!fc)fcHTML=`<div class="fc"><span>Tahmin için son 4 haftada en az 1 hafta arayla 3 tartı gerekiyor.</span></div>`;
  else if(fc.done)fcHTML=`<div class="fc"><b>Hedefe ulaştın!</b><span>${fmtKg(GOAL)} kg'ın altındasın. Şimdi kiloyu korumaya odaklan; Ayarlar'dan yeni bir hedef de koyabilirsin.</span></div>`;
  else if(fc.eta)fcHTML=`<div class="fc"><span>Bu tempoyla ${fmtKg(GOAL)} kg'a tahmini varış</span><b>${fmt(fc.eta,{day:"numeric",month:"long",year:"numeric"})}</b><span>Haftalık tempo: ${fmtKg(fc.weekly)} kg · yaklaşık ${Math.ceil(fc.days/7)} hafta</span></div>`;
  else fcHTML=`<div class="fc"><b>Son haftalarda düşüş yok</b><span>Haftalık değişim: ${fc.weekly>=0?"+":""}${fmtKg(fc.weekly)} kg. Günlük kaloriyi 150–200 kcal azaltmayı dene.</span></div>`;
  if(fc&&fc.tooFast)fcHTML+=`<div class="fc bad"><b>Fazla hızlı: haftada ${fmtKg(-fc.weekly)} kg</b><span>Sağlıklı tempo haftada 0,5–1 kg. Daha hızlısı kas kaybına ve yorgunluğa yol açar. Günlük 150–200 kcal daha ye ve proteini ${PROT[0]} g'ın üstünde tut.</span></div>`;
  const ms=meas(),first=ms[0],lastM=ms[ms.length-1];
  const photos=ms.filter(m=>m.photo||m.photoData),p0=photos[0],p1=photos[photos.length-1];
  const rowsM=MEAS.map(([k,l])=>{const a=ms.find(m=>m[k]!=null),b=[...ms].reverse().find(m=>m[k]!=null);if(!a)return "";const d=b[k]-a[k];return `<tr><td>${l}</td><td>${fmtKg(a[k])}</td><td>${fmtKg(b[k])}</td><td class="${d<0?"neg":d>0?"pos":""}">${d>0?"+":""}${fmtKg(d)}</td></tr>`}).join("");
  const ph=m=>`<div class="ph" data-photo="m_${m.date}" data-alt="${short(m.date)} tarihli fotoğraf">Yükleniyor…</div>`;
  main.innerHTML=`
  <section class="card">
    <h2>Kilo takibi</h2>
    <div class="stats">
      <div class="stat"><div class="k">Şu an</div><div class="v">${fmtKg(cur)}</div></div>
      <div class="stat"><div class="k">Verilen</div><div class="v">${fmtKg(lost)}</div></div>
      <div class="stat"><div class="k">Kalan</div><div class="v">${fmtKg(Math.max(0,cur-GOAL))}</div></div>
    </div>
    <div class="bar" aria-label="Hedefe ilerleme %${Math.round(pct)}"><i style="width:${pct}%"></i></div>
    <div class="miles"><span class="note">Ara hedefler</span>${milestones().map(m=>`<span class="mile${ws.length&&cur<=m?" on":""}">${fmtKg(m)}</span>`).join("")}</div>
    ${fcHTML}
    <div class="row">
      <input type="date" id="wDate" value="${today()}" aria-label="Tartı tarihi">
      <input type="number" id="wKg" inputmode="decimal" step="0.1" placeholder="kg" style="width:7rem" aria-label="Kilo">
      <button type="button" class="btn" id="wSave">Kaydet</button>
    </div>
    <p class="note" id="wMsg">Haftada 3–4 sabah, aç karnına ve tuvaletten sonra tartıl.${avg!=null?` Son ${recent.length} tartının ortalaması: <b>${fmtKg(avg)} kg</b>.`:""}</p>
    <div class="chart">${weightChart(ws,fc)}</div>
  </section>
  <section class="card">
    <h3>Ölçüler ve fotoğraf</h3>
    <p class="note">Ayda bir, sabah aynı saatte ölç. Bel ölçüsünü göbek hizasından al. Kilo yavaş düşerken bel genelde düşmeye devam eder.</p>
    <div class="formgrid">
      <label>Tarih<input type="date" id="mDate" value="${today()}"></label>
      ${MEAS.map(([k,l])=>`<label>${l} (cm)<input type="number" id="m-${k}" inputmode="decimal" step="0.5" min="0"></label>`).join("")}
      <label class="wide">Fotoğraf (isteğe bağlı)<input type="file" id="mPhoto" accept="image/*"></label>
      <button class="btn" type="button" id="mSave">Ölçüyü kaydet</button>
    </div>
    <p class="note" id="mMsg">${SYNC&&user?"Fotoğraflar hesabına özel, gizli bir klasörde saklanır.":"Fotoğraflar bu cihazda küçültülerek saklanır."}</p>
    ${rowsM?`<div class="tablewrap"><table class="mt"><thead><tr><th>cm</th><th>İlk (${short(first.date)})</th><th>Son (${short(lastM.date)})</th><th>Fark</th></tr></thead><tbody>${rowsM}</tbody></table></div>`:""}
    ${p0?`<div class="photos"><figure>${ph(p0)}<figcaption>Önce · ${short(p0.date)}</figcaption></figure>${p1!==p0?`<figure>${ph(p1)}<figcaption>Şimdi · ${short(p1.date)}</figcaption></figure>`:`<figure><div class="ph">Bir sonraki fotoğraf burada</div><figcaption>Şimdi</figcaption></figure>`}</div>`:""}
    ${ms.length?`<div class="list">${ms.slice().reverse().map(m=>`<div class="li"><div><div class="d">${fmt(m.date,{day:"numeric",month:"long",year:"numeric"})}</div><div class="s">${MEAS.filter(([k])=>m[k]!=null).map(([k,l])=>`${l} ${fmtKg(m[k])}`).join(" · ")||"sadece fotoğraf"}${m.photo||m.photoData?" · fotoğraf":""}</div></div><button class="x${confirmDel==="m_"+m.date?" sure":""}" type="button" data-mdel="m_${m.date}" aria-label="${short(m.date)} ölçüsünü sil">${confirmDel==="m_"+m.date?"Silinsin mi?":"×"}</button></div>`).join("")}</div>`:'<p class="empty">Henüz ölçü yok. İlk ölçünü bugün al, bir ay sonra farkı gör.</p>'}
  </section>
  <section class="card">
    <h3>Tartı kayıtları</h3>
    <div class="list">${ws.length?ws.slice().reverse().map(w=>`<div class="li"><div><div class="d">${fmtKg(w.kg)} kg</div><div class="s">${fmt(w.date)}</div></div><button class="x" type="button" data-del="w_${w.date}" aria-label="${short(w.date)} kaydını sil">×</button></div>`).join(""):'<p class="empty">Henüz tartı kaydı yok. Yukarıdan bugünkü kilonu girerek başla.</p>'}</div>
  </section>`;
}
function weightChart(ws,fc){
  const W=600,H=210,L=40,R=14,T=14,B=28,kgs=ws.map(p=>p.kg);
  const lo=Math.floor(Math.min(GOAL-1,...kgs)),hi=Math.ceil(Math.max(START+1,...kgs));
  const t0=ws.length?toDate(ws[0].date).getTime():0;
  let t1=ws.length?toDate(ws[ws.length-1].date).getTime():1;
  const proj=fc&&fc.eta?toDate(fc.eta).getTime():null;if(proj)t1=proj;
  const x=t=>(ws.length<2&&!proj)?L+(W-L-R)/2:L+(t-t0)/((t1-t0)||1)*(W-L-R);
  const y=k=>T+(hi-k)/((hi-lo)||1)*(H-T-B);
  const step=Math.max(1,Math.ceil((hi-lo)/6));
  let g="";
  for(let k=lo;k<=hi;k+=step)g+=`<line x1="${L}" x2="${W-R}" y1="${y(k)}" y2="${y(k)}" stroke="var(--line)"/><text x="${L-8}" y="${y(k)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${k}</text>`;
  g+=`<line x1="${L}" x2="${W-R}" y1="${y(GOAL)}" y2="${y(GOAL)}" stroke="var(--good)" stroke-width="1.5" stroke-dasharray="6 5"/><text x="${W-R}" y="${y(GOAL)-6}" text-anchor="end" font-size="12" fill="var(--good)" font-weight="600">Hedef ${fmtKg(GOAL)}</text>`;
  if(!ws.length)return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kilo grafiği, henüz veri yok">${g}<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="13" fill="var(--muted)">İlk tartını girince grafik burada çizilir</text></svg>`;
  const line=ws.map(p=>`${x(toDate(p.date).getTime()).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");
  const lp=ws[ws.length-1],lx=x(toDate(lp.date).getTime()),ly=y(lp.kg);
  const area=ws.length>1?`<polygon points="${x(t0)},${H-B} ${line} ${lx},${H-B}" fill="var(--accent)" fill-opacity=".1"/>`:"";
  const pj=proj?`<line x1="${lx}" y1="${ly}" x2="${x(proj)}" y2="${y(GOAL)}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 5" stroke-linecap="round"/><circle cx="${x(proj)}" cy="${y(GOAL)}" r="4" fill="var(--good)"/>`:"";
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kilo grafiği">${g}${area}${pj}
    <polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${ws.map(p=>`<circle cx="${x(toDate(p.date).getTime())}" cy="${y(p.kg)}" r="2.5" fill="var(--accent)"/>`).join("")}
    <circle cx="${lx}" cy="${ly}" r="5.5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.5"/>
    <text x="${L}" y="${H-8}" font-size="11" fill="var(--muted)">${short(ws[0].date)}</text>
    ${(ws.length>1||proj)?`<text x="${W-R}" y="${H-8}" text-anchor="end" font-size="11" fill="var(--muted)">${proj?short(fc.eta)+" (tahmin)":short(lp.date)}</text>`:""}
  </svg>`;
}
async function saveMeas(){
  const msg=document.getElementById("mMsg"),btn=document.getElementById("mSave"),dt=document.getElementById("mDate").value||today();
  const vals={};MEAS.forEach(([k])=>{const v=num(document.getElementById("m-"+k).value);if(v!=null&&v>0)vals[k]=v});
  const fileEl=document.getElementById("mPhoto"),file=fileEl&&fileEl.files&&fileEl.files[0];
  if(!Object.keys(vals).length&&!file){msg.textContent="En az bir ölçü ya da fotoğraf gir.";return}
  const id="m_"+dt,old=docs.get(id)||{};let ph={};
  if(file){
    msg.textContent="Fotoğraf hazırlanıyor…";btn.disabled=true;
    try{ph=await storePhoto(file)}
    catch(e){console.warn(e);msg.textContent=navigator.onLine?"Fotoğraf yüklenemedi. Ölçüler kaydedilmedi, tekrar dene.":"Fotoğraf yüklemek için internet gerekiyor. Ölçüleri fotoğrafsız kaydedebilirsin.";btn.disabled=false;return}
  }
  const next={...old,...vals,kind:"meas",date:dt};
  if(ph.photo){next.photo=ph.photo;delete next.photoData}
  if(ph.photoData){next.photoData=ph.photoData;delete next.photo}
  docs.set(id,next);queueSave(id);
  if(file&&old.photo&&old.photo!==next.photo)dropPhoto(old);
  render();toast("Ölçü kaydedildi",Object.keys(vals).length?"Bir ay sonra farkı gör":"Fotoğraf eklendi");
}

/* ---------- progress ---------- */
function medal(color){return `<svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="var(${color})"/><circle cx="17" cy="17" r="11" fill="none" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="1.5"/><circle cx="17" cy="17" r="4.5" fill="var(--surface)"/></svg>`}
function badgeList(st){
  const ws=weights(),cur=ws.length?ws[ws.length-1].kg:START,lost=START-cur;
  return [
    ["İlk adım","İlk antrenman",st.workouts>=1,"--band-red"],
    ["Isındık","10 antrenman",st.workouts>=10,"--band-blue"],
    ["Düzenli","25 antrenman",st.workouts>=25,"--band-green"],
    ["Demir irade","50 antrenman",st.workouts>=50,"--band-yellow"],
    ["Yüzler kulübü","100 antrenman",st.workouts>=100,"--band-red"],
    ["Tam hafta","Bir haftada 5 antrenman",st.fullWeek,"--band-red"],
    ["Seri","3 hafta üst üste 4+",st.bestStreak>=3,"--band-blue"],
    ["İlk rekor","İlk kişisel rekor",st.prs>=1,"--band-yellow"],
    ["Rekortmen","10 kişisel rekor",st.prs>=10,"--band-yellow"],
    ["1 ton","1.000 kg toplam",st.ton>=1000,"--band-steel"],
    ["10 ton","10.000 kg toplam",st.ton>=10000,"--band-steel"],
    ["100 ton","100.000 kg toplam",st.ton>=100000,"--band-green"],
    ["Protein ustası","7 gün protein hedefi",st.protDays>=7,"--band-blue"],
    ["Kardiyocu","10 kez 15+ dk kardiyo",st.cardioCount>=10,"--band-red"],
    ["Adımcı","7 gün 8.000+ adım",st.stepDays>=7,"--band-green"],
    ["Akıllı dinlenme","İlk deload haftası",(settings().deloads||[]).length>=1,"--band-green"],
    ["Ay şampiyonu","Bir ayın 4 hedefini bitir",monthChampion(),"--band-yellow"],
    ["−2 kg","İlk 2 kilo gitti",ws.length>0&&lost>=2,"--band-green"],
    ["−5 kg","Büyük adım",ws.length>0&&lost>=5,"--band-blue"],
    [fmtKg(GOAL)+"!","Hedefe ulaştın",ws.length>0&&cur<=GOAL,"--band-red"]
  ];
}
function weekAgg(st,k){
  const w=st.wk[k]||{n:0,sets:0,vol:0,prs:0,xp:0,min:0,cardio:0};
  const end=new Date(k);end.setDate(end.getDate()+7);const a=iso(new Date(k)),b=iso(end);
  const fd=[...docs.values()].filter(d=>d.kind==="food"&&d.date>=a&&d.date<b).map(d=>dayTotals(d.date));
  const avgOf=f=>{const v=fd.map(f).filter(x=>x!=null&&x>0);return v.length?v.reduce((s,x)=>s+x,0)/v.length:null};
  const ws=weights().filter(x=>x.date>=a&&x.date<b);const wAvg=ws.length?ws.reduce((s,x)=>s+x.kg,0)/ws.length:null;
  return {...w,prot:avgOf(t=>t.items.length?t.p:null),steps:avgOf(t=>t.steps),sleep:avgOf(t=>t.sleep),wAvg,from:a,to:addDays(b,-1)};
}
function renderProgress(st){
  const mon=weekStart(new Date()),lastMon=new Date(mon);lastMon.setDate(lastMon.getDate()-7);
  const A1=weekAgg(st,mon.getTime()),A0=weekAgg(st,lastMon.getTime());
  const cmp=(a,b,f,better="up")=>{if(b==null||a==null)return "";const d=a-b;if(Math.abs(d)<1e-9)return `<em>geçen hafta ile aynı</em>`;const good=better==="up"?d>0:d<0;return `<em class="${good?"up":"down"}">${d>0?"▲":"▼"} geçen hafta ${f(b)}</em>`};
  const wChange=A1.wAvg!=null&&A0.wAvg!=null?A1.wAvg-A0.wAvg:null;
  const now=new Date(),ch=challenges(now.getFullYear(),now.getMonth());
  const daysLeft=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()-now.getDate();
  const bl=badgeList(st),got=bl.filter(b=>b[2]).length;
  const ss=sessions().map(s=>({s,o:okSets(s)})).filter(x=>x.o.n>0||cardioMin(x.s)>0||Object.values(x.s.ex||{}).some(a=>(a||[]).some(r=>r&&(r.kg!=null||r.r!=null)))).reverse();
  main.innerHTML=`
  <section class="card">
    <div><p class="tt" style="color:var(--warn)">Haftalık özet</p><h2>${short(A1.from)} – ${short(A1.to)}</h2></div>
    <div class="sumgrid">
      <div><b>${A1.n}/5</b><span>antrenman</span>${cmp(A1.n,A0.n,v=>v)}</div>
      <div><b>${A1.sets}</b><span>set</span>${cmp(A1.sets,A0.sets,v=>v)}</div>
      <div><b>${fmtTon(A1.vol)}</b><span>hacim</span>${cmp(A1.vol,A0.vol,fmtTon)}</div>
      <div><b>${A1.prs}</b><span>yeni rekor</span>${cmp(A1.prs,A0.prs,v=>v)}</div>
      <div><b>${fmtN(A1.min)} dk</b><span>salonda</span>${cmp(A1.min,A0.min,v=>fmtN(v)+" dk")}</div>
      <div><b>${fmtN(A1.cardio)} dk</b><span>kardiyo</span>${cmp(A1.cardio,A0.cardio,v=>fmtN(v)+" dk")}</div>
      <div><b>+${fmtN(A1.xp)}</b><span>XP</span>${cmp(A1.xp,A0.xp,fmtN)}</div>
      <div><b>${A1.prot!=null?fmtN(A1.prot)+" g":"–"}</b><span>ort. protein / gün</span>${cmp(A1.prot,A0.prot,v=>fmtN(v)+" g")}</div>
      <div><b>${A1.steps!=null?fmtN(A1.steps):"–"}</b><span>ort. adım / gün</span>${cmp(A1.steps,A0.steps,fmtN)}</div>
      <div><b>${A1.sleep!=null?fmtKg(A1.sleep)+" sa":"–"}</b><span>ort. uyku</span>${cmp(A1.sleep,A0.sleep,v=>fmtKg(v)+" sa")}</div>
      <div><b>${wChange!=null?(wChange>0?"+":"")+fmtKg(wChange)+" kg":"–"}</b><span>kilo (haftalık ort.)</span>${wChange!=null?`<em class="${wChange<0?"up":"down"}">${wChange<0?"doğru yöndesin":"bu hafta artış"}</em>`:""}</div>
      <div><b>${st.streak}</b><span>hafta seri</span></div>
    </div>
  </section>
  <section class="card">
    <div class="row" style="justify-content:space-between"><h2>${now.toLocaleDateString("tr-TR",{month:"long"})} meydan okumaları</h2><span class="progress">${daysLeft} gün kaldı</span></div>
    <div class="chal">${ch.list.map(c=>`<div class="ch${c.p>=1?" done":""}"><div class="top"><b>${esc(c.t)}</b><span class="progress">${esc(c.txt)}${c.p>=1?" · tamam":""}</span></div><div class="bar"><i style="width:${c.p*100}%"></i></div></div>`).join("")}</div>
    <p class="note">${ch.all?"<b>Bu ayın tüm hedeflerini bitirdin!</b> Ay şampiyonu rozeti senin.":"Dördünü de bitirirsen Ay şampiyonu rozetini kazanırsın. Kaldırış hedefi her ay değişir."}</p>
  </section>
  <section class="card">
    <h2>Rozetler <span class="progress">${got} / ${bl.length}</span></h2>
    <div class="badges">${bl.map(b=>`<div class="badge${b[2]?"":" locked"}">${medal(b[3])}<div><b>${esc(b[0])}</b><span>${esc(b[1])}</span></div></div>`).join("")}</div>
  </section>
  <section class="card">
    <h2>Geçmiş antrenmanlar</h2>
    <div class="list">${ss.length?ss.map(({s,o})=>`<div class="li"><button class="open" type="button" data-open="${s.day}|${s.date}"><span class="d">${DAYMAP[s.day].name} · ${fmt(s.date)}</span><span class="s">${o.n} set · ${fmtN(o.vol)} kg hacim${minutes(s)?` · ${Math.round(minutes(s))} dk`:""}${cardioMin(s)?` · ${fmtN(cardioMin(s))} dk kardiyo`:""}${isComplete(s)?" · tamamlandı":""}</span></button><span aria-hidden="true" style="width:12px;height:12px;border-radius:50%;flex:0 0 auto;background:var(${BAND[s.day][0]})"></span></div>`).join(""):'<p class="empty">Henüz kayıtlı antrenman yok. Bir gün sekmesinde set girip ✓ işaretleyince burada listelenir.</p>'}</div>
  </section>`;
}

/* ---------- settings ---------- */
function renderSettings(){
  const p=profile(),t=targets(),localOld=SYNC&&user?lsGet("ppl:docs:local",{}):{},localN=Object.keys(localOld).length;
  const srcTxt=t.src==="calc"?`Boy, yaş ve hareketliliğine göre günlük harcaman yaklaşık <b>${fmtN(t.tdee)} kcal</b>. Kilo vermek için 500 kcal altı hedeflenir.`:t.src==="manual"?"Kalori hedefini elle girdin.":"Boy ve yaşını girmediğin için genel bir tahmin kullanılıyor.";
  main.innerHTML=`
  <section class="card">
    <h2>Hesap</h2>
    ${SYNC?(user?`<p class="note">Giriş yapıldı: <b>${esc(user.email||"")}</b>. Kayıtların bu hesapla her cihazda eşitlenir.</p><div class="row"><button class="btn ghost" type="button" data-act="logout">Çıkış yap</button><button class="btn ghost" type="button" data-act="resync">Şimdi eşitle</button></div>`:`<p class="note">Giriş yapılmadı.</p>`)
      :`<p class="note">Eşitleme kapalı: kayıtların sadece bu cihazda tutuluyor. Her cihazda görmek için config.js dosyasına Supabase bilgilerini gir.</p>`}
    ${localN?`<div class="banner info"><p>Bu cihazda giriş yapmadan önce girilmiş <b>${localN} kayıt</b> var. Hesabına aktarmak ister misin?</p><button class="btn" type="button" data-act="migratelocal">Hesabıma aktar</button></div>`:""}
  </section>
  <section class="card">
    <h2>Profil ve hedefler</h2>
    <div class="formgrid">
      <label>Başlangıç kilosu<input type="number" id="pStart" inputmode="decimal" step="0.1" value="${p.start??""}"></label>
      <label>Hedef kilo<input type="number" id="pGoal" inputmode="decimal" step="0.1" value="${p.goal??""}"></label>
      <label>Boy (cm)<input type="number" id="pHeight" inputmode="numeric" step="1" value="${p.height??""}"></label>
      <label>Yaş<input type="number" id="pAge" inputmode="numeric" step="1" value="${p.age??""}"></label>
      <label>Cinsiyet<select id="pSex"><option value="m"${p.sex!=="f"?" selected":""}>Erkek</option><option value="f"${p.sex==="f"?" selected":""}>Kadın</option></select></label>
      <label class="wide">Hareketlilik<select id="pAct">${ACT.map(([v,l])=>`<option value="${v}"${+p.activity===v?" selected":""}>${l}</option>`).join("")}</select></label>
      <label>Protein (g / kg)<input type="number" id="pPkg" inputmode="decimal" step="0.1" min="1.2" max="2.6" value="${p.protPerKg??1.9}"></label>
      <label>Kalori (elle, isteğe bağlı)<input type="number" id="pKcal" inputmode="numeric" step="50" placeholder="otomatik" value="${p.kcal??""}"></label>
      <label>Protein (elle, isteğe bağlı)<input type="number" id="pProt" inputmode="numeric" step="5" placeholder="otomatik" value="${p.prot??""}"></label>
      <button class="btn" type="button" id="pSave">Kaydet</button>
    </div>
    <div class="kv"><div><b>${fmtN(KCAL[0])}–${fmtN(KCAL[1])}</b><span>kcal / gün</span></div><div><b>${PROT[0]}–${PROT[1]} g</b><span>protein / gün</span></div><div><b>${fmtKg(t.cur)} kg</b><span>hesapta kullanılan kilo</span></div></div>
    <p class="note">${srcTxt} Kilon düştükçe hedefler kendiliğinden güncellenir. Elle değer girersen otomatik hesap yerine o kullanılır.</p>
  </section>
  <section class="card">
    <h2>Salonda</h2>
    <label class="check"><input type="checkbox" id="prefWake"${prefs.wake?" checked":""}> Antrenman sürerken ekranı açık tut</label>
    <label class="check"><input type="checkbox" id="prefSound"${prefs.sound?" checked":""}> Dinlenme bitince sesli uyar</label>
    <p class="note">Telefonu kilitlersen sayaç kaldığı yerden doğru devam eder, ama ses ve titreşim ancak sayfa açıkken çalışır.</p>
  </section>
  <section class="card">
    <h2>Yedek</h2>
    <p class="note">Tüm kayıtlarını tek dosya olarak indir. Claude'daki eski PPL Defteri sayfasından indirdiğin yedeği de buradan yükleyebilirsin.</p>
    <div class="row"><button class="btn" type="button" data-act="export">Yedeği indir</button><label class="btn ghost" for="impFile" style="cursor:pointer">Yedekten geri yükle</label><input type="file" id="impFile" accept="application/json,.json" hidden></div>
    <p class="note" id="impMsg"></p>
  </section>
  <section class="card">
    <h2>Telefona uygulama gibi ekle</h2>
    <p class="note"><b>iPhone (Safari):</b> Paylaş düğmesi → "Ana Ekrana Ekle". <b>Android (Chrome):</b> sağ üstteki ⋮ menüsü → "Ana ekrana ekle" ya da "Uygulamayı yükle". Böylece tam ekran açılır ve internet zayıfken de çalışır.</p>
    <p class="note">Sürüm ${APP_VERSION}</p>
  </section>`;
}
function saveProfile(){
  const g=id=>num(document.getElementById(id).value);
  const st=ensureSettings(),p={...profile()};
  p.start=g("pStart")||95;p.goal=g("pGoal")||85;p.height=g("pHeight");p.age=g("pAge");
  p.sex=document.getElementById("pSex").value;p.activity=+document.getElementById("pAct").value;
  p.protPerKg=Math.min(2.6,Math.max(1.2,g("pPkg")||1.9));p.kcal=g("pKcal");p.prot=g("pProt");
  if(p.goal>=p.start){toast("Kontrol et","Hedef kilo başlangıçtan düşük olmalı");return}
  st.profile=p;queueSave("settings");render();toast("Kaydedildi",`Yeni hedef: ${fmtN(KCAL[0])}–${fmtN(KCAL[1])} kcal, ${PROT[0]}–${PROT[1]} g protein`);
}
function exportData(){
  const payload={app:"ppl-defteri",version:1,exported:new Date().toISOString(),docs:Object.fromEntries(docs)};
  const blob=new Blob([JSON.stringify(payload)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`ppl-yedek-${today()}.json`;
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);
  toast("Yedek indirildi",`${docs.size} kayıt`);
}
async function importData(file){
  const msg=document.getElementById("impMsg");
  try{
    const obj=JSON.parse(await file.text());
    const src=obj&&obj.docs&&typeof obj.docs==="object"?obj.docs:null;
    if(!src){msg.textContent="Bu dosya PPL Defteri yedeği değil.";return}
    let n=0,skippedPhotos=0;
    Object.entries(src).forEach(([id,d])=>{
      if(!d||typeof d!=="object"||!d.kind||typeof id!=="string")return;
      const copy=JSON.parse(JSON.stringify(d));
      if(copy.kind==="meas"&&copy.photo&&!String(copy.photo).includes("/")){delete copy.photo;skippedPhotos++}
      docs.set(id,copy);outbox[id]=Date.now();n++;
    });
    persist();flush();render();
    msg.textContent=`${n} kayıt yüklendi.${skippedPhotos?` ${skippedPhotos} fotoğraf eski sayfada kaldı; istersen yeniden ekleyebilirsin.`:""}`;
    toast("Yedek yüklendi",`${n} kayıt`);
  }catch(e){msg.textContent="Dosya okunamadı. Doğru yedek dosyasını seçtiğinden emin ol."}
}

/* ---------- events ---------- */
main.addEventListener("input",e=>{
  const t=e.target;
  if(t.dataset.note){
    if(!docs.has("notes"))docs.set("notes",{kind:"notes",map:{}});
    const n=docs.get("notes");n.map=n.map||{};if(t.value.trim())n.map[t.dataset.note]=t.value;else delete n.map[t.dataset.note];
    queueSave("notes");return;
  }
  if(t.dataset.cardio){const s=ensureSession(view,date);s.cardio=Object.assign({},s.cardio);s.cardio[t.dataset.cardio]=num(t.value);queueSave(sid(view,date));return}
  if(t.dataset.habit){const d=ensureDaily(dayDate);d[t.dataset.habit]=num(t.value);queueSave("n_"+dayDate);return}
  if(!t.dataset.ex)return;
  const s=ensureSession(view,date),arr=s.ex[t.dataset.ex]=s.ex[t.dataset.ex]||[],i=+t.dataset.i;
  for(let k=0;k<=i;k++)if(!arr[k])arr[k]={};
  arr[i]=Object.assign({},arr[i]);arr[i][t.dataset.f]=num(t.value);
  autoStart(s);queueSave(sid(view,date));
  if(t.dataset.f==="kg")updatePlates(t.dataset.ex);
});
main.addEventListener("change",e=>{
  const t=e.target;
  if(t.id==="dateIn"&&t.value){date=t.value;render();return}
  if(t.id==="dDate"&&t.value){dayDate=t.value;render();return}
  if(t.dataset.habit||t.dataset.cardio){render();return}
  if(t.id==="impFile"&&t.files&&t.files[0]){importData(t.files[0]);t.value="";return}
  if(t.id==="prefWake"||t.id==="prefSound"){prefs.wake=document.getElementById("prefWake").checked;prefs.sound=document.getElementById("prefSound").checked;lsSet("ppl:prefs",prefs);syncWake();return}
  if(t.dataset.swap){
    const s=ensureSession(view,date);s.sw=Object.assign({},s.sw);
    if(t.value)s.sw[t.dataset.swap]=t.value;else delete s.sw[t.dataset.swap];
    queueSave(sid(view,date));render();
    const x=DAYMAP[view].ex.find(z=>z.id===t.dataset.swap);
    toast("Hareket değişti",t.value?`${x.alts.find(a=>a.id===t.value).n} yapıyorsun`:"Programdaki harekete döndün");
  }
});
document.addEventListener("click",e=>{
  const act=e.target.closest("[data-act]");
  if(act){doAct(act.dataset.act);return}
  if(!main.contains(e.target))return;
  const tk=e.target.closest("[data-tick]");
  if(tk){onTick(tk.dataset.tick,tk.dataset.base,+tk.dataset.i);return}
  const sa=e.target.closest("[data-setadd],[data-setdel]");
  if(sa){const s=ensureSession(view,date),eid=sa.dataset.setadd||sa.dataset.setdel,x=findEx(s,sa.dataset.base);if(!x)return;
    s.extra=Object.assign({},s.extra);const cur=s.extra[eid]||0;const nx=sa.dataset.setadd?cur+1:Math.max(1-x.s,cur-1);
    if(nx)s.extra[eid]=nx;else delete s.extra[eid];
    if(sa.dataset.setdel&&s.ex[eid]){const T=Math.max(1,x.s+nx);s.ex[eid]=s.ex[eid].slice(0,T)}
    queueSave(sid(view,date));render();return}
  const ch=e.target.closest("[data-chart]");
  if(ch){const id=ch.dataset.chart;openCharts.has(id)?openCharts.delete(id):openCharts.add(id);render();return}
  const cxd=e.target.closest("[data-cxdel]");
  if(cxd){const s=ensureSession(view,date);s.custom=(s.custom||[]).filter(c=>c.id!==cxd.dataset.cxdel);delete s.ex[cxd.dataset.cxdel];queueSave(sid(view,date));render();return}
  if(e.target.id==="cxAdd"){const n=document.getElementById("cxName").value.trim();if(!n)return;const s=ensureSession(view,date);const id="cx_"+slug(n);s.custom=(s.custom||[]).filter(c=>c.id!==id).concat([{id,n}]);queueSave(sid(view,date));render();toast("Hareket eklendi",n);return}
  const cq=e.target.closest("[data-cquick]");
  if(cq){const s=ensureSession(view,date),c=Object.assign({},s.cardio);c.min=+cq.dataset.cquick;if(c.inc==null)c.inc=10;if(c.spd==null)c.spd=5;s.cardio=c;queueSave(sid(view,date));render();toast("Kardiyo eklendi",`${c.min} dk eğimli yürüyüş · +15 XP`);return}
  const wt=e.target.closest("[data-water]");
  if(wt){const d=ensureDaily(dayDate),before=d.water||0;d.water=Math.max(0,before+(+wt.dataset.water));queueSave("n_"+dayDate);render();if(before<WATER_GOAL&&d.water>=WATER_GOAL)toast("Su hedefi tamam!","3 litre · +5 XP");return}
  const del=e.target.closest("[data-del]");
  if(del){docs.delete(del.dataset.del);queueSave(del.dataset.del);render();return}
  const md=e.target.closest("[data-mdel]");
  if(md){const id=md.dataset.mdel;if(confirmDel!==id){confirmDel=id;render();return}
    const m=docs.get(id);confirmDel=null;docs.delete(id);queueSave(id);dropPhoto(m);render();return}
  const fd=e.target.closest("[data-fdel]");
  if(fd){const d=docs.get("n_"+dayDate);if(d){d.items=(d.items||[]).filter(i=>i.id!==fd.dataset.fdel);queueSave("n_"+dayDate);render()}return}
  const fq=e.target.closest("[data-quick]");
  if(fq){const [k,v]=fq.dataset.quick.split(":");addFood(k==="p"?`+${v} g protein`:`+${v} kcal`,k==="p"?+v:0,k==="k"?+v:0);return}
  const ff=e.target.closest("[data-food]");
  if(ff){const f=FOODS[+ff.dataset.food];addFood(f[0],f[1],f[2]);return}
  const op=e.target.closest("[data-open]");
  if(op){const [d,dt]=op.dataset.open.split("|");view=d;date=dt;render();window.scrollTo(0,0);return}
  if(e.target.id==="fAdd"){
    const l=document.getElementById("fLabel").value.trim(),p=num(document.getElementById("fP").value),k=num(document.getElementById("fK").value);
    if(p==null&&k==null){document.getElementById("fMsg").textContent="Protein ya da kalori değeri gir.";return}
    addFood(l||"Elle eklenen",p||0,k||0);return;
  }
  if(e.target.id==="mSave"){saveMeas();return}
  if(e.target.id==="pSave"){saveProfile();return}
  if(e.target.id==="wSave"){
    const kg=num(document.getElementById("wKg").value),dt=document.getElementById("wDate").value||today();
    if(kg==null||kg<30||kg>300){document.getElementById("wMsg").textContent="Geçerli bir kilo gir (ör. 94,6).";return}
    const before=weights(),prevCur=before.length?before[before.length-1].kg:START;
    docs.set("w_"+dt,{kind:"weight",date:dt,kg});queueSave("w_"+dt);render();
    const after=weights(),nowCur=after[after.length-1].kg,hit=milestones().filter(m=>prevCur>m&&nowCur<=m);
    if(hit.length)toast(nowCur<=GOAL?"Hedefe ulaştın!":"Ara hedef!",`${fmtKg(hit[hit.length-1])} kg sınırının altındasın`);
    else if(nowCur<prevCur)toast("Düşüş var",`${fmtKg(prevCur-nowCur)} kg daha hafifsin`);
  }
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")document.getElementById("cele").hidden=true;
  if(e.key==="Enter"&&e.target.id==="cxName")document.getElementById("cxAdd").click();
});
async function doAct(a){
  if(a==="goweight"){view="weight";render();window.scrollTo(0,0);return}
  if(a==="gosettings"){view="settings";render();window.scrollTo(0,0);return}
  if(a==="summary"){view="progress";render();window.scrollTo(0,0);return}
  if(a==="export"){exportData();return}
  if(a==="logout"){if(sb)await sb.auth.signOut();return}
  if(a==="resync"){setStatus("saving","Eşitleniyor…");await flush();await pull();return}
  if(a==="migratelocal"){const old=lsGet("ppl:docs:local",{});let n=0;Object.entries(old).forEach(([id,d])=>{if(!docs.has(id)){docs.set(id,d);outbox[id]=Date.now();n++}});persist();flush();try{localStorage.removeItem("ppl:docs:local");localStorage.removeItem("ppl:out:local")}catch(e){}render();toast("Aktarıldı",`${n} kayıt hesabına eklendi`);return}
  if(a==="deload"){const st=ensureSettings();const k=wkKey(today());if(!st.deloads.includes(k))st.deloads=[...st.deloads,k];queueSave("settings");render();toast("Deload haftası","Hafif çalış, toparlan, daha güçlü dön");return}
  if(a==="undeload"){const st=ensureSettings();st.deloads=st.deloads.filter(k=>k!==wkKey(today()));queueSave("settings");render();return}
  const s=ensureSession(view,date);
  if(a==="sessstart"){s.start=Date.now();delete s.end;queueSave(sid(view,date));render()}
  else if(a==="sessend"){s.end=Date.now();queueSave(sid(view,date));render();toast("Antrenman kaydedildi",`${Math.round(minutes(s))} dakika salondaydın`)}
  else if(a==="sessresume"){delete s.end;queueSave(sid(view,date));render()}
}
function onTick(eid,base,i){
  const s=ensureSession(view,date),x=findEx(s,base);if(!x)return;
  ensureAudio();
  const lvBefore=level(computeStats().xp).n,wasComplete=isComplete(s);
  const arr=s.ex[eid]=s.ex[eid]||[];for(let k=0;k<=i;k++)if(!arr[k])arr[k]={};
  arr[i]=Object.assign({},arr[i]);
  const prev=lastFor(eid,date),pr=prev&&prev.sets[i];
  if(arr[i].kg==null&&pr&&pr.kg!=null)arr[i].kg=pr.kg;
  if(arr[i].r==null&&pr&&pr.r!=null)arr[i].r=pr.r;
  arr[i].ok=!arr[i].ok;
  if(arr[i].ok)autoStart(s);
  const nowComplete=isComplete(s);
  if(!wasComplete&&nowComplete&&s.start&&!s.end)s.end=Date.now();
  queueSave(sid(view,date));render();
  if(!arr[i].ok)return;
  const pb=prevBest(eid,date),others=arr.filter((r,k)=>k!==i&&r&&r.ok&&r.kg).map(r=>r.kg),e=effEx(s,x);
  if(pb!=null&&arr[i].kg&&arr[i].kg>pb&&arr[i].kg>Math.max(0,...others))toast("Yeni rekor!",`${e.n}: ${fmtKg(arr[i].kg)} kg (önceki en iyi ${fmtKg(pb)} kg)`);
  const lv=level(computeStats().xp);if(lv.n>lvBefore)toast("Seviye atladın!",`Seviye ${lv.n}: ${lv.name}`);
  if(!wasComplete&&nowComplete){celebrate(s);return}
  const T=setCount(s,e,x);
  if(i<T-1)startRest(x.rest,`${e.n} · set ${i+2} sırada`);else startRest(x.rest,`${e.n} bitti · sıradaki harekete geç`);
}

/* ---------- toast, celebration, confetti ---------- */
const toastQ=[];let toastBusy=false;
function toast(big,small){toastQ.push([big,small]);if(!toastBusy)nextToast()}
function nextToast(){
  const el=document.getElementById("toast"),t=toastQ.shift();
  if(!t){toastBusy=false;el.hidden=true;return}
  toastBusy=true;el.innerHTML=`<span class="big">${esc(t[0])}</span>${esc(t[1])}`;el.hidden=true;void el.offsetWidth;el.hidden=false;
  setTimeout(nextToast,2800);
}
function celebrate(s){
  stopRest();
  const o=okSets(s),st=computeStats(),pr=Object.keys(st.prMap[sid(s.day,s.date)]||{}).length,xp=o.n*10+50+pr*25,min=minutes(s);
  const c=document.getElementById("cele");
  c.innerHTML=`<div class="cbox" role="dialog" aria-modal="true" aria-labelledby="celeT">
    <p class="tt">${DAYMAP[s.day].name} · ${short(s.date)}</p>
    <h2 id="celeT">Antrenman tamam!</h2>
    <div class="cgrid"><div><b>${o.n}</b><span>set</span></div><div><b>${fmtTon(o.vol)}</b><span>hacim</span></div><div><b>${pr}</b><span>yeni rekor</span></div><div><b>${min>=1?Math.round(min)+" dk":"–"}</b><span>süre</span></div></div>
    <p class="xpgain">+${xp} XP</p>
    <p class="quote">Bu hafta bara ${Math.min(st.thisWeek.length,5)}. plakayı taktın. ${s.day!=="legs"&&cardioMin(s)<15?"Şimdi 15–20 dk eğimli yürüyüşle bitir.":quote(3)}</p>
    <button class="btn gold" id="celeOk" type="button">Harika, devam</button></div>`;
  c.hidden=false;document.getElementById("celeOk").focus();confetti();beep([660,880,1100]);
}
document.getElementById("cele").addEventListener("click",e=>{if(e.target.id==="celeOk"||e.target.id==="cele")e.currentTarget.hidden=true});
function confetti(){
  try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return}catch(e){}
  const cv=document.getElementById("confetti"),ctx=cv.getContext("2d");if(!ctx)return;
  const dpr=window.devicePixelRatio||1;cv.hidden=false;
  const W=cv.width=innerWidth*dpr,H=cv.height=innerHeight*dpr,cols=["#C8322B","#1E56B8","#E8AE14","#2A8049","#F2F3EF"];
  const ps=Array.from({length:170},()=>({x:W/2+(Math.random()-.5)*W*.4,y:H*.4,vx:(Math.random()-.5)*20*dpr,vy:(-Math.random()*17-6)*dpr,s:(7+Math.random()*8)*dpr,r:Math.random()*6,vr:(Math.random()-.5)*.35,c:cols[Math.floor(Math.random()*cols.length)]}));
  const t0=performance.now();
  (function f(t){
    ctx.clearRect(0,0,W,H);
    ps.forEach(p=>{p.vy+=.55*dpr;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore()});
    if(t-t0<3200)requestAnimationFrame(f);else{ctx.clearRect(0,0,W,H);cv.hidden=true}
  })(t0);
}

/* ---------- sound & wake lock ---------- */
let audioCtx=null;
function ensureAudio(){try{if(!audioCtx&&window.AudioContext)audioCtx=new AudioContext();if(audioCtx&&audioCtx.state==="suspended")audioCtx.resume()}catch(e){}}
function beep(freqs){
  if(!prefs.sound||!audioCtx)return;
  try{freqs.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime+i*0.22;o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.3,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.18);o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+0.2)})}catch(e){}
}
let wakeLock=null,wakeBusy=false;
async function syncWake(){
  if(wakeBusy)return;wakeBusy=true;
  try{
    const s=DAYMAP[view]?session(view,date):null;
    const want=!!(prefs.wake&&s&&s.start&&!s.end&&document.visibilityState==="visible"&&"wakeLock" in navigator);
    if(want&&!wakeLock){wakeLock=await navigator.wakeLock.request("screen");wakeLock.addEventListener("release",()=>{wakeLock=null})}
    else if(!want&&wakeLock){await wakeLock.release();wakeLock=null}
  }catch(e){wakeLock=null}
  wakeBusy=false;
}

/* ---------- clocks ---------- */
setInterval(()=>{const el=document.getElementById("sessClock");if(!el)return;const s=session(view,date);if(s.start&&!s.end)el.textContent=hms(Date.now()-s.start)},1000);
let restEnd=0,restTotal=0,restInt=null,hideT=null;
const tEl=document.getElementById("timer"),tT=document.getElementById("timerT"),tL=document.getElementById("timerL"),tB=document.getElementById("timerBar");
function startRest(sec,label){clearTimeout(hideT);restTotal=sec;restEnd=Date.now()+sec*1000;tL.textContent="Dinlenme · "+label;tEl.hidden=false;clearInterval(restInt);restInt=setInterval(tickRest,250);tickRest()}
function stopRest(){clearInterval(restInt);clearTimeout(hideT);tEl.hidden=true}
function tickRest(){
  const left=(restEnd-Date.now())/1000;
  tT.textContent=mmss(left);tB.style.width=Math.max(0,Math.min(100,(1-left/restTotal)*100))+"%";
  if(left<=0){clearInterval(restInt);tT.textContent="0:00";tL.textContent="Dinlenme bitti, sıradaki sete geç!";beep([880,880,1320]);try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}hideT=setTimeout(()=>{tEl.hidden=true},5000)}
}
document.getElementById("timerPlus").onclick=()=>{if(restEnd<Date.now()){restEnd=Date.now();clearInterval(restInt);restInt=setInterval(tickRest,250)}restEnd+=15000;restTotal+=15;clearTimeout(hideT);tickRest()};
document.getElementById("timerStop").onclick=stopRest;

/* ---------- auth ---------- */
const authEl=document.getElementById("auth"),appEl=document.getElementById("app");
let authMode="login";
function showAuth(mode,msg,kind){
  authMode=mode||authMode;appEl.hidden=true;authEl.hidden=false;
  const titles={login:"Giriş yap",signup:"Hesap oluştur",forgot:"Şifreni sıfırla",reset:"Yeni şifre belirle"};
  const btn={login:"Giriş yap",signup:"Hesap oluştur",forgot:"Sıfırlama bağlantısı gönder",reset:"Şifreyi kaydet"};
  authEl.innerHTML=`<div class="authbox">
    <div class="authhero"><p class="tt">Push · Pull · Legs</p><h1>PPL Defteri</h1><p>Setlerin, kilon ve beslenmen her cihazında seninle.</p></div>
    <section class="card">
      <h2>${titles[authMode]}</h2>
      <form id="authForm" novalidate>
        ${authMode!=="reset"?`<label>E-posta<input type="email" id="aEmail" autocomplete="email" required></label>`:""}
        ${authMode!=="forgot"?`<label>${authMode==="reset"?"Yeni şifre":"Şifre"}<input type="password" id="aPass" autocomplete="${authMode==="login"?"current-password":"new-password"}" minlength="8" required></label>`:""}
        <button class="btn" type="submit" id="aBtn">${btn[authMode]}</button>
        <p class="msg ${kind||""}" id="aMsg" role="status">${msg?esc(msg):(authMode==="signup"?"Şifren en az 8 karakter olsun.":"")}</p>
      </form>
      <div class="row">
        ${authMode==="login"?`<button class="link" type="button" data-auth="signup">Hesabın yok mu? Oluştur</button><button class="link" type="button" data-auth="forgot">Şifremi unuttum</button>`:""}
        ${authMode==="signup"||authMode==="forgot"?`<button class="link" type="button" data-auth="login">Girişe dön</button>`:""}
      </div>
    </section>
  </div>`;
}
function hideAuth(){authEl.hidden=true;appEl.hidden=false}
authEl.addEventListener("click",e=>{const b=e.target.closest("[data-auth]");if(b)showAuth(b.dataset.auth)});
authEl.addEventListener("submit",async e=>{
  e.preventDefault();if(!sb)return;
  const em=document.getElementById("aEmail"),pw=document.getElementById("aPass"),btn=document.getElementById("aBtn"),msg=document.getElementById("aMsg");
  const email=em?em.value.trim():"",pass=pw?pw.value:"";
  const say=(t,k)=>{msg.textContent=t;msg.className="msg "+(k||"")};
  if(em&&!/^\S+@\S+\.\S+$/.test(email)){say("Geçerli bir e-posta adresi gir.","err");return}
  if(pw&&pass.length<8){say("Şifre en az 8 karakter olmalı.","err");return}
  btn.disabled=true;say("Bekle…");
  const redirect=location.origin+location.pathname;
  try{
    if(authMode==="login"){
      const {error}=await sb.auth.signInWithPassword({email,password:pass});
      if(error)throw error;
    }else if(authMode==="signup"){
      const {data,error}=await sb.auth.signUp({email,password:pass,options:{emailRedirectTo:redirect}});
      if(error)throw error;
      if(!data.session){showAuth("login","Onay e-postası gönderildi. E-postandaki bağlantıya tıkla, sonra buradan giriş yap.","ok");return}
    }else if(authMode==="forgot"){
      const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:redirect});
      if(error)throw error;
      showAuth("login","Şifre sıfırlama bağlantısı e-postana gönderildi.","ok");return;
    }else if(authMode==="reset"){
      const {error}=await sb.auth.updateUser({password:pass});
      if(error)throw error;
      recovering=false;const {data:sd}=await sb.auth.getSession();const u=sd.session?sd.session.user:null;user=null;setUser(u);
      toast("Şifre güncellendi","Artık yeni şifrenle giriş yapabilirsin");return;
    }
  }catch(err){
    const m=String(err&&err.message||"");
    say(/Invalid login/i.test(m)?"E-posta ya da şifre hatalı.":/not confirmed/i.test(m)?"Önce e-postandaki onay bağlantısına tıkla.":/already registered/i.test(m)?"Bu e-postayla zaten bir hesap var. Giriş yap.":/rate limit/i.test(m)?"Çok fazla deneme oldu. Birkaç dakika sonra tekrar dene.":/fetch/i.test(m)?"Bağlantı kurulamadı. İnternetini kontrol et.":"Bir sorun oldu: "+m,"err");
  }
  btn.disabled=false;
});
let recovering=location.hash.includes("type=recovery");
function setUser(u){
  if(recovering){user=u;return}
  if(u&&user&&u.id===user.id)return;
  user=u;
  if(!u){
    if(rtChannel&&sb){sb.removeChannel(rtChannel);rtChannel=null}
    docs.clear();showAuth("login");return;
  }
  uidKey=u.id;lsSet("ppl:lastUser",{id:u.id,email:u.email});
  loadCache();hideAuth();render();
  setStatus("saving","Eşitleniyor…");pull();subscribeRealtime();
}

/* ---------- start ---------- */
async function init(){
  if(!SYNC){uidKey="local";loadCache();hideAuth();render();setStatus("saved","Bu cihazda kaydediliyor");return}
  if(!window.supabase||!window.supabase.createClient){
    // Supabase kütüphanesi yüklenemedi (çevrimdışı ilk açılış): son kullanıcının önbelleğiyle çalış
    const last=lsGet("ppl:lastUser",null);
    if(last){uidKey=last.id;user=null;loadCache();hideAuth();render();setStatus("saving","Çevrimdışı · bağlanınca eşitlenecek")}
    else{appEl.hidden=true;authEl.hidden=false;authEl.innerHTML=`<div class="authbox"><section class="card"><h2>İnternet gerekiyor</h2><p class="note">İlk girişi yapmak için internete bağlan ve sayfayı yenile.</p></section></div>`}
    return;
  }
  sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  sb.auth.onAuthStateChange((ev,session)=>{
    if(ev==="PASSWORD_RECOVERY"){recovering=true;user=session?session.user:null;showAuth("reset");return}
    setTimeout(()=>setUser(session?session.user:null),0);
  });
  const {data}=await sb.auth.getSession();
  if(recovering){showAuth("reset");return}
  setUser(data.session?data.session.user:null);
  if(location.hash.includes("access_token"))history.replaceState(null,"",location.pathname);
}
init();
