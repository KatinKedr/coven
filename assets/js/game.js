const parseStoredArray = (value) => {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Не удалось прочитать данные из sessionStorage', error);
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
      { id: 1, question: 'Какая твоя самая ведьмовская привычка в реальной жизни?' },
      {
        id: 2,
        question: 'Случалось ли тебе использовать чары — флирт, взгляд, слова — чтобы получить то, что хочешь?',
      },
      { id: 3, question: 'Какое твоё заклинание работает лучше любого магического ритуала?' },
      { id: 4, question: 'Какая тайна из твоего прошлого до сих пор шепчет тебе на ухо?' },
      { id: 5, question: 'Какой поступок ты бы стерла из памяти других, если бы могла?' },
      { id: 6, question: 'Что тебя может свести с ума — восхищение или власть?' },
      { id: 7, question: 'Какая эмоция в тебе самая разрушительная?' },
      { id: 8, question: 'Какое желание ты прячешь, даже от самой себя?' },
      {
        id: 9,
        question: 'Если бы ты могла заколдовать одного человека — кто бы это был и что бы ты с ним сделала?',
      },
      { id: 10, question: 'За что ты могла бы быть осуждена на ведьмовском суде?' },
      {
        id: 11,
        question: 'Кто из присутствующих заслужил бы стать твоим “со-заговорщиком” и почему?',
      },
      { id: 12, question: 'Какое твоё самое соблазнительное оружие?' },
      { id: 13, question: 'Когда ты чувствуешь себя по-настоящему магически привлекательной?' },
      { id: 14, question: 'Какая твоя тёмная сторона тебе даже нравится?' },
      {
        id: 15,
        question: 'Был ли человек, о котором ты думала: “Я могла бы разрушить его жизнь — и это было бы красиво”?',
      },
      { id: 16, question: 'Что ты делала ночью, о чём лучше не рассказывать солнцу?' },
      { id: 17, question: 'Какая “запрещённая” фантазия возвращается к тебе чаще всего?' },
      {
        id: 18,
        question: 'Какой комплимент тебе хочется услышать чаще, но ты боишься признаться в этом?',
      },
      { id: 19, question: 'Что ты считаешь своим самым большим искушением?' },
      {
        id: 20,
        question: 'Если бы твой характер был зельем — какие три ингредиента в нём были бы?',
      },
      {
        id: 21,
        question: 'Что в тебе заставляет людей тянуться к тебе — и отдаляться?',
      },
      { id: 22, question: 'Есть ли человек, которого ты мысленно прокляла? Сработало?' },
      {
        id: 23,
        question: 'Какая часть твоей жизни похожа на заклинание, которое вышло из-под контроля?',
      },
      {
        id: 24,
        question: 'Если бы ты могла изменить прошлое, не потеряв урок — что бы это было?',
      },
      { id: 25, question: 'Какую клятву ты дала себе — и нарушила?' },
      {
        id: 26,
        question: 'Кого из бывших ты бы вызвала обратно — не ради любви, а ради любопытства?',
      },
      {
        id: 27,
        question: 'Что ты когда-нибудь делала, зная, что это разрушит — но всё равно продолжала?',
      },
      { id: 28, question: 'Что ты сделала бы, если бы никто не узнал?' },
      {
        id: 29,
        question: 'Когда ты в последний раз притворялась, что тебе всё равно — хотя не было?',
      },
      {
        id: 30,
        question: 'Кому из присутствующих ты бы доверила тайну, способную тебя разрушить?',
      },
      { id: 31, question: 'Что в тебе самое опасное — твой ум, тело или способность чувствовать?' },
      { id: 32, question: 'Когда ты была самой жестокой — и наслаждалась этим?' },
      { id: 33, question: 'Что ты украла — буквально или символически — и не пожалела?' },
      { id: 34, question: 'Что тебе легче: манипулировать или поддаваться?' },
      {
        id: 35,
        question: 'Когда ты чувствовала, что кто-то читает тебя, как открытую книгу — и это было приятно?',
      },
      { id: 36, question: 'Что ты скрываешь под образом «всё под контролем»?' },
      {
        id: 37,
        question: 'Что бы ты хотела вернуть: человека, чувство или момент?',
      },
      {
        id: 38,
        question: 'Когда ты в последний раз нарочно сделала что-то неправильное — просто ради вкуса греха?',
      },
      { id: 39, question: 'Что тебя возбуждает сильнее — власть или покорность?' },
      { id: 40, question: 'Что бы ты сказала себе десять лет назад?' },
      {
        id: 41,
        question: 'Какое желание ты долго называла «глупостью», пока не поняла, что это именно то, что тебе нужно?',
      },
      {
        id: 42,
        question: 'Если бы Луна могла задать тебе один вопрос — чего бы ты боялась услышать?',
      },
      { id: 43, question: 'Что в тебе — дар, а что — проклятье?' },
      {
        id: 44,
        question: 'Когда ты в последний раз чувствовала себя настоящей ведьмой — уверенной, желанной и чуть опасной?',
      },
      { id: 45, question: 'Есть ли у тебя «священный секрет», о котором никто не знает?' },
      { id: 46, question: 'Любовь без страсти ❤️ или страсть без любви 🔥?' },
      { id: 47, question: 'Предсказать будущее — или переписать прошлое?' },
      { id: 48, question: 'Властвовать над другими — или над собой?' },
      { id: 49, question: 'Никогда не ошибаться — или всегда получать второй шанс?' },
      { id: 50, question: 'Признаться в грехе — или повторить его ещё раз?' },
      { id: 51, question: 'Сказать правду — или произнести красивую ложь?' },
      { id: 52, question: 'Спасти любовь — или сохранить свободу?' },
      { id: 53, question: 'Делать больно — или чувствовать боль?' },
      { id: 54, question: 'Сдаться — или сделать вид, что ты не хотела победы?' },
      { id: 55, question: 'Простить — или наблюдать, как судьба мстит за тебя?' },
      { id: 56, question: 'Стать легендой — или остаться тайной?' },
      {
        id: 57,
        question: 'Получить всё — но потерять вкус к игре, или проиграть — и смеяться?',
      },
      { id: 58, question: 'Отдать силу за любовь — или любовь за силу?' },
      {
        id: 59,
        question: 'Жертвовать собой ради других — или позволять другим жертвовать ради тебя?',
      },
      { id: 60, question: 'Оставаться в тени — или выйти на свет и сгореть?' },
      { id: 61, question: 'Что бы ты выбрала — знать всё или чувствовать всё?' },
      {
        id: 62,
        question: 'Если бы ты могла переродиться ведьмой в другой эпохе — какую бы выбрала?',
      },
    ],
    'main-2': [
      { id: 1, task: 'Сними короткое видео (до 10 сек.), где ты вызываешь вдохновение — как будто заклинанием.' },
      { id: 2, task: 'Сделай селфи, будто ты древняя ведьма, впервые увидевшая смартфон.' },
      {
        id: 3,
        task: 'Позволь ведьмам выбрать фильтр, позу и идею для твоего фото. Без права отказа.',
      },
      { id: 4, task: "Снимите видео 'Передаю телефон человеку, который…'." },
      {
        id: 5,
        task: 'Сделай коллективное фото, где каждая ведьма изображает стихию: огонь, воду, воздух, землю.',
      },
      {
        id: 6,
        task: "Организуй 'ритуал смеха': пусть каждая ведьма скажет слово, которое её смешит.",
      },
      { id: 7, task: "Проведи обряд 'разрушения скуки': сделай то, что никто не ожидал." },
      {
        id: 8,
        task: 'Нарисуй символ дружбы прямо на руках других ведьм (помада, тень, перо — всё подойдёт).',
      },
      { id: 9, task: 'Выбери ведьму и вместе изобразите сцену из прошлого воплощения.' },
      {
        id: 10,
        task: "Объяви 'обряд тостов': каждая ведьма говорит короткое пожелание под аплодисменты.",
      },
      {
        id: 11,
        task: "Обменяйтесь кольцами, браслетами или украшениями 'на удачу до рассвета'.",
      },
      {
        id: 12,
        task: "Напиши послание 'от тени' для каждой ведьмы — пусть они его хранят.",
      },
      {
        id: 13,
        task: "Придумай 'талисман вечера' из подручных предметов — и объясни его силу.",
      },
      { id: 14, task: 'Изобрази ведьму, которую ты бы боялась встретить ночью.' },
      {
        id: 15,
        task: "Подари любой ведьме 'знак силы' — придуманный предмет, фразу или жест, который будет её оберегом.",
      },
      {
        id: 16,
        task: 'Выбери ведьму и сыграй мини-сцену соблазна — без слов, только взглядом и мимикой.',
      },
      { id: 17, task: 'Выбери звук в TikTok и снимите видео.' },
      {
        id: 18,
        task: "Сделай видео 'Я ведьма, которая опаздывает на шабаш' — импровизация приветствуется.",
      },
      {
        id: 19,
        task: "Сними 'аудиоисповедь': три фразы, которые ты никогда бы не сказала трезвой.",
      },
      {
        id: 20,
        task: 'Позволь ведьме задать тебе один вопрос — и ответь без слов, только мимикой.',
      },
      {
        id: 21,
        task: 'Устройте показ мод: сделайте костюмы из подручных материалов и устройте фотосессию.',
      },
      { id: 22, task: 'Снимите видео-пародию на какой-то мультик или фильм.' },
      { id: 23, task: 'Потанцуйте так, будто это обряд экзорцизма.' },
      { id: 24, task: 'Постарайтесь сделать 5 совместных адекватных фото.' },
      { id: 25, task: 'Выбери песню для каждой ведьмы, с которой она ассоциируется.' },
      {
        id: 26,
        task: 'Сделай фото, как будто ты только что совершила преступление и гордишься этим.',
      },
      {
        id: 27,
        task: "Сделай селфи с ведьмой справа — но оба лица должны быть в 'мистических' эмоциях.",
      },
      {
        id: 28,
        task: "Придумай комплимент ведьме напротив, используя слово 'тьма'.",
      },
      {
        id: 29,
        task: "Придумай 'гороскоп' для ведьмы справа — на ближайшие 10 минут.",
      },
      {
        id: 30,
        task: 'Пусть ведьмы выберут случайный предмет, а ты должна придумать, как он спасёт мир.',
      },
      { id: 31, task: 'Придумай девиз для вашего Ковена — и скажи его торжественно.' },
      {
        id: 32,
        task: "Сделай комплимент ведьме справа — но так, будто ты её опасаешься.",
      },
      {
        id: 33,
        task: 'Пусть ведьмы выберут песню, а ты должна спеть 5 секунд максимально страстно.',
      },
      { id: 34, task: "Сфотографируй момент, где видно, что ты 'владеешь ситуацией'." },
      { id: 35, task: 'Придумай имя своему внутреннему демону и представь его группе.' },
      {
        id: 36,
        task: "Изобрази 'ритуал искушения': три движения, одно слово, один взгляд.",
      },
      {
        id: 37,
        task: "Сними видео 'Я — богиня хаоса, уставшая от людских глупостей'.",
      },
      {
        id: 38,
        task: "Придумай 'аромат своего вечера' — опиши его, как будто говоришь о человеке.",
      },
      {
        id: 39,
        task: 'Выбери ведьму и скажи ей три слова, которые, по твоему мнению, могли бы её возбудить.',
      },
      {
        id: 40,
        task: 'Опиши, как бы выглядел идеальный момент страсти — без подробностей, только образы и ощущения.',
      },
      { id: 41, task: "Выбери ведьму и поиграйте в игру 'Ментальная связь'." },
      { id: 42, task: "Скажи: 'Я знаю, что выгляжу невинно, но…' и закончи предложение." },
      {
        id: 43,
        task: 'Придумай самый нелепый способ флирта, который на удивление мог бы сработать.',
      },
      {
        id: 44,
        task: "Сними видео-интервью с 'духом из холодильника', который советует, что поесть.",
      },
      { id: 45, task: "Придумай новую позу для медитации 'на похмелье'. Покажи." },
      { id: 46, task: 'Изобрази, как ты объясняешь Siri, что ты ведьма.' },
      {
        id: 47,
        task: "Позволь ведьмам выбрать саундтрек, под который ты должна войти в комнату 'как королева'.",
      },
      {
        id: 48,
        task: 'Выбери музыку, придумай движения и изобрази идеальный ведьмовской эротичный танец.',
      },
      { id: 49, task: 'Нарисуй портрет других ведьм с закрытыми глазами.' },
      {
        id: 50,
        task: 'Произнеси монолог, будто это твоё последнее слово перед сожжением на костре.',
      },
      {
        id: 51,
        task: "Выбери самый кринжовый звук в TikTok и снимите видео под него с другими ведьмами.",
      },
      {
        id: 52,
        task: "Сними видео 'ритуал вдохновения' — с заклинанием, движением и взглядом.",
      },
      {
        id: 53,
        task: 'Сделай коллективное селфи, где все ведьмы улыбаются как заговорщицы.',
      },
      {
        id: 54,
        task: "Организуй 'ритуал света' — погасите свет и сделайте фото только при свечах.",
      },
      { id: 55, task: "Придумай короткий тост для Ковена — из трёх загадочных слов." },
      { id: 56, task: 'Попроси ведьм назвать твою суперсилу — согласись с любой.' },
      {
        id: 57,
        task: 'Сделай видео, где ты как дух являешься из тумана (импровизация).',
      },
      { id: 58, task: 'Изобрази момент, когда ты поняла, что действительно ведьма.' },
      { id: 59, task: "Придумай и покажи жест 'Призыва Силы' для всего Ковена." },
      {
        id: 60,
        task: 'Объяви минуту тишины — и пусть ведьмы говорят только жестами.',
      },
    ],
    'main-3': [
      { id: 1, task: 'Расскажи про случай, когда судьба вмешалась — вовремя или слишком поздно.' },
      { id: 2, task: 'Вспомни историю, где всё пошло не по плану, но вышло лучше.' },
      { id: 3, task: 'Расскажи, как когда-то случайно получила то, о чём мечтала.' },
      { id: 4, task: 'Был ли день, который начался ужасно, а закончился магически?' },
      { id: 5, task: 'Опиши встречу, которая показалась случайной, но потом изменила многое.' },
      { id: 6, task: 'Расскажи про знак, совпадение или вещь, которую восприняла как послание.' },
      { id: 7, task: "Когда ты в последний раз подумала: 'Это не просто случайность'?" },
      { id: 8, task: 'Что было самым глупым поступком, который ты сделала из-за симпатии?' },
      { id: 9, task: 'Вспомни момент, когда сердце решало быстрее, чем разум.' },
      { id: 10, task: 'Расскажи про свидание, которое пошло не по плану — но запомнилось.' },
      { id: 11, task: 'Был ли кто-то, чьё появление в твоей жизни ощущалось как магия?' },
      { id: 12, task: 'Вспомни момент, когда всё вокруг выглядело как сцена из фильма.' },
      { id: 13, task: 'Расскажи про самую безумную вещь, которую вы сделали с подругами.' },
      { id: 14, task: 'Вспомни момент, когда вы смеялись так, что не могли остановиться.' },
      { id: 15, task: "Что из ваших 'глупых идей' стало лучшим воспоминанием?" },
      {
        id: 16,
        task: "Расскажи про случай, когда вы с кем-то чувствовали, будто против вас весь мир — и вам было всё равно.",
      },
      { id: 17, task: 'Был ли момент, когда вы почувствовали себя героинями фильма?' },
      { id: 18, task: "Вспомни вашу 'внутреннюю шутку', которую никто кроме вас не поймёт." },
      { id: 19, task: 'Какая ваша общая история до сих пор вызывает слёзы от смеха?' },
      { id: 20, task: 'Был ли случай, когда дружба ощущалась как магия сильнее любого ритуала?' },
      { id: 21, task: 'Расскажи о моменте, когда ты осознала, что выросла.' },
      { id: 22, task: 'Был ли день, который ты бы хотела пережить снова — но не изменить?' },
      { id: 23, task: 'Что ты потеряла — и только потом поняла, что это было к лучшему?' },
      { id: 24, task: 'Расскажи историю, которую до сих пор не можешь объяснить логически.' },
      { id: 25, task: 'Был ли сон, который будто подсказал тебе что-то важное?' },
      { id: 26, task: "Расскажи про вещь, которая 'нашла тебя сама'." },
      { id: 27, task: "Вспомни место, где ты чувствовала, будто уже была — хотя не могла." },
      { id: 28, task: 'Какая мелочь из прошлого до сих пор преследует тебя как символ?' },
      { id: 29, task: 'Расскажи о совпадении, которое тебя испугало.' },
      { id: 30, task: 'Какая история в твоей жизни звучит слишком красиво, чтобы быть правдой?' },
      { id: 31, task: 'Вспомни случай, когда вы поссорились — и как помирились.' },
      { id: 32, task: 'Какая история вашей дружбы заслуживает экранизации?' },
      { id: 33, task: 'Что вы сделали вместе, чего бы не решилась в одиночку?' },
      { id: 34, task: "Расскажи о вашей общей 'легенде' — истории, которую вы преувеличиваете каждый раз." },
      { id: 35, task: 'Какая песня навсегда будет вашей?' },
      { id: 36, task: 'Если бы вы могли выбрать символ вашей дружбы — что бы это было?' },
      { id: 37, task: 'Что ты поняла о настоящей дружбе только с возрастом?' },
      { id: 38, task: 'Когда ты почувствовала, что дружба — это тоже форма любви?' },
      { id: 39, task: "Есть ли между вами 'тайная благодарность', о которой вы никогда не говорили?" },
      { id: 40, task: "Вспомни случай, когда вы пытались скрыть от взрослых, что натворили." },
      {
        id: 41,
        task: "Расскажи про вечер, когда вы чувствовали себя 'королевами жизни' — пусть даже с лимонадом в стакане.",
      },
      { id: 42, task: 'Какая ваша школьная или университетская история до сих пор вызывает смех?' },
      {
        id: 43,
        task: "Вспомни момент, когда кто-то из вас впервые сказал: 'Мы слишком взрослые для этого'… и вы сделали это всё равно.",
      },
      { id: 44, task: "Что стало вашим символом безумия — песня, место, предмет?" },
      {
        id: 45,
        task: "Кто из вас всегда начинала авантюры, а кто говорил 'не делай этого'… и всё равно делал?",
      },
      { id: 46, task: "Что из твоих тогдашних 'позоров' сейчас стало смешной легендой?" },
      { id: 47, task: "Что из твоих 'подростковых принципов' сейчас кажется абсурдным?" },
      { id: 48, task: 'Вспомни момент, когда вы чувствовали себя счастливыми просто потому, что были вместе.' },
      { id: 49, task: "Что из вашего тогдашнего 'хаоса' ты сейчас хотела бы вернуть — хоть на вечер?" },
      {
        id: 50,
        task: "Расскажи про ночь, которую ты вспоминаешь каждый раз с улыбкой и фразой 'мы были сумасшедшие'.",
      },
      { id: 51, task: "Какую фразу ты говорила в юности, думая, что звучишь как философ?" },
      { id: 52, task: 'Расскажи про модный образ, который тогда казался шедевром, а теперь больно смотреть.' },
      {
        id: 53,
        task: "Что из твоих 'житейских принципов' 16-летней тебя вызывает у тебя спазм ностальгии?",
      },
      { id: 54, task: "Был ли у тебя 'сценический псевдоним' или ник, от которого теперь неловко?" },
      { id: 55, task: 'Что ты писала в статусах или подписи к фото в старых соцсетях?' },
      {
        id: 56,
        task: "Какая песня была твоим 'жизненным гимном', но теперь ты не можешь её слушать без смеха?",
      },
      {
        id: 57,
        task: "Вспомни момент, когда ты была уверена, что выглядишь загадочно — а выглядела как NPC.",
      },
      {
        id: 58,
        task: "Что ты когда-то писала в дневнике или блокноте, будто это откровение вселенной?",
      },
      {
        id: 59,
        task: "Расскажи про фразу, которую ты ляпнула при чужих родителях или начальстве.",
      },
      { id: 60, task: "Что ты пыталась сделать 'по-тихому', а все услышали?" },
      { id: 61, task: "Был ли случай, когда ты выдала сарказм, а все приняли всерьёз?" },
      { id: 62, task: "Что вы перепутали или сломали, но сделали вид, что 'так и было задумано'?" },
      { id: 63, task: "Расскажи про фразу, которую подруга ляпнула при 'не тех людях'." },
      { id: 64, task: "Что вы сделали вместе, после чего решили 'никогда не вспоминать'." },
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
    decreaseBtn.setAttribute('aria-label', `Отнять балл у ${player.name}`);
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
    increaseBtn.setAttribute('aria-label', `Добавить балл ${player.name}`);
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
        currentEvent === 'ritual' ? 'Время ритуала' : 'Время разгадать загадку';
      parts.push(`${eventLabel}! Возьмите карту из дополнительной колоды.`);
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
      turnStatus.textContent = `Сейчас ход: ${active.name}`;
    } else {
      turnStatus.textContent = 'Выберите, кто ходит первым';
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
      finishNote = `${playersData[triggerIndex].name} набрав(ла) ${finishThreshold} балів! Можна завершити гру або продовжити.`;
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
            popupContent = 'В этой колоде пока нет карт.';
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
