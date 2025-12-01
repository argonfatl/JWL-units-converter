const {
  Plugin,
  Editor,
  Menu,
  Notice,
  PluginSettingTab,
  Setting,
} = require('obsidian');

// Default settings for biblical units converter
const DEFAULT_SETTINGS = {
  enabledUnits: {
    length: true,
    weight: true,
    volume: true,
    time: true
  },
  findAndConvertUnits: {
    length: true,
    weight: true,
    volume: true,
    time: true
  },
  outputFormat: 'parentheses', // 'parentheses', 'replace', 'inline'
  showOriginal: true,
  precision: 2,
  interfaceLang: 'Russian',
  boldConvertedValues: false, // Bold formatting for converted values
  findAndConvertOutputFormat: 'parentheses', // Separate output format for find and convert
  findAndConvertBoldValues: false, // Separate bold formatting for find and convert
  showMonetaryEquivalent: false // Show modern monetary equivalent for ancient coins
};

// Biblical units of measurement and their modern equivalents
const BIBLICAL_UNITS = {
  // Length units
  length: {
    // Russian
    'палец': { value: 0.0185, unit: 'м', variants: ['пальца', 'пальцев'] },
    'перст': { value: 0.0185, unit: 'м', variants: ['перста', 'персты'] },
    'ладонь': { value: 0.074, unit: 'м', variants: ['ладони', 'ладоней'] },
    'пядь': { value: 0.222, unit: 'м', variants: ['пяди'] },
    'короткий локоть': { value: 0.38, unit: 'м', variants: ['коротких локтей', 'короткого локтя'] },
    'локоть': { value: 0.445, unit: 'м', variants: ['локтей', 'локтя', 'локей'] },
    'длинный локоть': { value: 0.518, unit: 'м', variants: ['длинных локтей', 'длинного локтя'] },
    'сажень': { value: 1.8, unit: 'м', variants: ['сажени', 'саженей'] },
    'трость': { value: 2.67, unit: 'м', variants: ['трости', 'тростей'] },
    'длинная трость': { value: 3.11, unit: 'м', variants: ['длинных тростей', 'длинной трости'] },
    'стадий': { value: 185, unit: 'м', variants: ['стадии', 'стадиев'] },
    'поприще': { value: 1480, unit: 'м', variants: ['поприща'] },

    // English
    'fingerbreadth': { value: 0.0185, unit: 'm', variants: ['fingerbreadths'] },
    'finger': { value: 0.0185, unit: 'm', variants: ['fingers'] },
    'handbreadth': { value: 0.074, unit: 'm', variants: ['handbreadths'] },
    'span': { value: 0.222, unit: 'm', variants: ['spans'] },
    'short cubit': { value: 0.38, unit: 'm', variants: ['short cubits'] },
    'cubit': { value: 0.445, unit: 'm', variants: ['cubits'] },
    'long cubit': { value: 0.518, unit: 'm', variants: ['long cubits'] },
    'fathom': { value: 1.8, unit: 'm', variants: ['fathoms'] },
    'reed': { value: 2.67, unit: 'm', variants: ['reeds'] },
    'long reed': { value: 3.11, unit: 'm', variants: ['long reeds'] },
    'stadium': { value: 185, unit: 'm', variants: ['stadia', 'stadiums'] },
    'furlong': { value: 185, unit: 'm', variants: ['furlongs'] },
    'mile': { value: 1481, unit: 'm', variants: ['miles'] },

    // Spanish
    'dedo': { value: 0.0185, unit: 'm', variants: ['dedos'] },
    'palmo menor': { value: 0.074, unit: 'm', variants: ['palmos menores'] },
    'palmo': { value: 0.222, unit: 'm', variants: ['palmos'] },
    'codo corto': { value: 0.38, unit: 'm', variants: ['codos cortos'] },
    'codo': { value: 0.445, unit: 'm', variants: ['codos'] },
    'codo largo': { value: 0.518, unit: 'm', variants: ['codos largos'] },
    'braza': { value: 1.8, unit: 'm', variants: ['brazas'] },
    'caña': { value: 2.67, unit: 'm', variants: ['cañas'] },
    'caña larga': { value: 3.11, unit: 'm', variants: ['cañas largas'] },
    'estadio': { value: 185, unit: 'm', variants: ['estadios'] },
    'milla': { value: 1479.5, unit: 'm', variants: ['millas'] }
  },

  // Weight units
  weight: {
    // Russian - Hebrew units
    'гера': { value: 0.57, unit: 'г', variants: ['геры', 'гер'] },
    'бека': { value: 5.7, unit: 'г', variants: ['беки'] },
    'пим': { value: 7.8, unit: 'г', variants: ['пима'] },
    'шекель': { value: 11.4, unit: 'г', variants: ['шекеля', 'шекелей'] },
    'сикль': { value: 11.4, unit: 'г', variants: ['сикля', 'сиклей'] },
    'мина': { value: 570, unit: 'г', variants: ['мины', 'мин'] },
    'талант': { value: 34.2, unit: 'кг', variants: ['таланта', 'талантов'] },
    'дарик': { value: 8.4, unit: 'г', variants: ['дарика', 'дариков'] },

    // Russian - Greek and Roman units
    'лепта': { value: 0.34, unit: 'г', variants: ['лепты', 'лепт'] },
    'кодрант': { value: 0.68, unit: 'г', variants: ['кодранта', 'кодрантов'] },
    'ассарий': { value: 2.7, unit: 'г', variants: ['ассария', 'ассариев'] },
    'динарий': { value: 3.85, unit: 'г', variants: ['динария', 'динариев'] },
    'драхма': { value: 3.4, unit: 'г', variants: ['драхмы', 'драхм'] },
    'дидрахма': { value: 6.8, unit: 'г', variants: ['дидрахмы', 'дидрахм'] },
    'тетрадрахма': { value: 13.6, unit: 'г', variants: ['тетрадрахмы', 'тетрадрахм'] },
    'статир': { value: 13.6, unit: 'г', variants: ['статира', 'статиров'] },
    'мина греческая': { value: 340, unit: 'г', variants: ['мины греческой', 'греческих мин'] },
    'талант греческий': { value: 20.4, unit: 'кг', variants: ['таланта греческого', 'греческих талантов'] },
    'фунт': { value: 327, unit: 'г', variants: ['фунта', 'фунтов'] },

    // English - Hebrew units
    'gerah': { value: 0.57, unit: 'g', variants: ['gerahs'] },
    'bekah': { value: 5.7, unit: 'g', variants: ['bekahs'] },
    'pim': { value: 7.8, unit: 'g', variants: ['pims'] },
    'shekel': { value: 11.4, unit: 'g', variants: ['shekels'] },
    'mina': { value: 570, unit: 'g', variants: ['minas'] },
    'talent': { value: 34.2, unit: 'kg', variants: ['talents'] },
    'daric': { value: 8.4, unit: 'g', variants: ['darics'] },

    // English - Greek and Roman units
    'lepton': { value: 0.34, unit: 'g', variants: ['lepta'] },
    'quadrans': { value: 0.68, unit: 'g', variants: ['quadrantes'] },
    'assarius': { value: 2.7, unit: 'g', variants: ['assarii'] },
    'denarius': { value: 3.85, unit: 'g', variants: ['denarii'] },
    'drachma': { value: 3.4, unit: 'g', variants: ['drachmas', 'drachmae'] },
    'didrachma': { value: 6.8, unit: 'g', variants: ['didrachmas'] },
    'tetradrachma': { value: 13.6, unit: 'g', variants: ['tetradrachmas'] },
    'stater': { value: 13.6, unit: 'g', variants: ['staters'] },
    'greek mina': { value: 340, unit: 'g', variants: ['greek minas'] },
    'greek talent': { value: 20.4, unit: 'kg', variants: ['greek talents'] },
    'pound': { value: 327, unit: 'g', variants: ['pounds'] },

    // Spanish - Hebrew units
    'gera': { value: 0.57, unit: 'g', variants: ['geras'] },
    'beca': { value: 5.7, unit: 'g', variants: ['becas'] },
    'pim': { value: 7.8, unit: 'g', variants: ['pims'] },
    'siclo': { value: 11.4, unit: 'g', variants: ['siclos'] },
    'mina': { value: 570, unit: 'g', variants: ['minas'] },
    'talento': { value: 34.2, unit: 'kg', variants: ['talentos'] },
    'dárico': { value: 8.4, unit: 'g', variants: ['dáricos'] },

    // Spanish - Greek and Roman units
    'lepta': { value: 0.34, unit: 'g', variants: ['leptas'] },
    'cuadrante': { value: 0.68, unit: 'g', variants: ['cuadrantes'] },
    'asario': { value: 2.7, unit: 'g', variants: ['asarios'] },
    'denario': { value: 3.85, unit: 'g', variants: ['denarios'] },
    'dracma': { value: 3.4, unit: 'g', variants: ['dracmas'] },
    'didracma': { value: 6.8, unit: 'g', variants: ['didracmas'] },
    'tetradracma': { value: 13.6, unit: 'g', variants: ['tetradracmas'] },
    'estáter': { value: 13.6, unit: 'g', variants: ['estáteres'] },
    'mina griega': { value: 340, unit: 'g', variants: ['minas griegas'] },
    'talento griego': { value: 20.4, unit: 'kg', variants: ['talentos griegos'] },
    'libra': { value: 327, unit: 'g', variants: ['libras'] }
  },

  // Volume units
  volume: {
    // Russian - Liquid measures
    'лог': { value: 0.31, unit: 'л', variants: ['лога', 'логов'] },
    'гин': { value: 3.67, unit: 'л', variants: ['гина', 'гинов'] },
    'бат': { value: 22, unit: 'л', variants: ['бата', 'батов'] },
    'кор': { value: 220, unit: 'л', variants: ['кора', 'коров'] },

    // Russian - Dry measures
    'хиникс': { value: 1.08, unit: 'л', variants: ['хиникса', 'хиниксов'] },
    'каб': { value: 1.22, unit: 'л', variants: ['каба', 'кабов'] },
    'гомор': { value: 2.2, unit: 'л', variants: ['гомера', 'гомеров'] },
    'сата': { value: 7.33, unit: 'л', variants: ['саты', 'сат'] },
    'ефа': { value: 22, unit: 'л', variants: ['ефы', 'еф'] },
    'хомер': { value: 220, unit: 'л', variants: ['хомера', 'хомеров'] },

    // English - Liquid measures
    'log': { value: 0.31, unit: 'l', variants: ['logs'] },
    'hin': { value: 3.67, unit: 'l', variants: ['hins'] },
    'bath': { value: 22, unit: 'l', variants: ['baths'] },
    'cor': { value: 220, unit: 'l', variants: ['cors'] },

    // English - Dry measures
    'choenix': { value: 1.08, unit: 'l', variants: ['choenixes'] },
    'quart': { value: 1.08, unit: 'l', variants: ['quarts'] },
    'cab': { value: 1.22, unit: 'l', variants: ['cabs'] },
    'omer': { value: 2.2, unit: 'l', variants: ['omers'] },
    'seah': { value: 7.33, unit: 'l', variants: ['seahs'] },
    'ephah': { value: 22, unit: 'l', variants: ['ephahs'] },
    'homer': { value: 220, unit: 'l', variants: ['homers'] },

    // Spanish - Liquid measures
    'log': { value: 0.31, unit: 'l', variants: ['logues'] },
    'hin': { value: 3.67, unit: 'l', variants: ['hines'] },
    'bato': { value: 22, unit: 'l', variants: ['batos'] },
    'coro': { value: 220, unit: 'l', variants: ['coros'] },

    // Spanish - Dry measures
    'quénice': { value: 1.08, unit: 'l', variants: ['quénices'] },
    'cab': { value: 1.22, unit: 'l', variants: ['cabes'] },
    'omer': { value: 2.2, unit: 'l', variants: ['omeres'] },
    'sea': { value: 7.33, unit: 'l', variants: ['seas'] },
    'efá': { value: 22, unit: 'l', variants: ['efás'] },
    'homer': { value: 220, unit: 'l', variants: ['homeres'] }
  },

  // Time units
  time: {
    'стража': { value: 3, unit: 'ч', variants: ['стражи', 'страж'] },
    'час': { value: 1, unit: 'ч', variants: ['часа', 'часов'] },
    'день': { value: 1, unit: 'день', variants: ['дня', 'дней'] },
    'неделя': { value: 7, unit: 'дней', variants: ['недели', 'недель'] },
    'месяц': { value: 30, unit: 'дней', variants: ['месяца', 'месяцев'] },
    'год': { value: 365, unit: 'дней', variants: ['года', 'лет'] }
  }
};

// Monetary equivalents for ancient coins (based on silver content and historical wages)
const MONETARY_EQUIVALENTS = {
  // Russian
  'шекель': { workDays: 0.5, modernValue: 25, currency: 'долларов', metal: 'серебро' },
  'сикль': { workDays: 0.5, modernValue: 25, currency: 'долларов', metal: 'серебро' },
  'мина': { workDays: 122, modernValue: 6100, currency: 'долларов', metal: 'серебро' },
  'талант': { workDays: 7300, modernValue: 365000, currency: 'долларов', metal: 'серебро' },
  'динарий': { workDays: 1, modernValue: 50, currency: 'долларов', metal: 'серебро' },
  'драхма': { workDays: 1, modernValue: 45, currency: 'долларов', metal: 'серебро' },
  'дидрахма': { workDays: 2, modernValue: 90, currency: 'долларов', metal: 'серебро' },
  'тетрадрахма': { workDays: 4, modernValue: 180, currency: 'долларов', metal: 'серебро' },
  'статир': { workDays: 4, modernValue: 180, currency: 'долларов', metal: 'серебро' },
  'дарик': { workDays: 20, modernValue: 1000, currency: 'долларов', metal: 'золото' },
  'мина греческая': { workDays: 100, modernValue: 4500, currency: 'долларов', metal: 'серебро' },
  'талант греческий': { workDays: 6000, modernValue: 270000, currency: 'долларов', metal: 'серебро' },

  // English
  'shekel': { workDays: 0.5, modernValue: 25, currency: 'dollars', metal: 'silver' },
  'mina': { workDays: 122, modernValue: 6100, currency: 'dollars', metal: 'silver' },
  'talent': { workDays: 7300, modernValue: 365000, currency: 'dollars', metal: 'silver' },
  'denarius': { workDays: 1, modernValue: 50, currency: 'dollars', metal: 'silver' },
  'drachma': { workDays: 1, modernValue: 45, currency: 'dollars', metal: 'silver' },
  'didrachma': { workDays: 2, modernValue: 90, currency: 'dollars', metal: 'silver' },
  'tetradrachma': { workDays: 4, modernValue: 180, currency: 'dollars', metal: 'silver' },
  'stater': { workDays: 4, modernValue: 180, currency: 'dollars', metal: 'silver' },
  'daric': { workDays: 20, modernValue: 1000, currency: 'dollars', metal: 'gold' },
  'greek mina': { workDays: 100, modernValue: 4500, currency: 'dollars', metal: 'silver' },
  'greek talent': { workDays: 6000, modernValue: 270000, currency: 'dollars', metal: 'silver' },

  // Spanish
  'siclo': { workDays: 0.5, modernValue: 25, currency: 'dólares', metal: 'plata' },
  'mina': { workDays: 122, modernValue: 6100, currency: 'dólares', metal: 'plata' },
  'talento': { workDays: 7300, modernValue: 365000, currency: 'dólares', metal: 'plata' },
  'denario': { workDays: 1, modernValue: 50, currency: 'dólares', metal: 'plata' },
  'dracma': { workDays: 1, modernValue: 45, currency: 'dólares', metal: 'plata' },
  'didracma': { workDays: 2, modernValue: 90, currency: 'dólares', metal: 'plata' },
  'tetradracma': { workDays: 4, modernValue: 180, currency: 'dólares', metal: 'plata' },
  'estáter': { workDays: 4, modernValue: 180, currency: 'dólares', metal: 'plata' },
  'dárico': { workDays: 20, modernValue: 1000, currency: 'dólares', metal: 'oro' },
  'mina griega': { workDays: 100, modernValue: 4500, currency: 'dólares', metal: 'plata' },
  'talento griego': { workDays: 6000, modernValue: 270000, currency: 'dólares', metal: 'plata' }
};

// Hebrew calendar months data
const HEBREW_MONTHS = {
  'нисан': {
    alternativeName: 'авив',
    modernMonths: 'март — апрель',
    events: [
      '**14** Пасха',
      '**15—21** Праздник пресного хлеба',
      '**16** Принесение первых плодов'
    ],
    conditions: 'Иордан разливается от дождей. Таяние снега',
    crops: 'Ячмень',
    variants: ['нисана', 'нисане']
  },
  'авив': {
    alternativeName: 'нисан',
    modernMonths: 'март — апрель',
    events: [
      '**14** Пасха',
      '**15—21** Праздник пресного хлеба',
      '**16** Принесение первых плодов'
    ],
    conditions: 'Иордан разливается от дождей. Таяние снега',
    crops: 'Ячмень',
    variants: ['авива', 'авиве']
  },
  'ияр': {
    alternativeName: 'зив',
    modernMonths: 'апрель — май',
    events: [
      '**14** Вторая Пасха'
    ],
    conditions: 'Начинается засушливый период. Небо в основном ясное',
    crops: 'Пшеница',
    variants: ['ияра', 'ияре']
  },
  'зив': {
    alternativeName: 'ияр',
    modernMonths: 'апрель — май',
    events: [
      '**14** Вторая Пасха'
    ],
    conditions: 'Начинается засушливый период. Небо в основном ясное',
    crops: 'Пшеница',
    variants: ['зива', 'зиве']
  },
  'сиван': {
    modernMonths: 'май — июнь',
    events: [
      '**6** Праздник недель (Пятидесятница)'
    ],
    conditions: 'Летний зной. Ясно',
    crops: 'Пшеница, ранний инжир',
    variants: ['сивана', 'сиване']
  },
  'таммуз': {
    modernMonths: 'июнь — июль',
    events: [],
    conditions: 'Жара усиливается. Местами много росы',
    crops: 'Первый виноград',
    variants: ['таммуза', 'таммузе']
  },
  'ав': {
    modernMonths: 'июль — август',
    events: [],
    conditions: 'Самый жаркий месяц',
    crops: 'Летние фрукты',
    variants: ['ава', 'аве']
  },
  'элул': {
    modernMonths: 'август — сентябрь',
    events: [],
    conditions: 'Жара продолжается',
    crops: 'Финики, виноград, инжир',
    variants: ['элула', 'элуле']
  },
  'тишри': {
    alternativeName: 'этаним',
    modernMonths: 'сентябрь — октябрь',
    events: [
      '**1** День трубного звука',
      '**10** День искупления',
      '**15—21** Праздник шалашей',
      '**22** Торжественное собрание'
    ],
    conditions: 'Конец лета. Начало ранних дождей',
    crops: 'Пахота',
    variants: ['тишри', 'тишре']
  },
  'этаним': {
    alternativeName: 'тишри',
    modernMonths: 'сентябрь — октябрь',
    events: [
      '**1** День трубного звука',
      '**10** День искупления',
      '**15—21** Праздник шалашей',
      '**22** Торжественное собрание'
    ],
    conditions: 'Конец лета. Начало ранних дождей',
    crops: 'Пахота',
    variants: ['этанима', 'этаниме']
  },
  'хешван': {
    alternativeName: 'бул',
    modernMonths: 'октябрь — ноябрь',
    events: [],
    conditions: 'Слабые дожди',
    crops: 'Маслины',
    variants: ['хешвана', 'хешване']
  },
  'бул': {
    alternativeName: 'хешван',
    modernMonths: 'октябрь — ноябрь',
    events: [],
    conditions: 'Слабые дожди',
    crops: 'Маслины',
    variants: ['була', 'буле']
  },
  'кислев': {
    modernMonths: 'ноябрь — декабрь',
    events: [
      '**25** Праздник обновления'
    ],
    conditions: 'Дожди усиливаются. Заморозки. В горах снег',
    crops: 'Стада на зимовке',
    variants: ['кислева', 'кислеве']
  },
  'тевет': {
    modernMonths: 'декабрь — январь',
    events: [],
    conditions: 'Самый холодный месяц. Дождливо. В горах снег',
    crops: 'Появление зелени',
    variants: ['тевета', 'тевете']
  },
  'шеват': {
    modernMonths: 'январь — февраль',
    events: [],
    conditions: 'Становится теплее. Дожди продолжаются',
    crops: 'Цветение миндаля',
    variants: ['шевата', 'шевате']
  },
  'адар': {
    modernMonths: 'февраль — март',
    events: [
      '**14, 15** Пурим'
    ],
    conditions: 'Частые грозы и град',
    crops: 'Лён',
    variants: ['адара', 'адаре']
  },
  'веадар': {
    modernMonths: 'март',
    events: [],
    conditions: 'Этот месяц добавлялся 7 раз в 19 лет',
    crops: '',
    variants: ['веадара', 'веадаре']
  }
};

// Hebrew calendar months data - English
const HEBREW_MONTHS_EN = {
  'nisan': {
    alternativeName: 'Abib',
    modernMonths: 'March—April',
    events: ['**14** Passover', '**15-21** Unleavened Bread', '**16** Offering of firstfruits'],
    conditions: 'Jordan swells from rains, melting snow',
    crops: 'Barley',
    variants: ['nissan']
  },
  'abib': {
    alternativeName: 'Nisan',
    modernMonths: 'March—April',
    events: ['**14** Passover', '**15-21** Unleavened Bread', '**16** Offering of firstfruits'],
    conditions: 'Jordan swells from rains, melting snow',
    crops: 'Barley',
    variants: []
  },
  'iyyar': {
    alternativeName: 'Ziv',
    modernMonths: 'April—May',
    events: ['**14** Late Passover'],
    conditions: 'Dry season begins, mostly clear skies',
    crops: 'Wheat',
    variants: ['iyar']
  },
  'ziv': {
    alternativeName: 'Iyyar',
    modernMonths: 'April—May',
    events: ['**14** Late Passover'],
    conditions: 'Dry season begins, mostly clear skies',
    crops: 'Wheat',
    variants: []
  },
  'sivan': {
    modernMonths: 'May—June',
    events: ['**6** Festival of Weeks (Pentecost)'],
    conditions: 'Summer heat, clear air',
    crops: 'Wheat, early figs',
    variants: []
  },
  'tammuz': {
    modernMonths: 'June—July',
    events: [],
    conditions: 'Heat increases, heavy dews in areas',
    crops: 'First grapes',
    variants: []
  },
  'ab': {
    modernMonths: 'July—August',
    events: [],
    conditions: 'Heat reaches maximum',
    crops: 'Summer fruits',
    variants: ['av']
  },
  'elul': {
    modernMonths: 'August—September',
    events: [],
    conditions: 'Heat continues',
    crops: 'Dates, grapes, and figs',
    variants: []
  },
  'tishri': {
    alternativeName: 'Ethanim',
    modernMonths: 'September—October',
    events: ['**1** Trumpet blast', '**10** Day of Atonement', '**15-21** Festival of Booths', '**22** Solemn assembly'],
    conditions: 'Summer ends, early rains begin',
    crops: 'Plowing',
    variants: []
  },
  'ethanim': {
    alternativeName: 'Tishri',
    modernMonths: 'September—October',
    events: ['**1** Trumpet blast', '**10** Day of Atonement', '**15-21** Festival of Booths', '**22** Solemn assembly'],
    conditions: 'Summer ends, early rains begin',
    crops: 'Plowing',
    variants: []
  },
  'heshvan': {
    alternativeName: 'Bul',
    modernMonths: 'October—November',
    events: [],
    conditions: 'Light rains',
    crops: 'Olives',
    variants: ['cheshvan', 'marcheshvan']
  },
  'bul': {
    alternativeName: 'Heshvan',
    modernMonths: 'October—November',
    events: [],
    conditions: 'Light rains',
    crops: 'Olives',
    variants: []
  },
  'chislev': {
    modernMonths: 'November—December',
    events: ['**25** Festival of Dedication'],
    conditions: 'Rain increases, frost, mountain snows',
    crops: 'Flocks wintered',
    variants: ['kislev']
  },
  'tebeth': {
    modernMonths: 'December—January',
    events: [],
    conditions: 'Maximum cold, rainy, mountain snows',
    crops: 'Vegetation developing',
    variants: ['tevet']
  },
  'shebat': {
    modernMonths: 'January—February',
    events: [],
    conditions: 'Cold weather lessens, rain continues',
    crops: 'Almond blossoms',
    variants: ['shevat']
  },
  'adar': {
    modernMonths: 'February—March',
    events: ['**14, 15** Purim'],
    conditions: 'Frequent thunder and hail',
    crops: 'Flax',
    variants: []
  },
  'veadar': {
    modernMonths: 'March',
    events: [],
    conditions: 'Intercalary month added seven times in 19 years',
    crops: '',
    variants: ['adar sheni', 'adar ii']
  }
};

// Hebrew calendar months data - Spanish
const HEBREW_MONTHS_ES = {
  'nisán': {
    alternativeName: 'Abib',
    modernMonths: 'marzo-abril',
    events: ['**14** Pascua', '**15-21** Panes Sin Levadura', '**16** Ofrenda de las primicias'],
    conditions: 'El Jordán crece por las lluvias y el deshielo',
    crops: 'Cebada',
    variants: ['nisan']
  },
  'abib': {
    alternativeName: 'Nisán',
    modernMonths: 'marzo-abril',
    events: ['**14** Pascua', '**15-21** Panes Sin Levadura', '**16** Ofrenda de las primicias'],
    conditions: 'El Jordán crece por las lluvias y el deshielo',
    crops: 'Cebada',
    variants: []
  },
  'iyar': {
    alternativeName: 'Ziv',
    modernMonths: 'abril-mayo',
    events: ['**14** Pascua tardía'],
    conditions: 'Comienza la temporada seca; cielo generalmente despejado',
    crops: 'Trigo',
    variants: []
  },
  'ziv': {
    alternativeName: 'Iyar',
    modernMonths: 'abril-mayo',
    events: ['**14** Pascua tardía'],
    conditions: 'Comienza la temporada seca; cielo generalmente despejado',
    crops: 'Trigo',
    variants: []
  },
  'siván': {
    modernMonths: 'mayo-junio',
    events: ['**6** Fiesta de las Semanas (Pentecostés)'],
    conditions: 'Hace calor; cielo despejado',
    crops: 'Trigo, brevas',
    variants: ['sivan']
  },
  'tamuz': {
    modernMonths: 'junio-julio',
    events: [],
    conditions: 'Aumenta el calor; abundante rocío en algunas zonas',
    crops: 'Primeras uvas',
    variants: ['tammuz']
  },
  'ab': {
    modernMonths: 'julio-agosto',
    events: [],
    conditions: 'El calor llega a su punto máximo',
    crops: 'Fruta de verano',
    variants: ['av']
  },
  'elul': {
    modernMonths: 'agosto-septiembre',
    events: [],
    conditions: 'Continúa el calor',
    crops: 'Dátiles, higos y uvas',
    variants: []
  },
  'tisri': {
    alternativeName: 'Etanim',
    modernMonths: 'septiembre-octubre',
    events: ['**1** Toque de trompeta', '**10** Día de Expiación', '**15-21** Fiesta de las Cabañas', '**22** Asamblea solemne'],
    conditions: 'Termina el verano; caen las primeras lluvias',
    crops: 'Se ara la tierra',
    variants: ['tishri']
  },
  'etanim': {
    alternativeName: 'Tisri',
    modernMonths: 'septiembre-octubre',
    events: ['**1** Toque de trompeta', '**10** Día de Expiación', '**15-21** Fiesta de las Cabañas', '**22** Asamblea solemne'],
    conditions: 'Termina el verano; caen las primeras lluvias',
    crops: 'Se ara la tierra',
    variants: []
  },
  'hesván': {
    alternativeName: 'Bul',
    modernMonths: 'octubre-noviembre',
    events: [],
    conditions: 'Lluvias ligeras',
    crops: 'Aceitunas',
    variants: ['heshvan', 'jeshvan']
  },
  'bul': {
    alternativeName: 'Hesván',
    modernMonths: 'octubre-noviembre',
    events: [],
    conditions: 'Lluvias ligeras',
    crops: 'Aceitunas',
    variants: []
  },
  'kislev': {
    modernMonths: 'noviembre-diciembre',
    events: ['**25** Fiesta de la Dedicación'],
    conditions: 'Aumentan las lluvias, hay heladas, y nieva en las montañas',
    crops: 'Rebaños puestos a resguardo',
    variants: ['quislev']
  },
  'tebet': {
    modernMonths: 'diciembre-enero',
    events: [],
    conditions: 'Frío máximo; lluvias, y nieve en las montañas',
    crops: 'Crece la vegetación',
    variants: ['tevet']
  },
  'sebat': {
    modernMonths: 'enero-febrero',
    events: [],
    conditions: 'Menos frío; siguen las lluvias',
    crops: 'Almendros en flor',
    variants: ['shevat']
  },
  'adar': {
    modernMonths: 'febrero-marzo',
    events: ['**14, 15** Purim'],
    conditions: 'Frecuentes truenos y granizadas',
    crops: 'Lino',
    variants: []
  },
  'veadar': {
    modernMonths: 'marzo',
    events: [],
    conditions: 'Mes que se añadía 7 veces en 19 años',
    crops: '',
    variants: ['adar sheni', 'adar ii']
  }
};

// Interface strings
const InterfaceStrings = {
  Russian: {
    name: 'Конвертер библейских единиц',
    noSelection: '⚠️ Нет выделенного текста для конвертации.',
    noEditor: '⚠️ Нет активного редактора.',
    conversionComplete: '✅ Конвертация завершена',
    noUnitsFound: 'ℹ️ Библейские единицы измерения не найдены в выделенном тексте.',
    monthInfoAdded: '✅ Информация о месяце добавлена',
    monthNotFound: 'ℹ️ Еврейский месяц не найден в выделенном тексте.',

    // Settings
    settingsTitle: 'Настройки конвертера библейских единиц',
    settingsEnabledUnits: 'Включенные единицы измерения',
    settingsEnabledUnitsDesc: 'Выберите типы единиц для конвертации',
    settingsOutputFormat: 'Формат вывода',
    settingsOutputFormatDesc: 'Как отображать конвертированные значения',
    settingsShowOriginal: 'Показывать оригинальные единицы',
    settingsShowOriginalDesc: 'Сохранять исходные библейские единицы в тексте',
    settingsPrecision: 'Точность (знаков после запятой)',
    settingsPrecisionDesc: 'Количество десятичных знаков в результате',
    settingsMonetaryEquivalent: 'Показывать денежный эквивалент',
    settingsMonetaryEquivalentDesc: 'Отображать современную стоимость древних монет',

    // Menu commands
    menuConvertSelected: 'Конвертировать выделенные единицы',
    menuConvertAll: 'Конвертировать все единицы в документе',

    // Context menu
    menuConvert: 'Конвертировать',
    menuConvertCallout: 'Конвертировать в рамке',
    menuFindAndConvert: 'Найти и конвертировать',
    menuMonthInfo: 'Информация о месяце',
    calloutUnitsTitle: 'Единицы измерения',
    formatParentheses: 'В скобках: локоть (0.44 м)',
    formatReplace: 'Заменить: 0.44 м',
    formatInline: 'Рядом: локоть = 0.44 м',
    settingsBoldValues: 'Жирный шрифт для конвертированных значений',
    settingsBoldValuesDesc: 'Выделять конвертированные значения жирным шрифтом (**значение**)',
    settingsFindAndConvertTitle: 'Настройки для "Найти и конвертировать"',
    settingsFindAndConvertDesc: 'Выберите какие типы единиц будут конвертироваться',
    unitLengthSearch: 'Длина (для поиска)',
    unitLengthSearchDesc: 'Конвертировать единицы длины при поиске',
    unitWeightSearch: 'Вес (для поиска)',
    unitWeightSearchDesc: 'Конвертировать единицы веса при поиске',
    unitVolumeSearch: 'Объём (для поиска)',
    unitVolumeSearchDesc: 'Конвертировать единицы объёма при поиске',
    unitTimeSearch: 'Время (для поиска)',
    unitTimeSearchDesc: 'Конвертировать единицы времени при поиске',
    findAndConvertFormat: 'Формат вывода (для поиска)',
    findAndConvertFormatDesc: 'Как отображать конвертированные значения',
    findAndConvertBold: 'Жирный шрифт (для поиска)',
    findAndConvertBoldDesc: 'Выделять значения жирным шрифтом',
    unitLength: 'Длина',
    unitLengthDesc: 'Конвертировать единицы длины',
    unitWeight: 'Вес',
    unitWeightDesc: 'Конвертировать единицы веса',
    unitVolume: 'Объём',
    unitVolumeDesc: 'Конвертировать единицы объёма',
    unitTime: 'Время',
    unitTimeDesc: 'Конвертировать единицы времени'
  },

  English: {
    name: 'Biblical Units Converter',
    noSelection: '⚠️ No text selected for conversion.',
    noEditor: '⚠️ No active editor.',
    conversionComplete: '✅ Conversion completed',
    noUnitsFound: 'ℹ️ No biblical units found in selected text.',
    monthInfoAdded: '✅ Month information added',
    monthNotFound: 'ℹ️ Hebrew month not found in selected text.',

    // Settings
    settingsTitle: 'Biblical Units Converter Settings',
    settingsEnabledUnits: 'Enabled Units',
    settingsEnabledUnitsDesc: 'Select unit types for conversion',
    settingsOutputFormat: 'Output Format',
    settingsOutputFormatDesc: 'How to display converted values',
    settingsShowOriginal: 'Show Original Units',
    settingsShowOriginalDesc: 'Keep original biblical units in text',
    settingsPrecision: 'Precision (decimal places)',
    settingsPrecisionDesc: 'Number of decimal places in result',
    settingsMonetaryEquivalent: 'Show Monetary Equivalent',
    settingsMonetaryEquivalentDesc: 'Display modern value of ancient coins',

    // Menu commands
    menuConvertSelected: 'Convert Selected Units',
    menuConvertAll: 'Convert All Units in Document',

    // Context menu
    menuConvert: 'Convert',
    menuConvertCallout: 'Convert in Callout',
    menuFindAndConvert: 'Find and Convert',
    menuMonthInfo: 'Month Information',
    calloutUnitsTitle: 'Units of Measurement',
    formatParentheses: 'In brackets: cubit (0.44 m)',
    formatReplace: 'Replace: 0.44 m',
    formatInline: 'Inline: cubit = 0.44 m',
    settingsBoldValues: 'Bold Font for Converted Values',
    settingsBoldValuesDesc: 'Highlight converted values with bold font (**value**)',
    settingsFindAndConvertTitle: 'Settings for "Find and Convert"',
    settingsFindAndConvertDesc: 'Select which unit types will be converted',
    unitLengthSearch: 'Length (for search)',
    unitLengthSearchDesc: 'Convert length units when searching',
    unitWeightSearch: 'Weight (for search)',
    unitWeightSearchDesc: 'Convert weight units when searching',
    unitVolumeSearch: 'Volume (for search)',
    unitVolumeSearchDesc: 'Convert volume units when searching',
    unitTimeSearch: 'Time (for search)',
    unitTimeSearchDesc: 'Convert time units when searching',
    findAndConvertFormat: 'Output Format (for search)',
    findAndConvertFormatDesc: 'How to display converted values',
    findAndConvertBold: 'Bold Font (for search)',
    findAndConvertBoldDesc: 'Highlight values with bold font',
    unitLength: 'Length',
    unitLengthDesc: 'Convert length units',
    unitWeight: 'Weight',
    unitWeightDesc: 'Convert weight units',
    unitVolume: 'Volume',
    unitVolumeDesc: 'Convert volume units',
    unitTime: 'Time',
    unitTimeDesc: 'Convert time units'
  },

  Spanish: {
    name: 'Conversor de Unidades Bíblicas',
    noSelection: '⚠️ No hay texto seleccionado para conversión.',
    noEditor: '⚠️ No hay editor activo.',
    conversionComplete: '✅ Conversión completada',
    // ...
    noUnitsFound: 'ℹ️ No se encontraron unidades bíblicas en el texto seleccionado.',
    monthInfoAdded: '✅ Información del mes añadida',
    monthNotFound: 'ℹ️ Mes hebreo no encontrado en el texto seleccionado.',

    // Settings
    settingsTitle: 'Configuración del Conversor de Unidades Bíblicas',
    settingsEnabledUnits: 'Unidades Habilitadas',
    settingsEnabledUnitsDesc: 'Seleccionar tipos de unidades para conversión',
    settingsOutputFormat: 'Formato de Salida',
    settingsOutputFormatDesc: 'Cómo mostrar los valores convertidos',
    settingsShowOriginal: 'Mostrar Unidades Originales',
    settingsShowOriginalDesc: 'Mantener las unidades bíblicas originales en el texto',
    settingsPrecision: 'Precisión (decimales)',
    settingsPrecisionDesc: 'Número de decimales en el resultado',
    settingsMonetaryEquivalent: 'Mostrar Equivalente Monetario',
    settingsMonetaryEquivalentDesc: 'Mostrar valor moderno de monedas antiguas',

    // Menu commands
    menuConvertSelected: 'Convertir Unidades Seleccionadas',
    menuConvertAll: 'Convertir Todas las Unidades del Documento',

    // Context menu
    menuConvert: 'Convertir',
    menuConvertCallout: 'Convertir en Marco',
    menuFindAndConvert: 'Buscar y Convertir',
    menuMonthInfo: 'Información del Mes',
    calloutUnitsTitle: 'Unidades de Medida',
    formatParentheses: 'En paréntesis: codo (0.44 m)',
    formatReplace: 'Reemplazar: 0.44 m',
    formatInline: 'En línea: codo = 0.44 m',
    settingsBoldValues: 'Fuente Negrita para Valores',
    settingsBoldValuesDesc: 'Resaltar valores con fuente negrita (**valor**)',
    settingsFindAndConvertTitle: 'Configuración para "Buscar y Convertir"',
    settingsFindAndConvertDesc: 'Seleccionar tipos de unidades a convertir',
    unitLengthSearch: 'Longitud (búsqueda)',
    unitLengthSearchDesc: 'Convertir unidades de longitud',
    unitWeightSearch: 'Peso (búsqueda)',
    unitWeightSearchDesc: 'Convertir unidades de peso',
    unitVolumeSearch: 'Volumen (búsqueda)',
    unitVolumeSearchDesc: 'Convertir unidades de volumen',
    unitTimeSearch: 'Tiempo (búsqueda)',
    unitTimeSearchDesc: 'Convertir unidades de tiempo',
    findAndConvertFormat: 'Formato de Salida (búsqueda)',
    findAndConvertFormatDesc: 'Cómo mostrar valores convertidos',
    findAndConvertBold: 'Fuente Negrita (búsqueda)',
    findAndConvertBoldDesc: 'Resaltar valores con negrita',
    unitLength: 'Longitud',
    unitLengthDesc: 'Convertir unidades de longitud',
    unitWeight: 'Peso',
    unitWeightDesc: 'Convertir unidades de peso',
    unitVolume: 'Volumen',
    unitVolumeDesc: 'Convertir unidades de volumen',
    unitTime: 'Tiempo',
    unitTimeDesc: 'Convertir unidades de tiempo'
  }
};

class BiblicalUnitsConverterPlugin extends Plugin {
  constructor() {
    super(...arguments);
    this.settings = {};
    this.menu = new Menu();
    this.menuClass = 'biblical-units-converter-menu-container';
  }

  async onload() {
    await this.loadSettings();

    // Get current interface language
    this.Lang = InterfaceStrings[this.settings.interfaceLang] || InterfaceStrings.Russian;

    // Add commands to command palette
    this.addCommand({
      id: 'convert-selected-units',
      name: this.Lang.menuConvertSelected,
      icon: 'calculator',
      editorCallback: (editor) => this.convertSelectedUnits(editor),
    });

    this.addCommand({
      id: 'convert-all-units',
      name: this.Lang.menuConvertAll,
      icon: 'refresh-cw',
      editorCallback: (editor) => this.convertAllUnits(editor),
    });

    // Create context menu
    this.menu = this.buildMenu();

    // Add global command to open menu
    this.addCommand({
      id: 'biblical-units-menu',
      name: 'Открыть меню конвертера',
      icon: 'calculator',
      editorCallback: (editor) => this.showMenu(editor),
    });

    // Add settings tab
    this.addSettingTab(new BiblicalUnitsSettingTab(this.app, this));

    // Add context menu for right-click on selected text
    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu, editor, view) => {
        const selection = editor.getSelection();
        if (selection) {
          menu.addItem((item) => {
            item.setTitle('Biblical Units Converter').setIcon('calculator');
            const submenu = item.setSubmenu();

            submenu.addItem((subItem) => {
              subItem
                .setTitle(this.Lang.menuConvert)
                .setIcon('calculator')
                .onClick(() => {
                  this.convertSelectedUnits(editor);
                });
            });

            submenu.addItem((subItem) => {
              subItem
                .setTitle(this.Lang.menuConvertCallout)
                .setIcon('quote-glyph')
                .onClick(() => {
                  this.convertSelectedUnitsCallout(editor);
                });
            });

            submenu.addItem((subItem) => {
              subItem
                .setTitle(this.Lang.menuFindAndConvert)
                .setIcon('search')
                .onClick(() => {
                  this.findAndConvertAllUnits(editor);
                });
            });

            submenu.addItem((subItem) => {
              subItem
                .setTitle(this.Lang.menuMonthInfo)
                .setIcon('calendar')
                .onClick(() => {
                  this.convertSelectedMonth(editor);
                });
            });
          });
        }
      })
    );

    console.log('Biblical Units Converter plugin loaded');
  }

  onunload() {
    console.log('Biblical Units Converter plugin unloaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.updateLanguage();
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.updateLanguage();
  }

  // Update interface language
  updateLanguage() {
    this.Lang = InterfaceStrings[this.settings.interfaceLang] || InterfaceStrings.Russian;
    this.menu = this.buildMenu();
  }

  // Build context menu
  buildMenu() {
    const menu = new Menu();

    menu.addItem((item) => {
      item
        .setTitle(this.Lang.menuConvertSelected)
        .setIcon('calculator')
        .onClick(() => {
          const editor = this.app.workspace.getActiveViewOfType(Editor);
          if (editor) {
            this.convertSelectedUnits(editor.editor);
          }
        });
    });

    menu.addItem((item) => {
      item
        .setTitle(this.Lang.menuConvertAll)
        .setIcon('refresh-cw')
        .onClick(() => {
          const editor = this.app.workspace.getActiveViewOfType(Editor);
          if (editor) {
            this.convertAllUnits(editor.editor);
          }
        });
    });

    return menu;
  }

  // Show context menu
  showMenu(editor) {
    if (!editor) {
      new Notice(this.Lang.noEditor);
      return;
    }

    this.menu.showAtMouseEvent(event);
  }

  // Convert selected units
  convertSelectedUnits(editor) {
    if (!editor) {
      new Notice(this.Lang.noEditor);
      return;
    }

    const selection = editor.getSelection();
    if (!selection) {
      new Notice(this.Lang.noSelection);
      return;
    }

    const convertedText = this.convertText(selection);
    if (convertedText !== selection) {
      editor.replaceSelection(convertedText);
      new Notice(this.Lang.conversionComplete);
    } else {
      new Notice(this.Lang.noUnitsFound);
    }
  }

  // Convert all units in document
  convertAllUnits(editor) {
    if (!editor) {
      new Notice(this.Lang.noEditor);
      return;
    }

    const content = editor.getValue();
    const convertedContent = this.convertText(content);

    if (convertedContent !== content) {
      editor.setValue(convertedContent);
      new Notice(this.Lang.conversionComplete);
    } else {
      new Notice(this.Lang.noUnitsFound);
    }
  }

  // Convert selected units with callout format
  convertSelectedUnitsCallout(editor) {
    if (!editor) {
      new Notice(this.Lang.noEditor);
      return;
    }

    const selection = editor.getSelection();
    if (!selection) {
      new Notice(this.Lang.noSelection);
      return;
    }

    const convertedText = this.convertTextWithFormat(selection, 'callout');
    if (convertedText !== selection) {
      editor.replaceSelection(convertedText);
      new Notice(this.Lang.conversionComplete);
    } else {
      new Notice(this.Lang.noUnitsFound);
    }
  }

  // Find and convert all units in document
  findAndConvertAllUnits(editor) {
    if (!editor) {
      new Notice(this.Lang.noEditor);
      return;
    }

    const content = editor.getValue();
    const convertedContent = this.convertTextWithSpecificUnits(content, this.settings.findAndConvertUnits);

    if (convertedContent !== content) {
      editor.setValue(convertedContent);
      new Notice(this.Lang.conversionComplete);
    } else {
      new Notice(this.Lang.noUnitsFound);
    }
  }

  // Convert selected month to Hebrew calendar info
  convertSelectedMonth(editor) {
    if (!editor) {
      new Notice(this.Lang.noEditor);
      return;
    }

    const selection = editor.getSelection();
    if (!selection) {
      new Notice(this.Lang.noSelection);
      return;
    }

    const monthInfo = this.getHebrewMonthInfo(selection.trim().toLowerCase());
    if (monthInfo) {
      editor.replaceSelection(monthInfo);
      new Notice(this.Lang.monthInfoAdded);
    } else {
      new Notice(this.Lang.monthNotFound);
    }
  }

  // Get Hebrew month information
  getHebrewMonthInfo(monthName) {
    const lang = this.settings.interfaceLang;

    // Select the correct months object based on language
    let monthsData;
    if (lang === 'English') {
      monthsData = HEBREW_MONTHS_EN;
    } else if (lang === 'Spanish') {
      monthsData = HEBREW_MONTHS_ES;
    } else {
      monthsData = HEBREW_MONTHS;
    }

    // Try to find the month in the selected language data
    let monthData = monthsData[monthName];

    // If not found, check variants
    if (!monthData) {
      for (const [key, data] of Object.entries(monthsData)) {
        if (data.variants && data.variants.includes(monthName)) {
          monthData = data;
          break;
        }
      }
    }

    if (!monthData) return null;

    const monthTitle = monthName.toUpperCase();
    const alternativeName = monthData.alternativeName ? ` (${monthData.alternativeName.toUpperCase()})` : '';

    // Localized labels
    let monthLabel, eventsLabel, conditionsLabel, cropsLabel;
    if (lang === 'English') {
      monthLabel = 'Month';
      eventsLabel = 'Events';
      conditionsLabel = 'Weather';
      cropsLabel = 'Crops/Activity';
    } else if (lang === 'Spanish') {
      monthLabel = 'Mes';
      eventsLabel = 'Eventos';
      conditionsLabel = 'Clima';
      cropsLabel = 'Cosechas/Actividad';
    } else {
      monthLabel = 'Месяц';
      eventsLabel = 'В этом месяце';
      conditionsLabel = 'Условия';
      cropsLabel = 'Урожай/Деятельность';
    }

    let result = `> [!convert] ${monthLabel} - ${monthTitle}${alternativeName} - (${monthData.modernMonths})\n`;

    if (monthData.events && monthData.events.length > 0) {
      result += `> **${eventsLabel}**\n`;
      monthData.events.forEach(event => {
        result += `> ${event}\n`;
      });
    }

    result += `> **${conditionsLabel}**\n`;
    result += `> ${monthData.conditions}`;

    if (monthData.crops) {
      result += `\n> **${cropsLabel}**\n`;
      result += `> ${monthData.crops}`;
    }

    return result;
  }

  // Get work days text based on language
  getWorkDaysText(workDays) {
    const lang = this.settings.interfaceLang;
    const days = Math.round(workDays);

    if (lang === 'English') {
      if (days < 1) return `${(workDays * 8).toFixed(1)} work hours`;
      if (days === 1) return '1 work day';
      if (days < 365) return `${days} work days`;
      const years = Math.round(days / 365);
      return years === 1 ? '1 year salary' : `${years} years salary`;
    } else if (lang === 'Spanish') {
      if (days < 1) return `${(workDays * 8).toFixed(1)} horas de trabajo`;
      if (days === 1) return '1 día de trabajo';
      if (days < 365) return `${days} días de trabajo`;
      const years = Math.round(days / 365);
      return years === 1 ? '1 año de salario' : `${years} años de salario`;
    } else {
      // Russian
      if (days < 1) return `${(workDays * 8).toFixed(1)} рабочих часов`;
      if (days === 1) return '1 рабочий день';
      if (days < 5) return `${days} рабочих дня`;
      if (days < 365) return `${days} рабочих дней`;
      const years = Math.round(days / 365);
      if (years === 1) return '1 год зарплаты';
      if (years < 5) return `${years} года зарплаты`;
      return `${years} лет зарплаты`;
    }
  }

  // Main text conversion logic
  convertText(text) {
    let convertedText = text;

    console.log('Converting text:', `"${text}"`);

    // Iterate through all unit types
    Object.keys(BIBLICAL_UNITS).forEach(unitType => {
      if (!this.settings.enabledUnits[unitType]) return;

      const units = BIBLICAL_UNITS[unitType];

      Object.keys(units).forEach(unitName => {
        const unitData = units[unitName];
        const allVariants = [unitName, ...unitData.variants];

        // Create regular expression to find units - support both regular and non-breaking spaces
        allVariants.forEach(variant => {
          // Escape special regex characters in variant
          const escapedVariant = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          // Try both regular space and non-breaking space
          const regexNormalSpace = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s+(${escapedVariant})`, 'gi');
          const regexNbsp = new RegExp(`(\\d+(?:[.,]\\d+)?)\\u00A0(${escapedVariant})`, 'gi');

          // Apply both regex patterns
          convertedText = convertedText.replace(regexNormalSpace, (match, number, unit) => {
            console.log(`Converting (normal space): ${match} (number: ${number}, unit: ${unit})`);
            const numValue = parseFloat(number.replace(',', '.'));
            const convertedValue = (numValue * unitData.value).toFixed(this.settings.precision);
            return this.formatConversion(match, convertedValue, unitData.unit, null, unitName);
          });

          convertedText = convertedText.replace(regexNbsp, (match, number, unit) => {
            console.log(`Converting (nbsp): ${match} (number: ${number}, unit: ${unit})`);
            const numValue = parseFloat(number.replace(',', '.'));
            const convertedValue = (numValue * unitData.value).toFixed(this.settings.precision);
            return this.formatConversion(match, convertedValue, unitData.unit, null, unitName);
          });
        });
      });
    });

    console.log('Final result:', `"${convertedText}"`);
    return convertedText;
  }

  // Convert text with specific format
  convertTextWithFormat(text, format) {
    let convertedText = text;

    console.log('Converting text with format:', format, `"${text}"`);

    // Iterate through all unit types
    Object.keys(BIBLICAL_UNITS).forEach(unitType => {
      if (!this.settings.enabledUnits[unitType]) return;

      const units = BIBLICAL_UNITS[unitType];

      Object.keys(units).forEach(unitName => {
        const unitData = units[unitName];
        const allVariants = [unitName, ...unitData.variants];

        // Create regular expression to find units - support both regular and non-breaking spaces
        allVariants.forEach(variant => {
          // Escape special regex characters in variant
          const escapedVariant = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          // Try both regular space and non-breaking space
          const regexNormalSpace = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s+(${escapedVariant})`, 'gi');
          const regexNbsp = new RegExp(`(\\d+(?:[.,]\\d+)?)\\u00A0(${escapedVariant})`, 'gi');

          // Apply both regex patterns
          convertedText = convertedText.replace(regexNormalSpace, (match, number, unit) => {
            console.log(`Converting (normal space): ${match} (number: ${number}, unit: ${unit})`);
            const numValue = parseFloat(number.replace(',', '.'));
            const convertedValue = (numValue * unitData.value).toFixed(this.settings.precision);
            return this.formatConversion(match, convertedValue, unitData.unit, format, unitName);
          });

          convertedText = convertedText.replace(regexNbsp, (match, number, unit) => {
            console.log(`Converting (nbsp): ${match} (number: ${number}, unit: ${unit})`);
            const numValue = parseFloat(number.replace(',', '.'));
            const convertedValue = (numValue * unitData.value).toFixed(this.settings.precision);
            return this.formatConversion(match, convertedValue, unitData.unit, format, unitName);
          });
        });
      });
    });

    console.log('Final result:', `"${convertedText}"`);
    return convertedText;
  }

  // Convert text with specific unit types enabled
  convertTextWithSpecificUnits(text, enabledUnits) {
    let convertedText = text;

    console.log('Converting text with specific units:', enabledUnits, `"${text}"`);

    // Iterate through all unit types
    Object.keys(BIBLICAL_UNITS).forEach(unitType => {
      if (!enabledUnits[unitType]) return;

      const units = BIBLICAL_UNITS[unitType];

      Object.keys(units).forEach(unitName => {
        const unitData = units[unitName];
        const allVariants = [unitName, ...unitData.variants];

        // Create regular expression to find units - support both regular and non-breaking spaces
        allVariants.forEach(variant => {
          // Escape special regex characters in variant
          const escapedVariant = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          // Try both regular space and non-breaking space
          const regexNormalSpace = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s+(${escapedVariant})`, 'gi');
          const regexNbsp = new RegExp(`(\\d+(?:[.,]\\d+)?)\\u00A0(${escapedVariant})`, 'gi');

          // Apply both regex patterns
          convertedText = convertedText.replace(regexNormalSpace, (match, number, unit) => {
            console.log(`Converting (normal space): ${match} (number: ${number}, unit: ${unit})`);
            const numValue = parseFloat(number.replace(',', '.'));
            const convertedValue = (numValue * unitData.value).toFixed(this.settings.precision);
            return this.formatConversionForFindAndConvert(match, convertedValue, unitData.unit);
          });

          convertedText = convertedText.replace(regexNbsp, (match, number, unit) => {
            console.log(`Converting (nbsp): ${match} (number: ${number}, unit: ${unit})`);
            const numValue = parseFloat(number.replace(',', '.'));
            const convertedValue = (numValue * unitData.value).toFixed(this.settings.precision);
            return this.formatConversionForFindAndConvert(match, convertedValue, unitData.unit);
          });
        });
      });
    });

    console.log('Final result:', `"${convertedText}"`);
    return convertedText;
  }

  // Format conversion result
  formatConversion(original, convertedValue, modernUnit, format = null, unitName = null) {
    const outputFormat = format || this.settings.outputFormat;
    let convertedPart = this.settings.boldConvertedValues ?
      `**${convertedValue} ${modernUnit}**` :
      `${convertedValue} ${modernUnit}`;

    // Add monetary equivalent if enabled and unit is a coin
    if (this.settings.showMonetaryEquivalent && unitName && MONETARY_EQUIVALENTS[unitName]) {
      const monetary = MONETARY_EQUIVALENTS[unitName];
      const numValue = parseFloat(original.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(',', '.') || '1');
      const totalValue = Math.round(numValue * monetary.modernValue);
      const workDaysText = this.getWorkDaysText(numValue * monetary.workDays);

      convertedPart += ` ≈ ${workDaysText} ≈ ${totalValue.toLocaleString()} ${monetary.currency} (${monetary.metal})`;
    }

    switch (outputFormat) {
      case 'parentheses':
        return `${original} (${convertedPart})`;
      case 'replace':
        return convertedPart;
      case 'inline':
        return `${original} = ${convertedPart}`;
      case 'callout':
        return `> [!convert] ${this.Lang.calloutUnitsTitle}\n> **${original} = ${convertedPart}**`;
      default:
        return `${original} (${convertedPart})`;
    }
  }

  // Format conversion result for Find and Convert function
  formatConversionForFindAndConvert(original, convertedValue, modernUnit) {
    const outputFormat = this.settings.findAndConvertOutputFormat;
    const convertedPart = this.settings.findAndConvertBoldValues ?
      `**${convertedValue} ${modernUnit}**` :
      `${convertedValue} ${modernUnit}`;

    switch (outputFormat) {
      case 'parentheses':
        return `${original} (${convertedPart})`;
      case 'replace':
        return convertedPart;
      case 'inline':
        return `${original} = ${convertedPart}`;
      default:
        return `${original} (${convertedPart})`;
    }
  }
}

// Plugin settings class
class BiblicalUnitsSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: this.plugin.Lang.settingsTitle });

    // Language setting
    new Setting(containerEl)
      .setName('Interface Language / Язык интерфейса / Idioma de la interfaz')
      .setDesc('Select interface language / Выберите язык интерфейса / Seleccionar idioma de la interfaz')
      .addDropdown(dropdown => dropdown
        .addOption('Russian', 'Русский')
        .addOption('English', 'English')
        .addOption('Spanish', 'Español')
        .setValue(this.plugin.settings.interfaceLang)
        .onChange(async (value) => {
          this.plugin.settings.interfaceLang = value;
          this.plugin.Lang = InterfaceStrings[value] || InterfaceStrings.Russian;
          await this.plugin.saveSettings();
          // Refresh the settings display
          this.display();
        }));

    // Enabled units section header
    containerEl.createEl('h3', { text: this.plugin.Lang.settingsEnabledUnits });
    containerEl.createEl('p', {
      text: this.plugin.Lang.settingsEnabledUnitsDesc,
      cls: 'setting-item-description'
    });

    // Enabled units settings
    new Setting(containerEl)
      .setName(this.plugin.Lang.unitLength)
      .setDesc(this.plugin.Lang.unitLengthDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabledUnits.length)
        .onChange(async (value) => {
          this.plugin.settings.enabledUnits.length = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(this.plugin.Lang.unitWeight)
      .setDesc(this.plugin.Lang.unitWeightDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabledUnits.weight)
        .onChange(async (value) => {
          this.plugin.settings.enabledUnits.weight = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(this.plugin.Lang.unitVolume)
      .setDesc(this.plugin.Lang.unitVolumeDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabledUnits.volume)
        .onChange(async (value) => {
          this.plugin.settings.enabledUnits.volume = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(this.plugin.Lang.unitTime)
      .setDesc(this.plugin.Lang.unitTimeDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabledUnits.time)
        .onChange(async (value) => {
          this.plugin.settings.enabledUnits.time = value;
          await this.plugin.saveSettings();
        }));

    // Output format
    new Setting(containerEl)
      .setName(this.plugin.Lang.settingsOutputFormat)
      .setDesc(this.plugin.Lang.settingsOutputFormatDesc)
      .addDropdown(dropdown => dropdown
        .addOption('parentheses', this.plugin.Lang.formatParentheses)
        .addOption('replace', this.plugin.Lang.formatReplace)
        .addOption('inline', this.plugin.Lang.formatInline)
        .setValue(this.plugin.settings.outputFormat)
        .onChange(async (value) => {
          this.plugin.settings.outputFormat = value;
          await this.plugin.saveSettings();
        }));

    // Precision
    new Setting(containerEl)
      .setName(this.plugin.Lang.settingsPrecision)
      .setDesc(this.plugin.Lang.settingsPrecisionDesc)
      .addSlider(slider => slider
        .setLimits(0, 5, 1)
        .setValue(this.plugin.settings.precision)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.precision = value;
          await this.plugin.saveSettings();
        }));

    // Show original units
    new Setting(containerEl)
      .setName(this.plugin.Lang.settingsShowOriginal)
      .setDesc(this.plugin.Lang.settingsShowOriginalDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showOriginal)
        .onChange(async (value) => {
          this.plugin.settings.showOriginal = value;
          await this.plugin.saveSettings();
        }));

    // Bold converted values
    new Setting(containerEl)
      .setName(this.plugin.Lang.settingsBoldValues)
      .setDesc(this.plugin.Lang.settingsBoldValuesDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.boldConvertedValues)
        .onChange(async (value) => {
          this.plugin.settings.boldConvertedValues = value;
          await this.plugin.saveSettings();
        }));

    // Monetary equivalent setting
    new Setting(containerEl)
      .setName(this.plugin.Lang.settingsMonetaryEquivalent)
      .setDesc(this.plugin.Lang.settingsMonetaryEquivalentDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showMonetaryEquivalent)
        .onChange(async (value) => {
          this.plugin.settings.showMonetaryEquivalent = value;
          await this.plugin.saveSettings();
        }));

    // Separator for Find and Convert settings
    containerEl.createEl('h3', { text: this.plugin.Lang.settingsFindAndConvertTitle });
    containerEl.createEl('p', {
      text: this.plugin.Lang.settingsFindAndConvertDesc,
      cls: 'setting-item-description'
    });

    // Find and Convert units settings
    new Setting(containerEl)
      .setName(this.plugin.Lang.unitLengthSearch)
      .setDesc(this.plugin.Lang.unitLengthSearchDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.findAndConvertUnits.length)
        .onChange(async (value) => {
          this.plugin.settings.findAndConvertUnits.length = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(this.plugin.Lang.unitWeightSearch)
      .setDesc(this.plugin.Lang.unitWeightSearchDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.findAndConvertUnits.weight)
        .onChange(async (value) => {
          this.plugin.settings.findAndConvertUnits.weight = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(this.plugin.Lang.unitVolumeSearch)
      .setDesc(this.plugin.Lang.unitVolumeSearchDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.findAndConvertUnits.volume)
        .onChange(async (value) => {
          this.plugin.settings.findAndConvertUnits.volume = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName(this.plugin.Lang.unitTimeSearch)
      .setDesc(this.plugin.Lang.unitTimeSearchDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.findAndConvertUnits.time)
        .onChange(async (value) => {
          this.plugin.settings.findAndConvertUnits.time = value;
          await this.plugin.saveSettings();
        }));

    // Find and Convert output format
    new Setting(containerEl)
      .setName(this.plugin.Lang.findAndConvertFormat)
      .setDesc(this.plugin.Lang.findAndConvertFormatDesc)
      .addDropdown(dropdown => dropdown
        .addOption('parentheses', this.plugin.Lang.formatParentheses)
        .addOption('replace', this.plugin.Lang.formatReplace)
        .addOption('inline', this.plugin.Lang.formatInline)
        .setValue(this.plugin.settings.findAndConvertOutputFormat)
        .onChange(async (value) => {
          this.plugin.settings.findAndConvertOutputFormat = value;
          await this.plugin.saveSettings();
        }));

    // Find and Convert bold values
    new Setting(containerEl)
      .setName(this.plugin.Lang.findAndConvertBold)
      .setDesc(this.plugin.Lang.findAndConvertBoldDesc)
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.findAndConvertBoldValues)
        .onChange(async (value) => {
          this.plugin.settings.findAndConvertBoldValues = value;
          await this.plugin.saveSettings();
        }));
  }
}

module.exports = BiblicalUnitsConverterPlugin;