const parseStoredArray = (value) => {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Не вдалося прочитати дані із sessionStorage', error);
    return [];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const leftPlayersContainer = document.querySelector('.roles-players--left');
  const rightPlayersContainer = document.querySelector('.roles-players--right');
  const turnStatus = document.querySelector('.game-turn__label');
  const noteStatus = document.querySelector('.game-turn__note');
  const finishBtn = document.querySelector('.game-finish-link');

  const deckDefinitions = {
    'main-1': [
      { id: 1, question: 'Яка твоя найвідьомськіша звичка в реальному житті?' },
      {
        id: 2,
        question: 'Чи траплялося тобі використовувати чари — флірт, погляд, слова — щоб отримати бажане?',
      },
      { id: 3, question: 'Яке твоє заклинання працює краще за будь-який магічний ритуал?' },
      { id: 4, question: 'Яка таємниця з твого минулого досі шепоче тобі на вухо?' },
      { id: 5, question: 'Який вчинок ти стерла б із памʼяті інших, якби могла?' },
      { id: 6, question: 'Що може звести тебе з розуму — захоплення чи влада?' },
      { id: 7, question: 'Яка емоція в тобі найруйнівніша?' },
      { id: 8, question: 'Яке бажання ти ховаєш навіть від себе?' },
      {
        id: 9,
        question: 'Якби ти могла зачарувати одну людину — хто б це був і що б ти з нею зробила?',
      },
      { id: 10, question: 'За що тебе могли б засудити на відьомському суді?' },
      {
        id: 11,
        question: 'Хто з присутніх заслуговує стати твоєю «співзмовницею» і чому?',
      },
      { id: 12, question: 'Яка твоя найспокусливіша зброя?' },
      { id: 13, question: 'Коли ти відчуваєш себе по-справжньому магічно привабливою?' },
      { id: 14, question: 'Яка твоя темна сторона тобі навіть подобається?' },
      {
        id: 15,
        question: 'Чи була людина, про яку ти думала: «Я могла б зруйнувати його життя — і це було б красиво»?',
      },
      { id: 16, question: 'Що ти робила вночі, про що краще не розповідати сонцю?' },
      { id: 17, question: 'Яка «заборонена» фантазія повертається до тебе найчастіше?' },
      {
        id: 18,
        question: 'Який комплімент ти хочеш чути частіше, але боїшся в цьому зізнатися?',
      },
      { id: 19, question: 'Що ти вважаєш своєю найбільшою спокусою?' },
      {
        id: 20,
        question: 'Якби твій характер був зіллям — які три інгредієнти були б у ньому?',
      },
      {
        id: 21,
        question: 'Що в тобі змушує людей тягнутися до тебе — і віддалятися?',
      },
      { id: 22, question: 'Чи є людина, яку ти подумки прокляла? Спрацювало?' },
      {
        id: 23,
        question: 'Яка частина твого життя схожа на заклинання, що вийшло з-під контролю?',
      },
      {
        id: 24,
        question: 'Якби ти могла змінити минуле, не втративши урок — що б це було?',
      },
      { id: 25, question: 'Яку клятву ти дала собі — і порушила?' },
      {
        id: 26,
        question: 'Кого з колишніх ти б викликала назад — не заради кохання, а з цікавості?',
      },
      {
        id: 27,
        question: 'Що ти коли-небудь робила, знаючи, що це все зруйнує — але все одно продовжувала?',
      },
      { id: 28, question: 'Що б ти зробила, якби ніхто не дізнався?' },
      {
        id: 29,
        question: 'Коли ти востаннє вдавала, що тобі байдуже — хоча це було не так?',
      },
      {
        id: 30,
        question: 'Кому з присутніх ти б довірила таємницю, здатну тебе зруйнувати?',
      },
      { id: 31, question: 'Що в тобі найнебезпечніше — твій розум, тіло чи здатність відчувати?' },
      { id: 32, question: 'Коли ти була найбільш жорстокою — і насолоджувалася цим?' },
      { id: 33, question: 'Що ти вкрала — буквально чи символічно — і не пошкодувала?' },
      { id: 34, question: 'Що тобі легше: маніпулювати чи піддаватися?' },
      {
        id: 35,
        question: 'Коли ти відчувала, що хтось читає тебе як відкриту книгу — і це було приємно?',
      },
      { id: 36, question: 'Що ти приховуєш під образом «все під контролем»?' },
      {
        id: 37,
        question: 'Що б ти хотіла повернути: людину, почуття чи момент?',
      },
      {
        id: 38,
        question: 'Коли ти востаннє навмисно зробила щось неправильне — просто заради смаку гріха?',
      },
      { id: 39, question: 'Що збуджує тебе сильніше — влада чи покора?' },
      { id: 40, question: 'Що б ти сказала собі десять років тому?' },
      {
        id: 41,
        question: 'Яке бажання ти довго називала «дурістю», доки не зрозуміла, що саме цього тобі й треба?',
      },
      {
        id: 42,
        question: 'Якби Місяць міг поставити тобі одне питання — чого б ти боялася почути?',
      },
      { id: 43, question: 'Що в тобі — дар, а що — прокляття?' },
      {
        id: 44,
        question: 'Коли ти востаннє відчувала себе справжньою відьмою — впевненою, бажаною й трохи небезпечною?',
      },
      { id: 45, question: 'Чи є у тебе «священна таємниця», про яку ніхто не знає?' },
      { id: 46, question: 'Кохання без пристрасті ❤️ чи пристрасть без кохання 🔥?' },
      { id: 47, question: 'Передбачити майбутнє — чи переписати минуле?' },
      { id: 48, question: 'Володарювати над іншими — чи над собою?' },
      { id: 49, question: 'Ніколи не помилятися — чи завжди отримувати другий шанс?' },
      { id: 50, question: 'Зізнатися в гріху — чи повторити його ще раз?' },
      { id: 51, question: 'Сказати правду — чи промовити красиву брехню?' },
      { id: 52, question: 'Врятувати кохання — чи зберегти свободу?' },
      { id: 53, question: 'Завдавати болю — чи відчувати біль?' },
      { id: 54, question: 'Здатися — чи зробити вигляд, що ти й не прагнула перемоги?' },
      { id: 55, question: 'Пробачити — чи спостерігати, як доля мстить за тебе?' },
      { id: 56, question: 'Стати легендою — чи залишитися таємницею?' },
      {
        id: 57,
        question: 'Отримати все — але втратити смак до гри, чи програти — й сміятися?',
      },
      { id: 58, question: 'Віддати силу за кохання — чи кохання за силу?' },
      {
        id: 59,
        question: 'Жертвувати собою заради інших — чи дозволяти іншим жертвувати заради тебе?',
      },
      { id: 60, question: 'Залишатися в тіні — чи вийти на світ і згоріти?' },
      { id: 61, question: 'Що б ти обрала — знати все чи відчувати все?' },
      {
        id: 62,
        question: 'Якби ти могла переродитися відьмою в іншій епосі — яку б обрала?',
      },
    ],
    'main-2': [
      { id: 1, task: 'Зніми коротке відео (до 10 с), де ти викликаєш натхнення — наче заклинанням.' },
      { id: 2, task: 'Зроби селфі, ніби ти давня відьма, що вперше побачила смартфон.' },
      {
        id: 3,
        task: 'Дозволь відьмам обрати фільтр, позу й ідею для твого фото. Без права відмови.',
      },
      { id: 4, task: "Зніміть відео «Передаю телефон людині, яка…»." },
      {
        id: 5,
        task: 'Зроби колективне фото, де кожна відьма зображає стихію: вогонь, воду, повітря, землю.',
      },
      {
        id: 6,
        task: 'Організуй «ритуал сміху»: нехай кожна відьма скаже слово, що її смішить.',
      },
      { id: 7, task: 'Проведи обряд «руйнування нудьги»: зроби те, чого ніхто не очікував.' },
      {
        id: 8,
        task: 'Намалюй символ дружби просто на руках інших відьом (помада, тіні, перо — усе підійде).',
      },
      { id: 9, task: 'Обери відьму й разом зобразіть сцену з минулого втілення.' },
      {
        id: 10,
        task: 'Оголоси «обряд тостів»: нехай кожна відьма скаже коротке побажання під оплески.',
      },
      {
        id: 11,
        task: 'Обміняйтеся кільцями, браслетами або прикрасами «на вдачу до світанку».',
      },
      {
        id: 12,
        task: 'Напиши послання «від тіні» для кожної відьми — нехай збережуть.',
      },
      {
        id: 13,
        task: 'Придумай «талісман вечора» з підручних речей — і поясни його силу.',
      },
      { id: 14, task: 'Зобрази відьму, яку ти боялася б зустріти вночі.' },
      {
        id: 15,
        task: 'Подаруй будь-якій відьмі «знак сили» — вигаданий предмет, фразу або жест, що стане її оберегом.',
      },
      {
        id: 16,
        task: 'Обери відьму й зіграй міні-сцену спокуси — без слів, лише поглядом і мімікою.',
      },
      { id: 17, task: 'Обери звук у TikTok і зніміть відео.' },
      {
        id: 18,
        task: 'Зніми відео «Я відьма, що запізнюється на шабаш» — імпровізація вітається.',
      },
      {
        id: 19,
        task: 'Запиши «аудіосповідь»: три фрази, які ти ніколи б не сказала твереза.',
      },
      {
        id: 20,
        task: 'Дозволь відьмі поставити тобі одне питання — і відповідай без слів, тільки мімікою.',
      },
      {
        id: 21,
        task: 'Влаштуйте показ мод: зробіть костюми з підручних матеріалів і проведіть фотосесію.',
      },
      { id: 22, task: 'Зніміть відеопародію на якийсь мультфільм чи фільм.' },
      { id: 23, task: 'Потанцюйте так, ніби це обряд екзорцизму.' },
      { id: 24, task: 'Спробуйте зробити 5 спільних адекватних фото.' },
      { id: 25, task: 'Обери пісню для кожної відьми, з якою вона асоціюється.' },
      {
        id: 26,
        task: 'Зроби фото, наче ти щойно вчинила злочин і пишаєшся цим.',
      },
      {
        id: 27,
        task: 'Зроби селфі з відьмою справа — але обличчя обох мають бути в «містичних» емоціях.',
      },
      {
        id: 28,
        task: 'Придумай комплімент відьмі навпроти, використовуючи слово «тьма».',
      },
      {
        id: 29,
        task: 'Придумай «гороскоп» для відьми справа — на найближчі 10 хвилин.',
      },
      {
        id: 30,
        task: 'Нехай відьми оберуть випадковий предмет, а ти маєш вигадати, як він врятує світ.',
      },
      { id: 31, task: 'Придумай девіз для вашого Ковену — і проголоси його урочисто.' },
      {
        id: 32,
        task: 'Зроби комплімент відьмі справа — але так, ніби ти її побоюєшся.',
      },
      {
        id: 33,
        task: 'Нехай відьми оберуть пісню, а ти маєш заспівати 5 секунд максимально пристрасно.',
      },
      { id: 34, task: 'Зроби фото моменту, де видно, що ти «володієш ситуацією».' },
      { id: 35, task: 'Придумай імʼя своєму внутрішньому демону й представ його групі.' },
      {
        id: 36,
        task: 'Зобрази «ритуал спокуси»: три рухи, одне слово, один погляд.',
      },
      {
        id: 37,
        task: 'Зніми відео «Я — богиня хаосу, втомлена від людських дурощів».',
      },
      {
        id: 38,
        task: 'Придумай «аромат свого вечора» — опиши його так, ніби говориш про людину.',
      },
      {
        id: 39,
        task: 'Обери відьму й скажи їй три слова, які, на твою думку, могли б її завести.',
      },
      {
        id: 40,
        task: 'Опиши, як би виглядав ідеальний момент пристрасті — без подробиць, лише образи й відчуття.',
      },
      { id: 41, task: 'Обери відьму й пограйте в гру «Ментальний звʼязок».' },
      { id: 42, task: 'Скажи: «Я знаю, що виглядаю невинно, але…» й заверши речення.' },
      {
        id: 43,
        task: 'Придумай найабсурдніший спосіб флірту, який, на диво, міг би спрацювати.',
      },
      {
        id: 44,
        task: 'Зніми відеоінтервʼю з «духом із холодильника», який радить, що поїсти.',
      },
      { id: 45, task: 'Придумай нову позу для медитації «з похмілля». Покажи.' },
      { id: 46, task: 'Зобрази, як ти пояснюєш Siri, що ти відьма.' },
      {
        id: 47,
        task: 'Дозволь відьмам обрати саундтрек, під який ти маєш увійти до кімнати «як королева».',
      },
      {
        id: 48,
        task: 'Обери музику, придумай рухи й зобрази ідеальний відьомський еротичний танець.',
      },
      { id: 49, task: 'Намалюй портрет інших відьом із заплющеними очима.' },
      {
        id: 50,
        task: 'Промов монолог, ніби це твоє останнє слово перед спаленням на вогнищі.',
      },
      {
        id: 51,
        task: 'Обери найкринжовіший звук у TikTok і зніміть під нього відео з іншими відьмами.',
      },
      {
        id: 52,
        task: 'Зніми відео «ритуал натхнення» — із заклинанням, рухом і поглядом.',
      },
      {
        id: 53,
        task: 'Зроби колективне селфі, де всі відьми усміхаються як змовниці.',
      },
      {
        id: 54,
        task: 'Організуй «ритуал світла» — вимкніть світло й зробіть фото лише при свічках.',
      },
      { id: 55, task: 'Придумай короткий тост для Ковену — з трьох загадкових слів.' },
      { id: 56, task: 'Попроси відьом назвати твою суперсилу — погоджуйся з будь-якою.' },
      {
        id: 57,
        task: 'Зніми відео, де ти, як дух, зʼявляєшся з туману (імпровізація).',
      },
      { id: 58, task: 'Зобрази момент, коли ти зрозуміла, що справді відьма.' },
      { id: 59, task: 'Придумай і покажи жест «Заклику Сили» для всього Ковену.' },
      {
        id: 60,
        task: 'Оголоси хвилину тиші — і нехай відьми говорять лише жестами.',
      },
    ],
    'main-3': [
      { id: 1, task: 'Розкажи про випадок, коли доля втрутилася — вчасно чи запізно.' },
      { id: 2, task: 'Згадай історію, де все пішло не за планом, але вийшло краще.' },
      { id: 3, task: 'Розкажи, як ти випадково отримала те, про що мріяла.' },
      { id: 4, task: 'Чи був день, що почався жахливо, а закінчився магічно?' },
      { id: 5, task: 'Опиши зустріч, яка здалася випадковою, але потім багато змінила.' },
      { id: 6, task: 'Розкажи про знак, збіг або річ, яку ти сприйняла як послання.' },
      { id: 7, task: 'Коли ти востаннє подумала: «Це не просто випадковість»?' },
      { id: 8, task: 'Який був найдурніший вчинок, який ти зробила через симпатію?' },
      { id: 9, task: 'Згадай момент, коли серце вирішувало швидше, ніж розум.' },
      { id: 10, task: 'Розкажи про побачення, яке пішло не за планом — але запамʼяталося.' },
      { id: 11, task: 'Чи була людина, поява якої у твоєму житті здавалася магією?' },
      { id: 12, task: 'Згадай момент, коли все навколо виглядало як сцена з фільму.' },
      { id: 13, task: 'Розкажи про найшаленішу річ, яку ви зробили з подругами.' },
      { id: 14, task: 'Згадай момент, коли ви сміялися так, що не могли зупинитися.' },
      { id: 15, task: 'Що з ваших «дурних ідей» стало найкращим спогадом?' },
      {
        id: 16,
        task: 'Розкажи про випадок, коли ви з кимось відчували, ніби проти вас весь світ — і вам було байдуже.',
      },
      { id: 17, task: 'Чи був момент, коли ви відчули себе героїнями фільму?' },
      { id: 18, task: 'Згадай вашу «внутрішню жартівку», яку ніхто, крім вас, не зрозуміє.' },
      { id: 19, task: 'Яка ваша спільна історія досі викликає сльози від сміху?' },
      { id: 20, task: 'Чи був випадок, коли дружба відчувалася як магія сильніша за будь-який ритуал?' },
      { id: 21, task: 'Розкажи про момент, коли ти усвідомила, що подорослішала.' },
      { id: 22, task: 'Чи був день, який ти хотіла б пережити знову — але не змінюючи?' },
      { id: 23, task: 'Що ти втратила — і лише потім зрозуміла, що це було на краще?' },
      { id: 24, task: 'Розкажи історію, яку досі не можеш пояснити логічно.' },
      { id: 25, task: 'Чи був сон, який ніби підказав тобі щось важливе?' },
      { id: 26, task: 'Розкажи про річ, яка «знайшла тебе сама».' },
      { id: 27, task: 'Згадай місце, де ти відчувала, ніби вже була — хоча це неможливо.' },
      { id: 28, task: 'Яка дрібниця з минулого й досі переслідує тебе як символ?' },
      { id: 29, task: 'Розкажи про збіг, який тебе налякав.' },
      { id: 30, task: 'Яка історія у твоєму житті звучить надто красиво, щоб бути правдою?' },
      { id: 31, task: 'Згадай випадок, коли ви посварилися — і як помирилися.' },
      { id: 32, task: 'Яка історія вашої дружби заслуговує на екранізацію?' },
      { id: 33, task: 'Що ви зробили разом, на що б не наважилася наодинці?' },
      { id: 34, task: 'Розкажи про вашу спільну «легенду» — історію, яку ви щоразу перебільшуєте.' },
      { id: 35, task: 'Яка пісня назавжди буде вашою?' },
      { id: 36, task: 'Якби ви могли обрати символ вашої дружби — що б це було?' },
      { id: 37, task: 'Що ти зрозуміла про справжню дружбу лише з віком?' },
      { id: 38, task: 'Коли ти відчула, що дружба — це теж форма кохання?' },
      { id: 39, task: 'Чи є між вами «таємна вдячність», про яку ви ніколи не говорили?' },
      { id: 40, task: 'Згадай випадок, коли ви намагалися приховати від дорослих те, що накоїли.' },
      {
        id: 41,
        task: 'Розкажи про вечір, коли ви відчували себе «королевами життя» — хай навіть з лимонадом у склянці.',
      },
      { id: 42, task: 'Яка ваша шкільна чи університетська історія досі смішить?' },
      {
        id: 43,
        task: 'Згадай момент, коли хтось із вас уперше сказав: «Ми занадто дорослі для цього»… і ви все одно це зробили.',
      },
      { id: 44, task: 'Що стало вашим символом безумства — пісня, місце, предмет?' },
      {
        id: 45,
        task: 'Хто з вас завжди починав авантюри, а хто казав «не роби цього»… і все одно робив?',
      },
      { id: 46, task: 'Що з твоїх тодішніх «ганьб» тепер стало кумедною легендою?' },
      { id: 47, task: 'Що з твоїх «підліткових принципів» зараз здається абсурдним?' },
      { id: 48, task: 'Згадай момент, коли ви були щасливі просто тому, що були разом.' },
      { id: 49, task: 'Що з вашого тодішнього «хаосу» ти зараз хотіла б повернути — хоч на вечір?' },
      { id: 50, task: 'Розкажи про ніч, яку щоразу згадуєш з усмішкою й фразою «ми були божевільні».' },
      { id: 51, task: 'Яку фразу ти казала в юності, думаючи, що звучиш як філософ?' },
      { id: 52, task: 'Розкажи про модний образ, який тоді здавався шедевром, а тепер боляче дивитися.' },
      { id: 53, task: 'Що з твоїх «життєвих принципів» 16-річної тебе викликає спазм ностальгії?' },
      { id: 54, task: 'Чи був у тебе «сценічний псевдонім» або нік, за який тепер ніяково?' },
      { id: 55, task: 'Що ти писала у статусах чи підписах до фото у старих соцмережах?' },
      { id: 56, task: 'Яка пісня була твоїм «життєвим гімном», але тепер ти не можеш слухати її без сміху?' },
      { id: 57, task: 'Згадай момент, коли ти була певна, що виглядаєш загадково — а виглядала як NPC.' },
      { id: 58, task: 'Що ти колись писала в щоденнику чи блокноті, наче це одкровення всесвіту?' },
      { id: 59, task: 'Розкажи про фразу, яку ти ляпнула при чужих батьках чи начальстві.' },
      { id: 60, task: 'Що ти намагалася зробити «тихенько», а почули всі?' },
      { id: 61, task: 'Чи був випадок, коли ти видала сарказм, а всі сприйняли серйозно?' },
      { id: 62, task: 'Що ви переплутали чи зламали, але зробили вигляд, що «так і задумано»?' },
      { id: 63, task: 'Розкажи про фразу, яку подруга ляпнула «не при тих людях».' },
      { id: 64, task: 'Що ви зробили разом, після чого вирішили «ніколи не згадувати».' },
    ],
    'aux-1': [
      { id: 1, task: 'Візьми будь-яку випадкову річ на столі й скажи, що вона «передвіщає».' },
      {
        id: 2,
        task: 'Придумай «оракульське» пророцтво для наступної гравчині (чим загадковіше — тим краще).',
      },
      {
        id: 3,
        task: 'Нехай кожна відьма скаже тобі по одному слову — склади з них своє «передбачення».',
      },
      { id: 4, task: 'Скажи вголос «Я прошу знак!», загадай питання й увімкни випадкову пісню.' },
      {
        id: 5,
        task: 'Напиши на папірці бажання, згорни, підпали кутик і скажи, що побачила в димі.',
      },
      { id: 6, task: 'Поглянь на відьму навпроти й скажи, ким вона була в минулому житті.' },
      { id: 7, task: 'Нехай відьма справа поставить тобі запитання — відповідай як провидиця.' },
      {
        id: 8,
        task: 'Нехай відьми ставлять тобі «запитання долі», а ти відповідай лише «так», «ні» або «зачекай».',
      },
      {
        id: 9,
        task: 'Напиши на серветці слово, яке хочеш залишити в минулому — спали або сховай.',
      },
      { id: 10, task: 'Прочитай коротке благословення для всіх, хто сьогодні поруч.' },
      {
        id: 11,
        task: 'Проведіть ритуал передбачень із книжкою: відкрий на випадковій сторінці й прочитай перше речення як пророцтво.',
      },
      {
        id: 12,
        task: 'Оракул випадкових предметів: відьма заплющує очі, їй дають будь-який предмет, а вона пояснює, для чого він у чаклунстві.',
      },
      {
        id: 13,
        task: 'Нехай крапля воску впаде у воду — форма скаже все. Тлумачить та, кому випала карта.',
      },
      {
        id: 14,
        task: 'Загадай питання, а решта відьом нехай тикнуть у 3 випадкові смайлики. Ось і відповідь!',
      },
      {
        id: 15,
        task: 'Візуалізація майбутнього: знайди кожній відьмі по 3 картинки з Pinterest — що чекає її попереду.',
      },
      {
        id: 16,
        task: 'Запитай у телефона «так чи ні» через голосовий помічник — прийми відповідь як доленосну.',
      },
      {
        id: 17,
        task: 'Нехай відьма зліва дасть тобі фразу, а ти зроби з неї пророцтво.',
      },
      {
        id: 18,
        task: 'Подивися у дзеркало (або в чиюсь камеру) й скажи: «Що хоче сказати мені відображення?»',
      },
      { id: 19, task: 'Придумай ритуал «очищення думок» із трьох дій — і покажи його.' },
      {
        id: 20,
        task: 'Візьми свічку чи ліхтарик, дивись на полумʼя й промов те, від чого хочеш звільнитися.',
      },
      {
        id: 21,
        task: 'Напиши три слова, що описують твоє теперішнє — нехай відьми вгадають, чому саме вони.',
      },
      {
        id: 22,
        task: 'Нехай відьми оберуть випадковий мем — ти маєш витлумачити його як пророцтво.',
      },
      {
        id: 23,
        task: 'Увімкни диктофон і промов голосом Оракула одне випадкове слово — хай решта скажуть, що воно означає.',
      },
      { id: 24, task: 'Дістань будь-яку прикрасу — розкажи, яку силу вона зберігає.' },
      {
        id: 25,
        task: 'Нехай кожна відьма назве інгредієнт зілля — склади з них рецепт щастя.',
      },
      {
        id: 26,
        task: 'Нехай відьма справа поставить запитання — відповідай однією фразою, але так, щоб вона звучала як давня мудрість.',
      },
      {
        id: 27,
        task: 'Заплющ очі, тикни в будь-яку літеру на клавіатурі — придумай фразу-пророцтво, що починається з неї.',
      },
      {
        id: 28,
        task: 'Подивися на вогонь (або екран) і опиши, що «покаже» тобі полумʼя.',
      },
      {
        id: 29,
        task: 'Напиши фразу-пророцтво, що римується з імʼям однієї з відьом.',
      },
      {
        id: 30,
        task: 'Зроби міні-ритуал: три вдихи, три слова, три клацання — і скажи, що змінилося.',
      },
      {
        id: 31,
        task: 'Нехай відьма справа обере слово, відьма зліва — емоцію, а ти поєднай їх у передбачення.',
      },
      {
        id: 32,
        task: 'Нехай відьма навпроти спитає «що мене чекає?», а ти відповідай першою думкою, що спаде на думку.',
      },
    ],
  };

  const deckStates = new Map();

  if (!leftPlayersContainer || !rightPlayersContainer || !turnStatus || !finishBtn) {
    return;
  }

  const storedNames = parseStoredArray(sessionStorage.getItem('covenPlayers')).map((name) =>
    typeof name === 'string' ? name.trim() : ''
  );
  const storedAssignments = parseStoredArray(sessionStorage.getItem('covenAssignments'));

  if (storedNames.length === 0) {
    window.location.replace('players.html');
    return;
  }

  const playersData = storedNames.map((name, index) => {
    const assignment =
      typeof storedAssignments[index] === 'object' && storedAssignments[index] !== null
        ? storedAssignments[index]
        : {};
    const roleTitle = typeof assignment.roleTitle === 'string' ? assignment.roleTitle.trim() : '';
    const roleSummary = typeof assignment.roleSummary === 'string' ? assignment.roleSummary.trim() : '';
    const roleDetails =
      assignment.roleDetails && typeof assignment.roleDetails === 'object'
        ? assignment.roleDetails
        : null;

    return {
      name,
      roleTitle,
      roleSummary,
      roleDetails,
    };
  });

  const hasAllRoles = playersData.every((player) => player.roleTitle.length > 0);
  if (!hasAllRoles) {
    window.location.replace('roles.html');
    return;
  }

  const createPlayerElement = (player, index) => {
    const article = document.createElement('article');
    article.className = 'roles-player game-player is-complete';
    article.dataset.playerIndex = String(index);

    const scoreWrapper = document.createElement('div');
    scoreWrapper.className = 'game-player__score';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.type = 'button';
    decreaseBtn.className = 'game-player__score-button game-player__score-button--decrease';
    decreaseBtn.setAttribute('aria-label', `Відняти бал у ${player.name}`);
    decreaseBtn.textContent = '−';

    const orb = document.createElement('div');
    orb.className = 'roles-player__orb';

    const scoreValue = document.createElement('span');
    scoreValue.className = 'game-player__score-value';
    scoreValue.textContent = '0';
    scoreValue.setAttribute('aria-live', 'polite');

    orb.append(scoreValue);

    const increaseBtn = document.createElement('button');
    increaseBtn.type = 'button';
    increaseBtn.className = 'game-player__score-button game-player__score-button--increase';
    increaseBtn.setAttribute('aria-label', `Додати бал ${player.name}`);
    increaseBtn.textContent = '+';

    scoreWrapper.append(decreaseBtn, orb, increaseBtn);

    const nameEl = document.createElement('p');
    nameEl.className = 'roles-player__name';
    nameEl.textContent = player.name;

    const roleEl = document.createElement('p');
    roleEl.className = 'roles-player__role';
    roleEl.textContent = player.roleTitle;
    if (player.roleSummary?.length > 0) {
      roleEl.setAttribute('data-hint', player.roleSummary);
    }

    article.append(scoreWrapper, nameEl, roleEl);

    return {
      element: article,
      scoreValue,
      decreaseBtn,
      increaseBtn,
    };
  };

  const midpoint = playersData.length <= 3 ? playersData.length : Math.ceil(playersData.length / 2);

  const players = playersData.map((player, index) => {
    const playerElement = createPlayerElement(player, index);
    const targetContainer = index < midpoint ? leftPlayersContainer : rightPlayersContainer;
    targetContainer.append(playerElement.element);
    return playerElement;
  });

  if (rightPlayersContainer.childElementCount > 0) {
    const stage = document.querySelector('.game-stage');
    stage?.classList.add('roles-stage--split');
  }

  const getRandomIntInclusive = (min, max) => {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
  };

  const drawCardFromDeck = (deckId) => {
    const deck = deckDefinitions[deckId];
    if (!Array.isArray(deck) || deck.length === 0) {
      return null;
    }

    let state = deckStates.get(deckId);
    if (!state || state.remaining.length === 0) {
      state = {
        remaining: deck.slice(),
      };
    }

    const { remaining } = state;
    if (!Array.isArray(remaining) || remaining.length === 0) {
      return null;
    }

    const randomIndex = getRandomIntInclusive(0, remaining.length - 1);
    const [card] = remaining.splice(randomIndex, 1);
    deckStates.set(deckId, { remaining });

    return card ?? null;
  };

  const getCardText = (card) => {
    if (!card || typeof card !== 'object') {
      return '';
    }

    if (typeof card.question === 'string') {
      const trimmedQuestion = card.question.trim();
      if (trimmedQuestion.length > 0) {
        return trimmedQuestion;
      }
    }

    if (typeof card.task === 'string') {
      const trimmedTask = card.task.trim();
      if (trimmedTask.length > 0) {
        return trimmedTask;
      }
    }

    return '';
  };

  let activePlayerIndex = 0;
  const scores = players.map(() => 0);
  let turnsUntilEvent = getRandomIntInclusive(3, 6);
  let currentEvent = null;
  const finishThreshold = 100;
  let finishNote = '';
  let lastOpenedDeckType = null;

  const auxiliaryDecks = Array.from(document.querySelectorAll(
    '.game-deck--auxiliary'
  ));

  const renderNote = () => {
    const parts = [];
    if (currentEvent) {
      const eventLabel =
        currentEvent === 'ritual' ? 'Час ритуалу' : 'Час розгадати таємницю';
      parts.push(`${eventLabel}! Візьміть карту з додаткової колоди.`);
    }
    if (finishNote) {
      parts.push(finishNote);
    }

    if (noteStatus) {
      noteStatus.textContent = parts.join(' • ');
    }

    auxiliaryDecks.forEach((deck) => {
      const isRitualDeck = deck.classList.contains('game-deck--aux-1');
      const isMysteryDeck = deck.classList.contains('game-deck--aux-2');
      const shouldHighlight =
        (currentEvent === 'ritual' && isRitualDeck) ||
        (currentEvent === 'mystery' && isMysteryDeck);
      deck.classList.toggle('game-deck--highlight', shouldHighlight);
    });
  };

  const updateTurnStatus = () => {
    const active = playersData[activePlayerIndex];
    if (active?.name) {
      turnStatus.textContent = `Зараз хід: ${active.name}`;
    } else {
      turnStatus.textContent = 'Обирайте, хто ходитиме першим';
    }
    renderNote();
  };

  const setActivePlayer = (index) => {
    activePlayerIndex = index;
    players.forEach((player, playerIndex) => {
      player.element.classList.toggle('is-active', playerIndex === index);
    });
    updateTurnStatus();
  };

  const updateFinishButton = (triggerIndex = null) => {
    const hasThreshold = scores.some((score) => score >= finishThreshold);
    if (!hasThreshold) {
      if (!finishBtn.hidden) {
        finishBtn.hidden = true;
      }
      finishNote = '';
      renderNote();
      return;
    }

    if (triggerIndex !== null && playersData[triggerIndex]) {
      finishNote = `${playersData[triggerIndex].name} набрав/ла ${finishThreshold} балів! Можна завершити гру або продовжити.`;
    }
    if (!finishNote) {
      finishNote = `Хтось набрав ${finishThreshold} балів. Ви можете завершити гру або продовжити.`;
    }

    finishBtn.hidden = false;

    renderNote();
  };

  const adjustScore = (playerIndex, delta) => {
    if (!Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= scores.length) {
      return;
    }
    const current = scores[playerIndex];
    const nextScore = Math.max(0, current + delta);
    if (current === nextScore) {
      return;
    }
    scores[playerIndex] = nextScore;
    const scoreLabel = players[playerIndex]?.scoreValue;
    if (scoreLabel) {
      scoreLabel.textContent = String(nextScore);
    }
    updateFinishButton(delta > 0 && nextScore >= finishThreshold ? playerIndex : null);
  };

  players.forEach((player, index) => {
    player.element.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('.game-player__score-button')) {
        return;
      }
      setActivePlayer(index);
    });

    player.decreaseBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      adjustScore(index, -1);
    });

    player.increaseBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      adjustScore(index, 1);
    });
  });

  const deckPopup = document.querySelector('.game-deck-popup');
  const deckButtons = document.querySelectorAll('[data-game-deck]');
  const deckPopupTasks = deckPopup?.querySelector('[data-deck-field="tasks"]');
  let lastFocusedDeck = null;

  const closeDeckPopup = () => {
    if (!deckPopup || deckPopup.hidden) {
      return;
    }
    deckPopup.hidden = true;
    deckPopup.classList.remove('is-active');
    document.removeEventListener('keydown', handleDeckPopupKeydown);
    if (deckPopupTasks) {
      deckPopupTasks.replaceChildren();
      deckPopupTasks.hidden = true;
    }
    if (lastFocusedDeck instanceof HTMLElement) {
      lastFocusedDeck.focus({ preventScroll: true });
    }
    lastFocusedDeck = null;

    let eventResolved = false;
    if (currentEvent && lastOpenedDeckType === 'auxiliary') {
      currentEvent = null;
      turnsUntilEvent = getRandomIntInclusive(3, 6);
      eventResolved = true;
    }

    lastOpenedDeckType = null;

    if (players.length > 0) {
      if (!eventResolved) {
        turnsUntilEvent = Math.max(turnsUntilEvent - 1, 0);
      }

      if (turnsUntilEvent <= 0 && !currentEvent) {
        currentEvent = Math.random() < 0.5 ? 'ritual' : 'mystery';
        turnsUntilEvent = 0;
      }

      const nextIndex = (activePlayerIndex + 1) % players.length;
      setActivePlayer(nextIndex);

      if (!currentEvent && turnsUntilEvent === 0) {
        turnsUntilEvent = getRandomIntInclusive(3, 6);
      }
    }
  };

  const handleDeckPopupKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDeckPopup();
    }
  };

  const openDeckPopup = (trigger) => {
    if (!deckPopup || !deckPopupTasks) {
      return;
    }

    const content = typeof trigger.dataset.deckContent === 'string' ? trigger.dataset.deckContent.trim() : '';

    if (trigger.classList.contains('game-deck--auxiliary')) {
      lastOpenedDeckType = 'auxiliary';
    } else {
      lastOpenedDeckType = 'main';
    }

    deckPopupTasks.replaceChildren();
    if (content.length > 0) {
      const paragraph = document.createElement('p');
      paragraph.className = 'game-deck-popup__text';
      paragraph.textContent = content;
      deckPopupTasks.append(paragraph);
      deckPopupTasks.hidden = false;
    } else {
      deckPopupTasks.hidden = true;
    }

    deckPopup.hidden = false;
    deckPopup.classList.add('is-active');
    document.addEventListener('keydown', handleDeckPopupKeydown);

    lastFocusedDeck = trigger;

    const closeButton = deckPopup.querySelector('.role-popup__close');
    if (closeButton instanceof HTMLElement) {
      closeButton.focus({ preventScroll: true });
    }
  };

  if (deckPopup && deckButtons.length > 0) {
    deckPopup.hidden = true;
    if (deckPopupTasks) {
      deckPopupTasks.hidden = true;
    }

    deckButtons.forEach((deckButton) => {
      deckButton.addEventListener('click', () => {
        const deckId = typeof deckButton.dataset.gameDeck === 'string' ? deckButton.dataset.gameDeck.trim() : '';
        let popupContent = '';

        if (deckId.length > 0) {
          const card = drawCardFromDeck(deckId);
          const cardText = getCardText(card);
          if (cardText.length > 0) {
            popupContent = cardText;
          } else if (deckDefinitions[deckId]) {
            popupContent = 'У цій колоді поки немає карт.';
          }
        }

        deckButton.dataset.deckContent = popupContent;

        openDeckPopup(deckButton);
      });
    });

    deckPopup.addEventListener('click', (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest('[data-close-popup]') : null;
      if (target) {
        event.preventDefault();
        closeDeckPopup();
      }
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      const target = finishBtn.dataset.next;
      if (!target) {
        return;
      }
      const resolved = new URL(target, window.location.href);
      window.location.assign(resolved.href);
    });
  }

  setActivePlayer(0);
});
