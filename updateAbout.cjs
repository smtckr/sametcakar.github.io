const fs = require('fs');

const file1 = 'src/components/AboutSection.tsx';
const file2 = 'src/LanguageContext.tsx';

const oldTr = "Profesyonel ekibimiz Güneydoğu Asya, Kuzey Amerika ve Avrupa genelinde kusursuz deneyimler düzenlemek için günün her saati çalışmaktadır. Butik sahil odalarını ayırtmaktan manzaralı rehberli yürüyüşler tasarlamaya kadar her rezervasyon detayıyla ilgileniyoruz.";
const newTr = "Profesyonel ekibimiz, ülkemizin dört bir yanındaki eşsiz güzellikleri ve seçkin yurtdışı rotalarını keşfetmeniz için kusursuz deneyimler düzenlemek üzere çalışmaktadır. Tarihi dokuya sahip kültürel gezilerden doğa ile iç içe maceralara kadar her detayı sizin için özenle planlıyoruz.";

const oldEn = "Our professional team works around the clock to organize flawless experiences across Southeast Asia, North America, and Europe. From booking boutique coastal rooms to designing scenic guided hikes, we take care of every booking detail.";
const newEn = "Our professional team works to organize flawless experiences for you to discover the unique beauties of our country and selected international routes. From cultural trips with historical texture to adventures intertwined with nature, we carefully plan every detail for you.";

const oldFr = "Notre équipe de professionnels travaille 24 heures sur 24 pour organiser des expériences parfaites en Asie du Sud-Est, en Amérique du Nord et en Europe. Qu'il s'agisse de réserver des chambres de charme sur la côte ou de concevoir des randonnées guidées pittoresques, nous nous occupons de chaque détail de la réservation.";
const newFr = "Notre équipe de professionnels travaille à organiser des expériences parfaites pour vous faire découvrir les beautés uniques de notre pays et des itinéraires internationaux sélectionnés. Des voyages culturels au tissu historique aux aventures mêlées à la nature, nous planifions soigneusement chaque détail pour vous.";

const oldEs = "Nuestro equipo profesional trabaja las 24 horas del día para organizar experiencias impecables en todo el sudeste asiático, Norteamérica y Europa. Desde reservar habitaciones boutique en la costa hasta diseñar caminatas guiadas panorámicas, nos encargamos de cada detalle de la reserva.";
const newEs = "Nuestro equipo profesional trabaja para organizar experiencias impecables para que descubra las bellezas únicas de nuestro país y rutas internacionales seleccionadas. Desde viajes culturales con textura histórica hasta aventuras entrelazadas con la naturaleza, planificamos cuidadosamente cada detalle para usted.";

let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(oldTr, newTr);
fs.writeFileSync(file1, content1);

let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(oldTr, newTr);
content2 = content2.replace(oldEn, newEn);
content2 = content2.replace(oldFr, newFr);
content2 = content2.replace(oldEs, newEs);
fs.writeFileSync(file2, content2);

console.log('Done replacing strings.');
