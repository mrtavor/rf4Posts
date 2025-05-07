/**
 * База даних зі всіма рибами з гри Russian Fishing 4
 */
const fishDatabase = [
    {
        id: 'giant-shark',
        name: 'Акула гигантская',
        nameVariants: ['акулы гигантской', 'акуле гигантской', 'акулой гигантской'],
        icon: 'images/fish/giant-shark.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'greenland-shark',
        name: 'Акула гренландская полярная',
        nameVariants: ['акулы гренландской полярной', 'акуле гренландской полярной', 'акулой гренландской полярной'],
        icon: 'images/fish/greenland-shark.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'frilled-shark',
        name: 'Акула плащеносная',
        nameVariants: ['акулы плащеносной', 'акуле плащеносной', 'акулой плащеносной'],
        icon: 'images/fish/frilled-shark.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'atlantic-herring-shark',
        name: 'Акула сельдевая атлантическая',
        nameVariants: ['акулы сельдевой атлантической', 'акуле сельдевой атлантической', 'акулой сельдевой атлантической'],
        icon: 'images/fish/atlantic-herring-shark.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'white-amur',
        name: 'Амур белый',
        nameVariants: ['амура белого', 'амуру белому', 'амуром белым'],
        icon: 'images/fish/white-amur.png',
        locations: ['ostrog', 'medvezhye', 'yantarnoe', 'akhtuba', 'donets']
    },
    {
        id: 'black-amur',
        name: 'Амур черный',
        nameVariants: ['амура черного', 'амуру черному', 'амуром черным'],
        icon: 'images/fish/black-amur.png',
        locations: ['ostrog', 'medvezhye']
    },
    {
        id: 'white-eye',
        name: 'Белоглазка',
        nameVariants: ['белоглазки', 'белоглазке', 'белоглазкой'],
        icon: 'images/fish/white-eye.png',
        locations: ['vyunok', 'belaya', 'volhov', 'donets', 'sura', 'ladoga', 'akhtuba']
    },
    {
        id: 'whitefish',
        name: 'Белорыбица',
        nameVariants: ['белорыбицы', 'белорыбице', 'белорыбицей'],
        icon: 'images/fish/whitefish.png',
        locations: ['akhtuba']
    },
    {
        id: 'caspian-beluga',
        name: 'Белуга каспийская',
        nameVariants: ['белуги каспийской', 'белуге каспийской', 'белугой каспийской'],
        icon: 'images/fish/caspian-beluga.png',
        locations: ['akhtuba']
    },
    {
        id: 'black-sea-beluga',
        name: 'Белуга черноморская',
        nameVariants: ['белуги черноморской', 'белуге черноморской', 'белугой черноморской'],
        icon: 'images/fish/black-sea-beluga.png',
        locations: ['donets']
    },
    {
        id: 'european-eelpout',
        name: 'Бельдюга европейская',
        nameVariants: ['бельдюги европейской', 'бельдюге европейской', 'бельдюгой европейской'],
        icon: 'images/fish/european-eelpout.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'bersh',
        name: 'Берш',
        nameVariants: ['берша', 'бершу', 'бершом'],
        icon: 'images/fish/bersh.png',
        locations: ['vyunok', 'sura', 'donets']
    },
    {
        id: 'bigmouth-buffalo',
        name: 'Буффало большеротый',
        nameVariants: ['буффало большеротого', 'буффало большеротому', 'буффало большеротым'],
        icon: 'images/fish/bigmouth-buffalo.png',
        locations: ['akhtuba']
    },
    {
        id: 'black-buffalo',
        name: 'Буффало чёрный',
        nameVariants: ['буффало чёрного', 'буффало чёрному', 'буффало чёрным'],
        icon: 'images/fish/black-buffalo.png',
        locations: ['akhtuba']
    },
    {
        id: 'round-whitefish',
        name: 'Валёк',
        nameVariants: ['валька', 'вальку', 'вальком'],
        icon: 'images/fish/round-whitefish.png',
        locations: ['tunguska', 'yama']
    },
    {
        id: 'caspian-roach',
        name: 'Вобла',
        nameVariants: ['воблы', 'вобле', 'воблой'],
        icon: 'images/fish/caspian-roach.png',
        locations: ['akhtuba']
    },
    {
        id: 'pontic-shad',
        name: 'Вырезуб',
        nameVariants: ['вырезуба', 'вырезубу', 'вырезубом'],
        icon: 'images/fish/pontic-shad.png',
        locations: ['donets']
    },
    {
        id: 'weather-loach',
        name: 'Вьюн',
        nameVariants: ['вьюна', 'вьюну', 'вьюном'],
        icon: 'images/fish/weather-loach.png',
        locations: ['akhtuba']
    },
    {
        id: 'atlantic-footballfish',
        name: 'Гимантолоф атлантический',
        nameVariants: ['гимантолофа атлантического', 'гимантолофу атлантическому', 'гимантолофом атлантическим'],
        icon: 'images/fish/atlantic-footballfish.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'chub',
        name: 'Голавль',
        nameVariants: ['голавля', 'голавлю', 'голавлем'],
        icon: 'images/fish/chub.png',
        locations: ['komarinoe', 'vyunok', 'ostrog', 'belaya', 'medvezhye', 'sura', 'volhov', 'donets', 'ladoga', 'yantarnoe', 'archipelag', 'akhtuba', ]
    },
    {
        id: 'arctic-char',
        name: 'Голец арктический',
        nameVariants: ['гольца арктического', 'гольцу арктическому', 'гольцом арктическим'],
        icon: 'images/fish/arctic-char.png',
        locations: ['kuori', 'tunguska', 'yama']
    },
    {
        id: 'dryagins-char',
        name: 'Голец Дрягина',
        nameVariants: ['гольца Дрягина', 'гольцу Дрягина', 'гольцом Дрягина'],
        icon: 'images/fish/dryagins-char.png',
        locations: ['tunguska']
    },
    {
        id: 'kuor-char',
        name: 'Голец Куорский',
        nameVariants: ['гольца Куорского', 'гольцу Куорскому', 'гольцом Куорским'],
        icon: 'images/fish/kuor-char.png',
        locations: ['kuori']
    },
    {
        id: 'levanidovs-char',
        name: 'Голец Леванидова',
        nameVariants: ['гольца Леванидова', 'гольцу Леванидова', 'гольцом Леванидова'],
        icon: 'images/fish/levanidovs-char.png',
        locations: ['yama']
    },
    {
        id: 'siberian-char-barbel',
        name: 'Голец сибирский-усач',
        nameVariants: ['гольца сибирского-усача', 'гольцу сибирскому-усачу', 'гольцом сибирским-усачом'],
        icon: 'images/fish/siberian-char-barbel.png',
        locations: ['tunguska', 'yama']
    },
    {
        id: 'minnow',
        name: 'Гольян',
        nameVariants: ['гольяна', 'гольяну', 'гольяном'],
        icon: 'images/fish/minnow.png',
        locations: ['tunguska', 'yama']
    },
    {
        id: 'lake-minnow',
        name: 'Гольян озёрный',
        nameVariants: ['гольяна озёрного', 'гольяну озёрному', 'гольяном озёрным'],
        icon: 'images/fish/lake-minnow.png',
        locations: ['tunguska']
    },
    {
        id: 'pink-salmon',
        name: 'Горбуша',
        nameVariants: ['горбуши', 'горбуше', 'горбушей'],
        icon: 'images/fish/pink-salmon.png',
        locations: ['tunguska', 'yama']
    },
    {
        id: 'icelandic-scallop',
        name: 'Гребешок исландский',
        nameVariants: ['гребешка исландского', 'гребешку исландскому', 'гребешком исландским'],
        icon: 'images/fish/icelandic-scallop.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'bream-silver',
        name: 'Густера',
        nameVariants: ['густеры', 'густере', 'густерой'],
        icon: 'images/fish/bream-silver.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba'
        ]
    },
    {
        id: 'river-mussel',
        name: 'Дрейссена речная',
        nameVariants: ['дрейссены речной', 'дрейссене речной', 'дрейссеной речной'],
        icon: 'images/fish/river-mussel.png',
        locations: ['vyunok', 'volhov', 'donets', 'sura', 'akhtuba']
    },
    {
        id: 'dace',
        name: 'Елец',
        nameVariants: ['ельца', 'ельцу', 'ельцом'],
        icon: 'images/fish/dace.png',
        locations: ['vyunok', 'belaya','volhov', 'donets', 'sura', 'ladoga', 'archipelag', 'akhtuba',]
    },
    {
        id: 'dace-siberian',
        name: 'Елец сибирский',
        nameVariants: ['ельца сибирского', 'ельцу сибирскому', 'ельцом сибирским'],
        icon: 'images/fish/dace-siberian.png',
        locations: ['tunguska']
    },
    {
        id: 'ruff',
        name: 'Ёрш',
        nameVariants: ['ёрша', 'ёршу', 'ёршом', 'ерш', 'ершу', 'ершом'],
        icon: 'images/fish/ruff.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'ruff-nosilka',
        name: 'Ёрш-носарь',
        nameVariants: ['ёрша-носаря', 'ёршу-носарю', 'ёршом-носарем'],
        icon: 'images/fish/ruff-nosilka.png',
        locations: ['vyunok', 'donets']
    },
    {
        id: 'asp',
        name: 'Жерех',
        nameVariants: ['жереха', 'жереху', 'жерехом'],
        icon: 'images/fish/asp.png',
        locations: ['vyunok', 'belaya', 'volhov', 'donets', 'sura', 'akhtuba']
    },
    {
        id: 'striped-catfish',
        name: 'Зубатка полосатая',
        nameVariants: ['зубатки полосатой', 'зубатке полосатой', 'зубаткой полосатой'],
        icon: 'images/fish/striped-catfish.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'spotted-catfish',
        name: 'Зубатка пятнистая',
        nameVariants: ['зубатки пятнистой', 'зубатке пятнистой', 'зубаткой пятнистой'],
        icon: 'images/fish/spotted-catfish.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'blue-catfish',
        name: 'Зубатка синяя',
        nameVariants: ['зубатки синей', 'зубатке синей', 'зубаткой синей'],
        icon: 'images/fish/blue-catfish.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'kaluga',
        name: 'Калуга',
        nameVariants: ['калуги', 'калуге', 'калугой'],
        icon: 'images/fish/kaluga.png',
        locations: ['yama']
    },
    {
        id: 'squid',
        name: 'Кальмар обыкновенный',
        nameVariants: ['кальмара обыкновенного', 'кальмару обыкновенному', 'кальмаром обыкновенным'],
        icon: 'images/fish/squid.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'sea-flounder',
        name: 'Камбала морская',
        nameVariants: ['камбалы морской', 'камбале морской', 'камбалой морской'],
        icon: 'images/fish/sea-flounder.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'halibut-flounder',
        name: 'Камбала палтусовидная',
        nameVariants: ['камбалы палтусовидной', 'камбале палтусовидной', 'камбалой палтусовидной'],
        icon: 'images/fish/halibut-flounder.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'proboscis-flounder',
        name: 'Камбала хоботная',
        nameVariants: ['камбалы хоботной', 'камбале хоботной', 'камбалой хоботной'],
        icon: 'images/fish/proboscis-flounder.png',
        locations: ['norwezhskoe']
    },
    {
        id: 'carassius-carp',
        name: 'Карасекарп',
        nameVariants: ['карасекарпа', 'карасекарпу', 'карасекарпом'],
        icon: 'images/fish/carassius-carp.png',
        locations: ['mednoe']
    },
    {
        id: 'golden-carp',
        name: 'Карась золотой',
        nameVariants: ['карася золотого', 'карасю золотому', 'карасем золотым'],
        icon: 'images/fish/golden-carp.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'silver-carp',
        name: 'Карась серебряный',
        nameVariants: ['карася серебряного', 'карасю серебряному', 'карасем серебряным'],
        icon: 'images/fish/silver-carp.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'naked-dinkelbuhl-carp',
        name: 'Карп Динкенбюльский голый',
        nameVariants: ['карпа Динкенбюльского голого', 'карпу Динкенбюльскому голому', 'карпом Динкенбюльским голым'],
        icon: 'images/fish/naked-dinkelbuhl-carp.png',
        locations: ['mednoe']
    },
    {
        id: 'mirror-dinkelbuhl-carp',
        name: 'Карп Динкенбюльский зеркальный',
        nameVariants: ['карпа Динкенбюльского зеркального', 'карпу Динкенбюльскому зеркальному', 'карпом Динкенбюльским зеркальным'],
        icon: 'images/fish/mirror-dinkelbuhl-carp.png',
        locations: ['mednoe']
    },
    {
        id: 'linear-dinkelbuhl-carp',
        name: 'Карп Динкенбюльский линейный',
        nameVariants: ['карпа Динкенбюльского линейного', 'карпу Динкенбюльскому линейному', 'карпом Динкенбюльским линейным'],
        icon: 'images/fish/linear-dinkelbuhl-carp.png',
        locations: ['mednoe']
    },
    {
        id: 'koi-yotsushiro',
        name: 'Карп Кои Ёцусиро',
        nameVariants: ['карпа Кои Ёцусиро', 'карпу Кои Ёцусиро', 'карпом Кои Ёцусиро'],
        icon: 'images/fish/koi-yotsushiro.png',
        locations: ['mednoe']
    },
    {
        id: 'koi-kohaku',
        name: 'Карп Кои Кохаку',
        nameVariants: ['карпа Кои Кохаку', 'карпу Кои Кохаку', 'карпом Кои Кохаку'],
        icon: 'images/fish/koi-kohaku.png',
        locations: ['mednoe']
    },
    {
        id: 'koi-mameshibori-goshiki',
        name: 'Карп Кои Мамэсибори Госики',
        nameVariants: ['карпа Кои Мамэсибори Госики', 'карпу Кои Мамэсибори Госики', 'карпом Кои Мамэсибори Госики'],
        icon: 'images/fish/koi-mameshibori-goshiki.png',
        locations: ['mednoe']
    },
    {
        id: 'koi-narumi-asagi',
        name: 'Карп Кои Наруми Асаги',
        nameVariants: ['карпа Кои Наруми Асаги', 'карпу Кои Наруми Асаги', 'карпом Кои Наруми Асаги'],
        icon: 'images/fish/koi-narumi-asagi.png',
        locations: ['mednoe']
    },
    {
        id: 'koi-orenji-ogon',
        name: 'Карп Кои Орэндзи Огон',
        nameVariants: ['карпа Кои Орэндзи Огон', 'карпу Кои Орэндзи Огон', 'карпом Кои Орэндзи Огон'],
        icon: 'images/fish/koi-orenji-ogon.png',
        locations: ['mednoe']
    },
    {
        id: 'koi-hi-utsuri',
        name: 'Карп Кои Хи Уцури',
        nameVariants: ['карпа Кои Хи Уцури', 'карпу Кои Хи Уцури', 'карпом Кои Хи Уцури'],
        icon: 'images/fish/koi-hi-utsuri.png',
        locations: ['mednoe']
    },
    {
        id: 'super-friks-carp',
        name: 'Карп Супер Фрикс',
        nameVariants: ['карпа Супер Фрикс', 'карпу Супер Фрикс', 'карпом Супер Фрикс'],
        icon: 'images/fish/super-friks-carp.png',
        locations: ['mednoe']
    },
    {
        id: 'naked-carp',
        name: 'Карп голый',
        nameVariants: ['карпа голого', 'карпу голому', 'карпом голым'],
        icon: 'images/fish/naked-carp.png',
        locations: [
            'medvezhye', 
            'yantarnoe', 
            'mednoe']
    },
    {
        id: 'naked-albino-carp',
        name: 'Карп голый - альбинос',
        nameVariants: ['карпа голого - альбиноса', 'карпу голому - альбиносу', 'карпом голым - альбиносом'],
        icon: 'images/fish/naked-albino-carp.png',
        locations: ['medvezhye', 'yantarnoe', 'mednoe']
    },
    {
        id: 'naked-ghost-carp',
        name: 'Карп голый - призрак',
        nameVariants: ['карпа голого - призрака', 'карпу голому - призраку', 'карпом голым - призраком'],
        icon: 'images/fish/naked-ghost-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'mirror-albino-carp',
        name: 'Карп зеркальный - альбинос',
        nameVariants: ['карпа зеркального - альбиноса', 'карпу зеркальному - альбиносу', 'карпом зеркальным - альбиносом'],
        icon: 'images/fish/mirror-albino-carp.png',
        locations: [
            'yantarnoe',
            'mednoe'
        ]
    },
    {
        id: 'mirror-carp',
        name: 'Карп зеркальный',
        nameVariants: ['карпа зеркального', 'карпу зеркальному', 'карпом зеркальным'],
        icon: 'images/fish/mirror-carp.png',
        locations: [
            'medvezhye',
            'yantarnoe'
        ]
    },
    {
        id: 'mirror-ghost-carp',
        name: 'Карп зеркальный - призрак',
        nameVariants: ['карпа зеркального - призрака', 'карпу зеркальному - призраку', 'карпом зеркальным - призраком'],
        icon: 'images/fish/mirror-ghost-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'red-starvas-mirror-carp',
        name: 'Карп красный Старвас - зеркальный',
        nameVariants: ['карпа красного Старвас - зеркального', 'карпу красному Старвас - зеркальному', 'карпом красным Старвас - зеркальным'],
        icon: 'images/fish/red-starvas-mirror-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'red-starvas-scale-carp',
        name: 'Карп красный Старвас - чешуйчатый',
        nameVariants: ['карпа красного Старвас - чешуйчатого', 'карпу красному Старвас - чешуйчатому', 'карпом красным Старвас - чешуйчатым'],
        icon: 'images/fish/red-starvas-scale-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'linear-carp',
        name: 'Карп линейный',
        nameVariants: ['карпа линейного', 'карпу линейному', 'карпом линейным'],
        icon: 'images/fish/linear-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'linear-albino-carp',
        name: 'Карп линейный - альбинос',
        nameVariants: ['карпа линейного - альбиноса', 'карпу линейному - альбиносу', 'карпом линейным - альбиносом'],
        icon: 'images/fish/linear-albino-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'linear-ghost-carp',
        name: 'Карп линейный - призрак',
        nameVariants: ['карпа линейного - призрака', 'карпу линейному - призраку', 'карпом линейным - призраком'],
        icon: 'images/fish/linear-ghost-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'framed-carp',
        name: 'Карп рамчатый',
        nameVariants: ['карпа рамчатого', 'карпу рамчатому', 'карпом рамчатым'],
        icon: 'images/fish/framed-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'framed-albino-carp',
        name: 'Карп рамчатый - альбинос',
        nameVariants: ['карпа рамчатого - альбиноса', 'карпу рамчатому - альбиносу', 'карпом рамчатым - альбиносом'],
        icon: 'images/fish/framed-albino-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'framed-ghost-carp',
        name: 'Карп рамчатый - призрак',
        nameVariants: ['карпа рамчатого - призрака', 'карпу рамчатому - призраку', 'карпом рамчатым - призраком'],
        icon: 'images/fish/framed-ghost-carp.png',
        locations: ['yantarnoe']
    },
    {
        id: 'scale-carp',
        name: 'Карп чешуйчатый',
        nameVariants: ['карпа чешуйчатого', 'карпу чешуйчатому', 'карпом чешуйчатым'],
        icon: 'images/fish/scale-carp.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba'
        ]
    },
    {
        id: 'scale-albino-carp',
        name: 'Карп чешуйчатый - альбинос',
        nameVariants: ['карпа чешуйчатого - альбиноса', 'карпу чешуйчатому - альбиносу', 'карпом чешуйчатым - альбиносом'],
        icon: 'images/fish/scale-albino-carp.png',
        locations: [
            'yantarnoe',
        ]
    },
    {
        id: 'scale-ghost-carp',
        name: 'Карп чешуйчатый - призрак',
        nameVariants: ['карпа чешуйчатого - призрака', 'карпу чешуйчатому - призраку', 'карпом чешуйчатым - призраком'],
        icon: 'images/fish/scale-ghost-carp.png',
        locations: [
            'yantarnoe',
        ]
    },
    {
        id: 'spiny-dogfish',
        name: 'Катран',
        nameVariants: ['катрана', 'катрану', 'катраном'],
        icon: 'images/fish/spiny-dogfish.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'european-sculpin',
        name: 'Керчак европейский',
        nameVariants: ['керчака европейского', 'керчаку европейскому', 'керчаком европейским'],
        icon: 'images/fish/european-sculpin.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'chum-salmon',
        name: 'Кета',
        nameVariants: ['кеты', 'кете', 'кетой'],
        icon: 'images/fish/chum-salmon.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'coho-salmon',
        name: 'Кижуч',
        nameVariants: ['кижуча', 'кижучу', 'кижучем'],
        icon: 'images/fish/coho-salmon.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'nine-spined-stickleback',
        name: 'Колюшка девятииглая',
        nameVariants: ['колюшки девятииглой', 'колюшке девятииглой', 'колюшкой девятииглой'],
        icon: 'images/fish/nine-spined-stickleback.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'southern-stickleback',
        name: 'Колюшка малая южная',
        nameVariants: ['колюшки малой южной', 'колюшке малой южной', 'колюшкой малой южной'],
        icon: 'images/fish/southern-stickleback.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'three-spined-stickleback',
        name: 'Колюшка трёхиглая',
        nameVariants: ['колюшки трёхиглой', 'колюшке трёхиглой', 'колюшкой трёхиглой'],
        icon: 'images/fish/three-spined-stickleback.png',
        locations: [
            'ladoga',
            'archipelag',
            'tunguska',
        ]
    },
    {
        id: 'conger',
        name: 'Конгер',
        nameVariants: ['конгера', 'конгеру', 'конгером'],
        icon: 'images/fish/conger.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'smelt',
        name: 'Корюшка',
        nameVariants: ['корюшки', 'корюшке', 'корюшкой'],
        icon: 'images/fish/smelt.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'asian-smelt',
        name: 'Корюшка азиатская',
        nameVariants: ['корюшки азиатской', 'корюшке азиатской', 'корюшкой азиатской'],
        icon: 'images/fish/asian-smelt.png',
        locations: [
            'tunguska',
            'yama'
        ]
    },
    {
        id: 'king-crab',
        name: 'Краб камчатский',
        nameVariants: ['краба камчатского', 'крабу камчатскому', 'крабом камчатским'],
        icon: 'images/fish/king-crab.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'edible-crab',
        name: 'Краб съедобный',
        nameVariants: ['краба съедобного', 'крабу съедобному', 'крабом съедобным'],
        icon: 'images/fish/edible-crab.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'mongolian-redfin',
        name: 'Краснопёр монгольский',
        nameVariants: ['краснопёра монгольского', 'краснопёру монгольскому', 'краснопёром монгольским'],
        icon: 'images/fish/mongolian-redfin.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'redlip-mullet',
        name: 'Краснопёр-Угай крупночешуйчатый',
        nameVariants: ['краснопёра-Угай крупночешуйчатого', 'краснопёру-Угай крупночешуйчатому', 'краснопёром-Угай крупночешуйчатым'],
        icon: 'images/fish/redlip-mullet.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'rudd',
        name: 'Краснопёрка',
        nameVariants: ['краснопёрки', 'краснопёрке', 'краснопёркой'],
        icon: 'images/fish/rudd.png',
        locations: [
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'kundzha',
        name: 'Кунджа',
        nameVariants: ['кунджи', 'кундже', 'кунджей'],
        icon: 'images/fish/kundzha.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'kutum',
        name: 'Кутум',
        nameVariants: ['кутума', 'кутуму', 'кутумом'],
        icon: 'images/fish/kutum.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'sharp-snouted-lenok',
        name: 'Ленок острорылый',
        nameVariants: ['ленка острорылого', 'ленку острорылому', 'ленком острорылым'],
        icon: 'images/fish/sharp-snouted-lenok.png',
        locations: [
            'tunguska',
            'yama'
        ]
    },
    {
        id: 'blunt-snouted-lenok',
        name: 'Ленок тупорылый',
        nameVariants: ['ленка тупорылого', 'ленку тупорылому', 'ленком тупорылым'],
        icon: 'images/fish/blunt-snouted-lenok.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'bream',
        name: 'Лещ',
        nameVariants: ['леща', 'лещу', 'лещом'],
        icon: 'images/fish/bream.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba'
        ]
    },
    {
        id: 'eastern-bream',
        name: 'Лещ восточный',
        nameVariants: ['леща восточного', 'лещу восточному', 'лещом восточным'],
        icon: 'images/fish/eastern-bream.png',
        locations: [
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'esmark-eelpout',
        name: 'Ликод Эсмарка',
        nameVariants: ['ликода Эсмарка', 'ликоду Эсмарка', 'ликодом Эсмарка'],
        icon: 'images/fish/esmark-eelpout.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'halfnaked-eelpout',
        name: 'Ликод полуголый',
        nameVariants: ['ликода полуголого', 'ликоду полуголому', 'ликодом полуголым'],
        icon: 'images/fish/halfnaked-eelpout.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'kvolsdorf-tench',
        name: 'Линь Квольсдорфский',
        nameVariants: ['линя Квольсдорфского', 'линю Квольсдорфскому', 'линем Квольсдорфским'],
        icon: 'images/fish/kvolsdorf-tench.png',
        locations: [
            'mednoe'
        ]
    },
    {
        id: 'tench',
        name: 'Линь',
        nameVariants: ['линя', 'линю', 'линем'],
        icon: 'images/fish/tench.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'yantarnoe',
            'mednoe',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'golden-tench',
        name: 'Линь золотистый',
        nameVariants: ['линя золотистого', 'линю золотистому', 'линем золотистым'],
        icon: 'images/fish/golden-tench.png',
        locations: [
            'medvezhye'
        ]
    },
    {
        id: 'atlantic-salmon',
        name: 'Лосось атлантический',
        nameVariants: ['лосося атлантического', 'лососю атлантическому', 'лососем атлантическим'],
        icon: 'images/fish/atlantic-salmon.png',
        locations: [
            'volhov',
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'caspian-salmon',
        name: 'Лосось каспийский',
        nameVariants: ['лосося каспийского', 'лососю каспийскому', 'лососем каспийским'],
        icon: 'images/fish/caspian-salmon.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'ladoga-salmon',
        name: 'Лосось ладожский',
        nameVariants: ['лосося ладожского', 'лососю ладожскому', 'лососем ладожским'],
        icon: 'images/fish/ladoga-salmon.png',
        locations: [
            'volhov',
            'ladoga'
        ]
    },
    {
        id: 'frog',
        name: 'Лягушка',
        nameVariants: ['лягушки', 'лягушке', 'лягушкой'],
        icon: 'images/fish/frog.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'atlantic-mackerel',
        name: 'Макрель атлантическая',
        nameVariants: ['макрели атлантической', 'макрели атлантической', 'макрелью атлантической'],
        icon: 'images/fish/atlantic-mackerel.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'northern-grenadier',
        name: 'Макрурус северный',
        nameVariants: ['макруруса северного', 'макрурусу северному', 'макрурусом северным'],
        icon: 'images/fish/northern-grenadier.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'malma',
        name: 'Мальма',
        nameVariants: ['мальмы', 'мальме', 'мальмой'],
        icon: 'images/fish/malma.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'ling',
        name: 'Менёк',
        nameVariants: ['менька', 'меньку', 'меньком'],
        icon: 'images/fish/ling.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'whiting',
        name: 'Мерланг',
        nameVariants: ['мерланга', 'мерлангу', 'мерлангом'],
        icon: 'images/fish/whiting.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'hake',
        name: 'Мерлуза',
        nameVariants: ['мерлузы', 'мерлузе', 'мерлузой'],
        icon: 'images/fish/hake.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'swordfish',
        name: 'Меч-рыба',
        nameVariants: ['меч-рыбы', 'меч-рыбе', 'меч-рыбой'],
        icon: 'images/fish/swordfish.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'mussel',
        name: 'Мидия',
        nameVariants: ['мидии', 'мидии', 'мидией'],
        icon: 'images/fish/mussel.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'mikizha',
        name: 'Микижа',
        nameVariants: ['микижи', 'микиже', 'микижей'],
        icon: 'images/fish/mikizha.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'far-east-brook-lamprey',
        name: 'Минога дальневосточная ручьевая',
        nameVariants: ['миноги дальневосточной ручьевой', 'миноге дальневосточной ручьевой', 'миногой дальневосточной ручьевой'],
        icon: 'images/fish/far-east-brook-lamprey.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'caspian-lamprey',
        name: 'Минога каспийская',
        nameVariants: ['миноги каспийской', 'миноге каспийской', 'миногой каспийской'],
        icon: 'images/fish/caspian-lamprey.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'siberian-lamprey',
        name: 'Минога сибирская',
        nameVariants: ['миноги сибирской', 'миноге сибирской', 'миногой сибирской'],
        icon: 'images/fish/siberian-lamprey.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'three-toothed-lamprey',
        name: 'Минога трёхзубая',
        nameVariants: ['миноги трёхзубой', 'миноге трёхзубой', 'миногой трёхзубой'],
        icon: 'images/fish/three-toothed-lamprey.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'ukrainian-lamprey',
        name: 'Минога украинская',
        nameVariants: ['миноги украинской', 'миноге украинской', 'миногой украинской'],
        icon: 'images/fish/ukrainian-lamprey.png',
        locations: [
            'donets'
        ]
    },
    {
        id: 'blue-ling',
        name: 'Мольва голубая',
        nameVariants: ['мольвы голубой', 'мольве голубой', 'мольвой голубой'],
        icon: 'images/fish/blue-ling.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'common-ling',
        name: 'Мольва обыкновенная',
        nameVariants: ['мольвы обыкновенной', 'мольве обыкновенной', 'мольвой обыкновенной'],
        icon: 'images/fish/common-ling.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'monkfish',
        name: 'Морской чёрт',
        nameVariants: ['морского чёрта', 'морскому чёрту', 'морским чёртом'],
        icon: 'images/fish/monkfish.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'muksun',
        name: 'Муксун',
        nameVariants: ['муксуна', 'муксуну', 'муксуном'],
        icon: 'images/fish/muksun.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'burbot',
        name: 'Налим',
        nameVariants: ['налима', 'налиму', 'налимом'],
        icon: 'images/fish/burbot.png',
        locations: [
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'akhtuba',
            'tunguska',
            'yama'
        ]
    },
    {
        id: 'neiva',
        name: 'Нейва',
        nameVariants: ['нейвы', 'нейве', 'нейвой'],
        icon: 'images/fish/neiva.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'nelma',
        name: 'Нельма',
        nameVariants: ['нельмы', 'нельме', 'нельмой'],
        icon: 'images/fish/nelma.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'sockeye-salmon',
        name: 'Нерка',
        nameVariants: ['нерки', 'нерке', 'неркой'],
        icon: 'images/fish/sockeye-salmon.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'perch',
        name: 'Окунь',
        nameVariants: ['окуня', 'окуню', 'окунем'],
        icon: 'images/fish/perch.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba',
            'tunguska',
            'yama'
        ]
    },
    {
        id: 'stone-perch',
        name: 'Окунь каменный',
        nameVariants: ['окуня каменного', 'окуню каменному', 'окунем каменным'],
        icon: 'images/fish/stone-perch.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'golden-sea-perch',
        name: 'Окунь морской золотистый',
        nameVariants: ['окуня морского золотистого', 'окуню морскому золотистому', 'окунем морским золотистым'],
        icon: 'images/fish/golden-sea-perch.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'norwegian-sea-perch',
        name: 'Окунь морской норвежский',
        nameVariants: ['окуня морского норвежского', 'окуню морскому норвежскому', 'окунем морским норвежским'],
        icon: 'images/fish/norwegian-sea-perch.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'sunfish',
        name: 'Окунь солнечный',
        nameVariants: ['окуня солнечного', 'окуню солнечному', 'окунем солнечным'],
        icon: 'images/fish/sunfish.png',
        locations: [
            'donets'
        ]
    },
    {
        id: 'blackfish',
        name: 'Окунь-клювач',
        nameVariants: ['окуня-клювача', 'окуню-клювачу', 'окунем-клювачом'],
        icon: 'images/fish/blackfish.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'arctic-omul',
        name: 'Омуль арктический',
        nameVariants: ['омуля арктического', 'омулю арктическому', 'омулем арктическим'],
        icon: 'images/fish/arctic-omul.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'baikal-omul',
        name: 'Омуль байкальский',
        nameVariants: ['омуля байкальского', 'омулю байкальскому', 'омулем байкальским'],
        icon: 'images/fish/baikal-omul.png',
        locations: [
            'archipelag',
            'tunguska'
        ]
    },
    {
        id: 'red-opah',
        name: 'Опах краснопёрый',
        nameVariants: ['опаха краснопёрого', 'опаху краснопёрому', 'опахом краснопёрым'],
        icon: 'images/fish/red-opah.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'baltic-sturgeon',
        name: 'Осётр балтийский',
        nameVariants: ['осетра балтийского', 'осетру балтийскому', 'осетром балтийским'],
        icon: 'images/fish/baltic-sturgeon.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'east-siberian-sturgeon',
        name: 'Осётр восточносибирский',
        nameVariants: ['осетра восточносибирского', 'осетру восточносибирскому', 'осетром восточносибирским'],
        icon: 'images/fish/east-siberian-sturgeon.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'ladoga-sturgeon',
        name: 'Осётр ладожский',
        nameVariants: ['осетра ладожского', 'осетру ладожскому', 'осетром ладожским'],
        icon: 'images/fish/ladoga-sturgeon.png',
        locations: [
            'archipelag'
        ]
    },
    {
        id: 'persian-sturgeon',
        name: 'Осётр персидский',
        nameVariants: ['осетра персидского', 'осетру персидскому', 'осетром персидским'],
        icon: 'images/fish/persian-sturgeon.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'russian-sturgeon',
        name: 'Осётр русский',
        nameVariants: ['осетра русского', 'осетру русскому', 'осетром русским'],
        icon: 'images/fish/russian-sturgeon.png',
        locations: [
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'ridge-char',
        name: 'Палия кряжевая',
        nameVariants: ['палии кряжевой', 'палии кряжевой', 'палией кряжевой'],
        icon: 'images/fish/ridge-char.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'sand-bank-char',
        name: 'Палия лудожная',
        nameVariants: ['палии лудожной', 'палии лудожной', 'палией лудожной'],
        icon: 'images/fish/sand-bank-char.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'common-char',
        name: 'Палия обыкновенная',
        nameVariants: ['палии обыкновенной', 'палии обыкновенной', 'палией обыкновенной'],
        icon: 'images/fish/common-char.png',
        locations: [
            'kuori',
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'atlantic-halibut',
        name: 'Палтус атлантический',
        nameVariants: ['палтуса атлантического', 'палтусу атлантическому', 'палтусом атлантическим'],
        icon: 'images/fish/atlantic-halibut.png'
    },
    {
        id: 'blue-halibut',
        name: 'Палтус синекорый',
        nameVariants: ['палтуса синекорого', 'палтусу синекорому', 'палтусом синекорым'],
        icon: 'images/fish/blue-halibut.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'peled',
        name: 'Пелядь',
        nameVariants: ['пеляди', 'пеляди', 'пелядью'],
        icon: 'images/fish/peled.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'pearl-oyster',
        name: 'Перловица',
        nameVariants: ['перловицы', 'перловице', 'перловицей'],
        icon: 'images/fish/pearl-oyster.png',
        locations: [
            'vyunok',
            'belaya',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'common-gudgeon',
        name: 'Пескарь обыкновенный',
        nameVariants: ['пескаря обыкновенного', 'пескарю обыкновенному', 'пескарем обыкновенным'],
        icon: 'images/fish/common-gudgeon.png',
        locations: [
            'vyunok',
            'belaya',
            'volhov',
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'siberian-gudgeon',
        name: 'Пескарь сибирский',
        nameVariants: ['пескаря сибирского', 'пескарю сибирскому', 'пескарем сибирским'],
        icon: 'images/fish/siberian-gudgeon.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'haddock',
        name: 'Пикша',
        nameVariants: ['пикши', 'пикше', 'пикшей'],
        icon: 'images/fish/haddock.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'lumpfish',
        name: 'Пинагор',
        nameVariants: ['пинагора', 'пинагору', 'пинагором'],
        icon: 'images/fish/lumpfish.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'roach',
        name: 'Плотва обыкновенная',
        nameVariants: ['плотвы обыкновенной', 'плотве обыкновенной', 'плотвой обыкновенной'],
        icon: 'images/fish/roach.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'mednoe',
            'akhtuba'
        ]
    },
    {
        id: 'siberian-roach',
        name: 'Плотва сибирская',
        nameVariants: ['плотвы сибирской', 'плотве сибирской', 'плотвой сибирской'],
        icon: 'images/fish/siberian-roach.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'siberian-sculpin',
        name: 'Подкаменщик сибирский',
        nameVariants: ['подкаменщика сибирского', 'подкаменщику сибирскому', 'подкаменщиком сибирским'],
        icon: 'images/fish/siberian-sculpin.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'nase',
        name: 'Подуст',
        nameVariants: ['подуста', 'подусту', 'подустом'],
        icon: 'images/fish/nase.png',
        locations: [
            'vyunok',
            'belaya',
            'volhov',
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'pollack',
        name: 'Поллак',
        nameVariants: ['поллака', 'поллаку', 'поллаком'],
        icon: 'images/fish/pollack.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'caspian-shad',
        name: 'Пузанок каспийский',
        nameVariants: ['пузанка каспийского', 'пузанку каспийскому', 'пузанком каспийским'],
        icon: 'images/fish/caspian-shad.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'northern-blue-whiting',
        name: 'Путассу северная',
        nameVariants: ['путассу северной', 'путассу северной', 'путассу северной'],
        icon: 'images/fish/northern-blue-whiting.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'river-crayfish',
        name: 'Рак речной',
        nameVariants: ['рака речного', 'раку речному', 'раком речным'],
        icon: 'images/fish/river-crayfish.png',
        locations: [
            'vyunok',
            'belaya',
            'volhov',
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'ripus',
        name: 'Рипус',
        nameVariants: ['рипуса', 'рипусу', 'рипусом'],
        icon: 'images/fish/ripus.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'amur-sleeper',
        name: 'Ротан',
        nameVariants: ['ротана', 'ротану', 'ротаном'],
        icon: 'images/fish/amur-sleeper.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'medvezhye',
            'volhov',
            'sura',
            'yantarnoe',
            'mednoe'
        ]
    },
    {
        id: 'vimba',
        name: 'Рыбец',
        nameVariants: ['рыбца', 'рыбцу', 'рыбцом'],
        icon: 'images/fish/vimba.png',
        locations: [
            'volhov',
            'sura',
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'vendace',
        name: 'Ряпушка',
        nameVariants: ['ряпушки', 'ряпушке', 'ряпушкой'],
        icon: 'images/fish/vendace.png',
        locations: [
            'kuori',
            'volhov',
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'siberian-vendace',
        name: 'Ряпушка сибирская',
        nameVariants: ['ряпушки сибирской', 'ряпушке сибирской', 'ряпушкой сибирской'],
        icon: 'images/fish/siberian-vendace.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'wild-carp',
        name: 'Сазан',
        nameVariants: ['сазана', 'сазану', 'сазаном'],
        icon: 'images/fish/wild-carp.png',
        locations: [
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'saithe',
        name: 'Сайда',
        nameVariants: ['сайды', 'сайде', 'сайдой'],
        icon: 'images/fish/saithe.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'atlantic-saury',
        name: 'Сайра атлантическая',
        nameVariants: ['сайры атлантической', 'сайре атлантической', 'сайрой атлантической'],
        icon: 'images/fish/atlantic-saury.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'european-pilchard',
        name: 'Сардина европейская',
        nameVariants: ['сардины европейской', 'сардине европейской', 'сардиной европейской'],
        icon: 'images/fish/european-pilchard.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'stellate-sturgeon',
        name: 'Севрюга',
        nameVariants: ['севрюги', 'севрюге', 'севрюгой'],
        icon: 'images/fish/stellate-sturgeon.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'brazhnikov-herring',
        name: 'Сельдь Бражникова',
        nameVariants: ['сельди Бражникова', 'сельди Бражникова', 'сельдью Бражникова'],
        icon: 'images/fish/brazhnikov-herring.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'kessler-herring',
        name: 'Сельдь Кесслера',
        nameVariants: ['сельди Кесслера', 'сельди Кесслера', 'сельдью Кесслера'],
        icon: 'images/fish/kessler-herring.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'atlantic-herring',
        name: 'Сельдь атлантическая',
        nameVariants: ['сельди атлантической', 'сельди атлантической', 'сельдью атлантической'],
        icon: 'images/fish/atlantic-herring.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'black-sea-herring',
        name: 'Сельдь черноморская',
        nameVariants: ['сельди черноморской', 'сельди черноморской', 'сельдью черноморской'],
        icon: 'images/fish/black-sea-herring.png',
        locations: [
            'donets'
        ]
    },
    {
        id: 'valaam-whitefish',
        name: 'Сиг валаамский',
        nameVariants: ['сига валаамского', 'сигу валаамскому', 'сигом валаамским'],
        icon: 'images/fish/valaam-whitefish.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'volkhov-whitefish',
        name: 'Сиг волховский',
        nameVariants: ['сига волховского', 'сигу волховскому', 'сигом волховским'],
        icon: 'images/fish/volkhov-whitefish.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'vuoksa-whitefish',
        name: 'Сиг вуоксинский',
        nameVariants: ['сига вуоксинского', 'сигу вуоксинскому', 'сигом вуоксинским'],
        icon: 'images/fish/vuoksa-whitefish.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'kuor-whitefish',
        name: 'Сиг куорский',
        nameVariants: ['сига куорского', 'сигу куорскому', 'сигом куорским'],
        icon: 'images/fish/kuor-whitefish.png',
        locations: [
            'kuori'
        ]
    },
    {
        id: 'ladoga-lake-whitefish',
        name: 'Сиг ладожский озёрный',
        nameVariants: ['сига ладожского озёрного', 'сигу ладожскому озёрному', 'сигом ладожским озёрным'],
        icon: 'images/fish/ladoga-lake-whitefish.png',
        locations: [
            'archipelag'
        ]
    },
    {
        id: 'svir-whitefish',
        name: 'Сиг свирский',
        nameVariants: ['сига свирского', 'сигу свирскому', 'сигом свирским'],
        icon: 'images/fish/svir-whitefish.png',
        locations: [
            'archipelag'
        ]
    },
    {
        id: 'black-whitefish',
        name: 'Сиг чёрный',
        nameVariants: ['сига чёрного', 'сигу чёрному', 'сигом чёрным'],
        icon: 'images/fish/black-whitefish.png',
        locations: [
            'archipelag'
        ]
    },
    {
        id: 'ludoga-whitefish',
        name: 'Сиг-лудога',
        nameVariants: ['сига-лудоги', 'сигу-лудоге', 'сигом-лудогой'],
        icon: 'images/fish/ludoga-whitefish.png',
        locations: [
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'pyzyan-whitefish',
        name: 'Сиг-пыжьян',
        nameVariants: ['сига-пыжьяна', 'сигу-пыжьяну', 'сигом-пыжьяном'],
        icon: 'images/fish/pyzyan-whitefish.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'sima',
        name: 'Сима',
        nameVariants: ['симы', 'симе', 'симой'],
        icon: 'images/fish/sima.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'resident-sima',
        name: 'Сима жилая',
        nameVariants: ['симы жилой', 'симе жилой', 'симой жилой'],
        icon: 'images/fish/resident-sima.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'blue-bream',
        name: 'Синец',
        nameVariants: ['синца', 'синцу', 'синцом'],
        icon: 'images/fish/blue-bream.png',
        locations: [
            'vyunok',
            'volhov',
            'sura',
            'ladoga',
            'archipelag',
            'akhtuba',
        ]
    },
    {
        id: 'thorny-skate',
        name: 'Скат колючий',
        nameVariants: ['ската колючего', 'скату колючему', 'скатом колючим'],
        icon: 'images/fish/thorny-skate.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'polar-skate',
        name: 'Скат полярный',
        nameVariants: ['ската полярного', 'скату полярному', 'скатом полярным'],
        icon: 'images/fish/polar-skate.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'catfish',
        name: 'Сом',
        nameVariants: ['сома', 'сому', 'сомом'],
        icon: 'images/fish/catfish.png',
        locations: [
            'vyunok',
            'ostrog',
            'belaya',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'akhtuba'
        ]
    },
    {
        id: 'albino-catfish',
        name: 'Сом альбинос',
        nameVariants: ['сома альбиноса', 'сому альбиносу', 'сомом альбиносом'],
        icon: 'images/fish/albino-catfish.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'amur-catfish',
        name: 'Сом амурский',
        nameVariants: ['сома амурского', 'сому амурскому', 'сомом амурским'],
        icon: 'images/fish/amur-catfish.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'sterlet',
        name: 'Стерлядь',
        nameVariants: ['стерляди', 'стерляди', 'стерлядью'],
        icon: 'images/fish/sterlet.png',
        locations: [
            'belaya',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'siberian-sterlet',
        name: 'Стерлядь сибирская',
        nameVariants: ['стерляди сибирской', 'стерляди сибирской', 'стерлядью сибирской'],
        icon: 'images/fish/siberian-sterlet.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'zander',
        name: 'Судак',
        nameVariants: ['судака', 'судаку', 'судаком'],
        icon: 'images/fish/zander.png',
        locations: [
            'vyunok',
            'belaya',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'archipelag',
            'akhtuba'
        ]
    },
    {
        id: 'huchen',
        name: 'Таймень',
        nameVariants: ['тайменя', 'тайменю', 'тайменем'],
        icon: 'images/fish/huchen.png',
        locations: [
            'belaya',
            'tunguska'
        ]
    },
    {
        id: 'taranka',
        name: 'Тарань',
        nameVariants: ['тарани', 'тарани', 'таранью'],
        icon: 'images/fish/taranka.png',
        locations: [
            'donets'
        ]
    },
    {
        id: 'white-silver-carp',
        name: 'Толстолобик белый',
        nameVariants: ['толстолобика белого', 'толстолобику белому', 'толстолобиком белым'],
        icon: 'images/fish/silver-carp.png',
        locations: [
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'bighead-carp',
        name: 'Толстолобик пёстрый',
        nameVariants: ['толстолобика пёстрого', 'толстолобику пёстрому', 'толстолобиком пёстрым'],
        icon: 'images/fish/bighead-carp.png',
        locations: [
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'atlantic-cod',
        name: 'Треска атлантическая',
        nameVariants: ['трески атлантической', 'треске атлантической', 'треской атлантической'],
        icon: 'images/fish/atlantic-cod.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'tugun',
        name: 'Тугун',
        nameVariants: ['тугуна', 'тугуну', 'тугуном'],
        icon: 'images/fish/tugun.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'blue-tuna',
        name: 'Тунец голубой',
        nameVariants: ['тунца голубого', 'тунцу голубому', 'тунцом голубым'],
        icon: 'images/fish/blue-tuna.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'black-sea-sprat',
        name: 'Тюлька черноморская',
        nameVariants: ['тюльки черноморской', 'тюльке черноморской', 'тюлькой черноморской'],
        icon: 'images/fish/black-sea-sprat.png',
        locations: [
            'donets'
        ]
    },
    {
        id: 'turbot',
        name: 'Тюрбо',
        nameVariants: ['тюрбо', 'тюрбо', 'тюрбо'],
        icon: 'images/fish/turbot.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'eel',
        name: 'Угорь',
        nameVariants: ['угря', 'угрю', 'угрем'],
        icon: 'images/fish/eel.png',
        locations: [
            'ostrog',
            'volhov',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag'
        ]
    },
    {
        id: 'bleak',
        name: 'Уклейка',
        nameVariants: ['уклейки', 'уклейке', 'уклейкой'],
        icon: 'images/fish/bleak.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag'
        ]
    },
    {
        id: 'albino-barbel',
        name: 'Усач альбинос',
        nameVariants: ['усача альбиноса', 'усачу альбиносу', 'усачом альбиносом'],
        icon: 'images/fish/albino-barbel.png',
        locations: [
            'medvezhye'
        ]
    },
    {
        id: 'short-headed-barbel',
        name: 'Усач короткоголовый',
        nameVariants: ['усача короткоголового', 'усачу короткоголовому', 'усачом короткоголовым'],
        icon: 'images/fish/short-headed-barbel.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'common-barbel',
        name: 'Усач обыкновенный',
        nameVariants: ['усача обыкновенного', 'усачу обыкновенному', 'усачом обыкновенным'],
        icon: 'images/fish/common-barbel.png',
        locations: [
            'medvezhye',
            'yantarnoe',
            'mednoe'
        ]
    },
    {
        id: 'european-oyster',
        name: 'Устрица съедобная',
        nameVariants: ['устрицы съедобной', 'устрице съедобной', 'устрицей съедобной'],
        icon: 'images/fish/european-oyster.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'lake-trout',
        name: 'Форель озерная',
        nameVariants: ['озерной форели', 'озерной форели', 'озерной форелью'],
        icon: 'images/fish/lake-trout.png',
        locations: [
            'kuori',
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'rainbow-trout',
        name: 'Форель радужная',
        nameVariants: ['форели радужной', 'форели радужной', 'форелью радужной'],
        icon: 'images/fish/rainbow-trout.png',
        locations: [
            'kuori'
        ]
    },
    {
        id: 'brook-trout',
        name: 'Форель ручьевая',
        nameVariants: ['форели ручьевой', 'форели ручьевой', 'форелью ручьевой'],
        icon: 'images/fish/brook-trout.png',
        locations: [
            'belaya',
            'tunguska'
        ]
    },
    {
        id: 'sevan-trout',
        name: 'Форель севанская',
        nameVariants: ['севанской форели', 'севанской форели', 'севанской форелью'],
        icon: 'images/fish/sevan-trout.png',
        locations: [
            'kuori'
        ]
    },
    {
        id: 'east-siberian-grayling',
        name: 'Хариус восточносибирский',
        nameVariants: ['хариуса восточносибирского', 'хариусу восточносибирскому', 'хариусом восточносибирским'],
        icon: 'images/fish/east-siberian-grayling.png',
        locations: [
            'tunguska',
            'yama'
        ]
    },
    {
        id: 'european-grayling',
        name: 'Хариус европейский',
        nameVariants: ['хариуса европейского', 'хариусу европейскому', 'хариусом европейским'],
        icon: 'images/fish/european-grayling.png',
        locations: [
            'belaya',
            'kuori',
            'ladoga',
            'archipelag'
        ]
    },
    {
        id: 'west-siberian-grayling',
        name: 'Хариус западносибирский',
        nameVariants: ['хариуса западносибирского', 'хариусу западносибирскому', 'хариусом западносибирским'],
        icon: 'images/fish/west-siberian-grayling.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'european-chimaera',
        name: 'Химера европейская',
        nameVariants: ['химеры европейской', 'химере европейской', 'химерой европейской'],
        icon: 'images/fish/european-chimaera.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'black-centrolophus',
        name: 'Центролоф чёрный',
        nameVariants: ['центролофа чёрного', 'центролофу чёрному', 'центролофом чёрным'],
        icon: 'images/fish/black-centrolophus.png',
        locations: [
            'norwezhskoe'
        ]
    },
    {
        id: 'chinook-salmon',
        name: 'Чавыча',
        nameVariants: ['чавычи', 'чавыче', 'чавычей'],
        icon: 'images/fish/chinook-salmon.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'sabre-carp',
        name: 'Чехонь',
        nameVariants: ['чехони', 'чехони', 'чехонью'],
        icon: 'images/fish/sabre-carp.png',
        locations: [
            'donets',
            'sura',
            'akhtuba'
        ]
    },
    {
        id: 'broad-whitefish',
        name: 'Чир',
        nameVariants: ['чира', 'чиру', 'чиром'],
        icon: 'images/fish/broad-whitefish.png',
        locations: [
            'tunguska'
        ]
    },
    {
        id: 'chukuchan',
        name: 'Чукучан',
        nameVariants: ['чукучана', 'чукучану', 'чукучаном'],
        icon: 'images/fish/chukuchan.png',
        locations: [
            'yama'
        ]
    },
    {
        id: 'caspian-shemaya',
        name: 'Шемая каспийская',
        nameVariants: ['шемаи каспийской', 'шемае каспийской', 'шемаей каспийской'],
        icon: 'images/fish/caspian-shemaya.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'black-sea-shemaya',
        name: 'Шемая черноморская',
        nameVariants: ['шемаи черноморской', 'шемае черноморской', 'шемаей черноморской'],
        icon: 'images/fish/black-sea-shemaya.png',
        locations: [
            'donets'
        ]
    },
    {
        id: 'ship-sturgeon',
        name: 'Шип',
        nameVariants: ['шипа', 'шипу', 'шипом'],
        icon: 'images/fish/ship-sturgeon.png',
        locations: [
            'akhtuba'
        ]
    },
    {
        id: 'common-pike',
        name: 'Щука обыкновенная',
        nameVariants: ['щуки обыкновенной', 'щуке обыкновенной', 'щукой обыкновенной'],
        icon: 'images/fish/common-pike.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'akhtuba',
            'tunguska'
        ]
    },
    {
        id: 'ide',
        name: 'Язь',
        nameVariants: ['язя', 'язю', 'язем'],
        icon: 'images/fish/ide.png',
        locations: [
            'komarinoe',
            'vyunok',
            'ostrog',
            'belaya',
            'kuori',
            'medvezhye',
            'volhov',
            'donets',
            'sura',
            'ladoga',
            'yantarnoe',
            'archipelag',
            'akhtuba',
            'mednoe',
            'tunguska'
        ]
    }
];

export { fishDatabase };

// Додаємо базу даних до глобального контексту, якщо код виконується в браузері
if (typeof window !== 'undefined') {
    window.fishDatabase = fishDatabase;
} 