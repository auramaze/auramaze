import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import ItemList from '../components/item-list';
import './search.css';
import request from 'request';
import {API_ENDPOINT} from '../common';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            query: qs.parse(props.location.search, {ignoreQueryPrefix: true}).q,
            items: {art: [], artizen: []}
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        request.get({
            url: `${API_ENDPOINT}/search?q=${encodeURIComponent(this.state.query)}`,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                this.setState({
                    items: {
                        "art": [
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/el-greco/1610/191039.jpg",
                                        "width": 1777,
                                        "height": 2000
                                    }
                                },
                                "id": 10000011,
                                "title": {
                                    "default": "Opening of the fifth seal (The vision of Saint John the Divine)",
                                    "en": "Opening of the fifth seal (The vision of Saint John the Divine)",
                                    "zh": "揭開第五印"
                                },
                                "artist": {
                                    "default": "El Greco",
                                    "en": "El Greco",
                                    "zh": "埃尔·格雷考"
                                },
                                "museum": {
                                    "default": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "en": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "zh": "大都会艺术博物馆"
                                },
                                "completion_year": 1610,
                                "genre": {
                                    "default": "religious painting",
                                    "en": "religious painting"
                                },
                                "style": {
                                    "default": "Mannerism (Late Renaissance)",
                                    "en": "Mannerism (Late Renaissance)",
                                    "zh": "风格主义"
                                },
                                "introduction": [
                                    {
                                        "en": "The Opening of the Fifth Seal (or The Fifth Seal of the Apocalypse or The Vision of Saint John) was painted in the last years of El Greco's life for a side-altar of the church of Saint John the Baptist outside the walls of Toledo. Before 1908 El Greco's painting was referred to as Profane Love. Cossio had doubts about the title and suggested the Opening of the Fifth Seal.[1] The Metropolitan Museum, where the painting is kept, comments: \"the picture is unfinished and much damaged and abraded.\""
                                    },
                                    {
                                        "zh": "《揭开启示录的第五封印信》，又名《揭开第五印》（西班牙语：Visión del Apocalipsis），是西班牙矫饰主义画家艾尔·葛雷柯的名代表作，其晚年绘于托雷多圣若翰洗者教堂的侧祭坛外墙，为塔韦拉医院所委托，但葛雷柯至辞世时仍未完作[1]。1908年以前，画作原名为“世俗的爱”，但随后由科西奥提议更名为“揭开第五印”并沿用至今[2]。画作现藏于美国纽约市大都会艺术博物馆，其为之注解道：“本画未完成，且严重毁坏、磨损。”"
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/rembrandt/1631/220275.jpg",
                                        "width": 734,
                                        "height": 813
                                    }
                                },
                                "id": 10000001,
                                "title": {
                                    "default": "Old Man with a Black Hat and Gorget",
                                    "en": "Old Man with a Black Hat and Gorget"
                                },
                                "artist": {
                                    "default": "Rembrandt",
                                    "en": "Rembrandt",
                                    "zh": "伦勃朗"
                                },
                                "museum": {
                                    "default": "Art Institute of Chicago, Chicago, IL, US",
                                    "en": "Art Institute of Chicago, Chicago, IL, US",
                                    "zh": "芝加哥艺术博物馆"
                                },
                                "completion_year": 1631,
                                "genre": {
                                    "default": "portrait",
                                    "en": "portrait"
                                },
                                "style": {
                                    "default": "Baroque",
                                    "en": "Baroque",
                                    "zh": "巴洛克艺术"
                                },
                                "introduction": null
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/jacques-louis-david/1787/197945.jpg",
                                        "width": 2943,
                                        "height": 1916
                                    }
                                },
                                "id": 10000005,
                                "title": {
                                    "default": "The Death of Socrates",
                                    "en": "The Death of Socrates",
                                    "zh": "苏格拉底之死"
                                },
                                "artist": {
                                    "default": "Jacques-Louis David",
                                    "en": "Jacques-Louis David",
                                    "zh": "雅克-路易·大卫"
                                },
                                "museum": {
                                    "default": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "en": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "zh": "大都会艺术博物馆"
                                },
                                "completion_year": 1787,
                                "genre": {
                                    "default": "history painting",
                                    "en": "history painting",
                                    "zh": "历史画"
                                },
                                "style": {
                                    "default": "Neoclassicism",
                                    "en": "Neoclassicism",
                                    "zh": "新古典主义"
                                },
                                "introduction": [
                                    {
                                        "en": "The Death of Socrates (French: La Mort de Socrate) is an oil on canvas painted by French painter Jacques-Louis David in 1787. The painting focuses on a classical subject like many of his works from that decade, in this case the story of the execution of Socrates as told by Plato in his Phaedo.[1][2] In this story, Socrates has been convicted of corrupting the youth of Athens and introducing strange gods, and has been sentenced to die by drinking poison hemlock. Socrates uses his death as a final lesson for his pupils rather than fleeing when the opportunity arises, and faces it calmly.[1] The Phaedo depicts the death of Socrates and is also Plato's fourth and last dialogue to detail the philosopher's final days, which is also detailed in Euthyphro, Apology, and Crito. In the painting, an old man in a white robe sits upright on a bed, one hand extended over a cup, the other gesturing in the air. He is surrounded by other men of varying ages, most showing emotional distress, unlike the stoic old man. The young man handing him the cup looks the other way, with his face in his free hand. Another young man clutches the thigh of the old man. An elderly man sits at the end of the bed, slumped over and looking in his lap. To the left, other men are seen through an arch set in the background wall."
                                    },
                                    {
                                        "zh": "公元前399年，七十高龄的苏格拉底被控不敬神和腐蚀雅典的年轻人，被判处服毒而死。按照《斐多篇》的记载，面对死亡，苏格拉底非常平静，一如既往地和弟子克里同、斐多、底比斯来的西米亚斯和克贝等人进行哲学讨论，只不过主题成了死亡是什么和死亡之后如何，苏格拉底认为灵魂不朽，将死亡看作一个另外的王国，一个和尘世不同的地方，而非存在的终结"
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/vincent-van-gogh/1887/206763.jpg",
                                        "width": 1778,
                                        "height": 2317
                                    }
                                },
                                "id": 10000010,
                                "title": {
                                    "default": "Self Portrait",
                                    "en": "Self Portrait",
                                    "zh": "自画像"
                                },
                                "artist": {
                                    "default": "Vincent van Gogh",
                                    "en": "Vincent van Gogh",
                                    "zh": "文森特·梵高"
                                },
                                "museum": {
                                    "default": "Detroit Institute of Arts, Detroit, MI, US",
                                    "en": "Detroit Institute of Arts, Detroit, MI, US"
                                },
                                "completion_year": 1887,
                                "genre": {
                                    "default": "self-portrait",
                                    "en": "self-portrait",
                                    "zh": "自画像"
                                },
                                "style": {
                                    "default": "Post-Impressionism",
                                    "en": "Post-Impressionism",
                                    "zh": "后印象派"
                                },
                                "introduction": [
                                    {
                                        "en": "During his time in Paris (1886-1888), Van Gogh painted more than 20 self-portraits. He probably had very little money for models. That led him to take himself as an object of study. Here he portrays himself as an artist in his blue smock-frock. This was what he wore when painting."
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/william-turner/1840/238862.jpg",
                                        "width": 2663,
                                        "height": 1971
                                    }
                                },
                                "id": 10000004,
                                "title": {
                                    "default": "The Slave Ship",
                                    "en": "The Slave Ship",
                                    "zh": "奴隶船"
                                },
                                "artist": {
                                    "default": "William Turner",
                                    "en": "William Turner",
                                    "zh": "约瑟夫·玛罗德·威廉·特纳"
                                },
                                "museum": {
                                    "default": "Museum of Fine Arts (MFA), Boston, MA, US",
                                    "en": "Museum of Fine Arts (MFA), Boston, MA, US",
                                    "zh": "波士顿美术馆"
                                },
                                "completion_year": 1840,
                                "genre": {
                                    "default": "marina",
                                    "en": "marina"
                                },
                                "style": {
                                    "default": "Romanticism",
                                    "en": "Romanticism",
                                    "zh": "浪漫主义"
                                },
                                "introduction": [
                                    {
                                        "en": "The first impression that the painting creates is of an enormous deep-red sunset over a stormy sea, an indication of an approaching typhoon.[3] Upon closer inspection one can discern a ship sailing off into the distance. The masts of the ship are red, matching the blood-red colour of the sky and the sickly copper colour of the water, which serves to blur the lines between various objects in the painting.[2] The ship's sails are also not unfurled, revealing that the ship is preparing for the typhoon. In the foreground can be seen a number of bodies floating in the water; their dark skin and chained hands and feet indicate that they are slaves, thrown overboard from the ship. Looking even more carefully, one can see fish and sea monsters swimming in the water, possibly preparing to eat the slaves, and sea gulls circling overhead above the chaos.Consistent with Turner's emphasis on colour in many of his other works, the painting's central focus is on the interactions of various colours. Few defined brush strokes appear in the painting, and objects, colours, and figures become indistinct. Rather, objects are defined by their colours in the painting, and some objects (like the bodies of the slaves and the incoming storm) have no real border at all, being solely defined by the contrast with the pigments around them. The most prominent colours are the red of the sunset which encroaches into the water and ship as well, and the maroon of the bodies and hands of the slaves.[2]Turner's emphasis on colour rather than design is typical of many Romantic works of the time. The indistinct shapes and the pervasiveness of the sunset's blood-red colour serve to convey a focus on nature and illustrate the idea that nature is superior to man. Other colours in the painting, such as the cool blue of the ocean and the black caps of the water, bring the ocean's hues to life and give the viewer a sense of the true emotions of the natural world. The fact that the figures in the painting are depicted as minuscule and that even the ship is shunted to the background in favour of the water and the sun further serve to decrease the emphasis on humanity and transfer it to nature.[2]By placing the emphasis on nature rather than on figures or objects, Turner evokes the concept of the \"sublime\", coined by Edmund Burke. The idea of the sublime is of the utter powerlessness and terror of humanity in the face of nature; by dramatising the strength of the waves and sun, Turner uses The Slave Ship to encapsulate, perfectly, Burke's definition of the term. Turner's decision to paint the work with a series of quick, frenzied brush strokes rather than carefully defined lines adds to the intensity of the painting, serving to make the viewer feel even more overwhelmed.[2] Though the painting's size is relatively small compared to many Romantic landscape paintings, it still captivates the viewer in arguably a more powerful way.Some viewers have argued that The Slave Ship actually represents Turner's reaction to the Industrial Revolution. The painting might be viewed as an allegory against the exploitation of slaves and other human labour in favour of machines and economic advancement, represented by the coming storm engulfing the cruel captain. However, the storm could also be viewed as a representation of nature's dominance over man and of the ultimate futility in trying to industrialise and advance society."
                                    },
                                    {
                                        "zh": "奴隶船，原名为 Slavers Throwing over the Dead and Dying-Typhoon on the， [1]是英国艺术家 JMW Turner的一幅画，于1840年首次展出。在油中测量35 3/4 x 48 1/4英寸在画布上，它现在在波士顿的美术博物馆。在这个浪漫 海事绘画的典型例子中，特纳描绘了一艘在背景中可见的船，在汹涌的海水中航行，并在其尾迹中漂浮着散落的人形。"
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/caravaggio/1595/186671.jpg",
                                        "width": 1188,
                                        "height": 912
                                    }
                                },
                                "id": 10000007,
                                "title": {
                                    "default": "Denial of Saint Peter",
                                    "en": "Denial of Saint Peter"
                                },
                                "artist": {
                                    "default": "Caravaggio",
                                    "en": "Caravaggio",
                                    "zh": "卡拉瓦乔"
                                },
                                "museum": {
                                    "default": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "en": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "zh": "大都会艺术博物馆"
                                },
                                "completion_year": 1610,
                                "genre": {
                                    "default": "religious painting",
                                    "en": "religious painting"
                                },
                                "style": {
                                    "default": "Baroque",
                                    "en": "Baroque",
                                    "zh": "巴洛克艺术"
                                },
                                "introduction": [
                                    {
                                        "en": "The Denial of Saint Peter (La Negazione di Pietro) is a painting finished around 1610 by the Italian painter Caravaggio. It depicts Peter denying Jesus after Jesus was arrested. The painting is housed in the Metropolitan Museum of Art in New York City."
                                    },
                                    {
                                        "zh": "彼得三次不认主"
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/william-adolphe-bouguereau/1859/232545.jpg",
                                        "width": 844,
                                        "height": 1084
                                    }
                                },
                                "id": 10000008,
                                "title": {
                                    "default": "The Charity",
                                    "en": "The Charity"
                                },
                                "artist": {
                                    "default": "William-Adolphe Bouguereau",
                                    "en": "William-Adolphe Bouguereau",
                                    "zh": "威廉·阿道夫·布格罗"
                                },
                                "museum": {
                                    "default": "University of Michigan Museum of Art (UMMA), Ann Arbor, MI, US",
                                    "en": "University of Michigan Museum of Art (UMMA), Ann Arbor, MI, US"
                                },
                                "completion_year": 1859,
                                "genre": {
                                    "default": "allegorical painting",
                                    "en": "allegorical painting"
                                },
                                "style": {
                                    "default": "Neoclassicism",
                                    "en": "Neoclassicism",
                                    "zh": "新古典主义"
                                },
                                "introduction": null
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/vincent-van-gogh/1887/206786.jpg",
                                        "width": 1758,
                                        "height": 2186
                                    }
                                },
                                "id": 10000009,
                                "title": {
                                    "default": "Self-Portrait",
                                    "en": "Self-Portrait",
                                    "zh": "自画像"
                                },
                                "artist": {
                                    "default": "Vincent van Gogh",
                                    "en": "Vincent van Gogh",
                                    "zh": "文森特·梵高"
                                },
                                "museum": {
                                    "default": "Art Institute of Chicago, Chicago, IL, US",
                                    "en": "Art Institute of Chicago, Chicago, IL, US",
                                    "zh": "芝加哥艺术博物馆"
                                },
                                "completion_year": 1887,
                                "genre": {
                                    "default": "self-portrait",
                                    "en": "self-portrait",
                                    "zh": "自画像"
                                },
                                "style": {
                                    "default": "Post-Impressionism",
                                    "en": "Post-Impressionism",
                                    "zh": "后印象派"
                                },
                                "introduction": [
                                    {
                                        "en": "Vincent van Gogh is instantly recognizable by his reddish hair and beard, his gaunt features, and intense gaze. Van Gogh painted some 36 self-portraits in the space of only ten years. Perhaps only Rembrandt produced more, and his career spanned decades. For many artists, like Rembrandt and Van Gogh, the self-portrait was a critical exploration of personal realization and aesthetic achievement."
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/caravaggio/1595/186648.jpg",
                                        "width": 949,
                                        "height": 708
                                    }
                                },
                                "id": 10000006,
                                "title": {
                                    "default": "Musicians",
                                    "en": "Musicians",
                                    "zh": "音乐家"
                                },
                                "artist": {
                                    "default": "Caravaggio",
                                    "en": "Caravaggio",
                                    "zh": "卡拉瓦乔"
                                },
                                "museum": {
                                    "default": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "en": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "zh": "大都会艺术博物馆"
                                },
                                "completion_year": 1595,
                                "genre": {
                                    "default": "genre painting",
                                    "en": "genre painting"
                                },
                                "style": {
                                    "default": "Baroque",
                                    "en": "Baroque",
                                    "zh": "巴洛克艺术"
                                },
                                "introduction": [
                                    {
                                        "en": "The Musicians or Concert of Youths (c. 1595) is a painting by the Italian Baroque master Michelangelo Merisi da Caravaggio (1571–1610). It is held in the Metropolitan Museum of Art, New York, where it has been since 1952. It underwent extensive restoration in 1983.[1]Caravaggio entered the household of Cardinal Francesco Maria Del Monte sometime in 1595, and The Musicians is thought to have been his first painting done expressly for the cardinal. His biographer, the painter Baglione, says he \"painted for the Cardinal youths playing music very well drawn from nature and also a youth playing a lute,\" the latter presumably being The Lute Player, which seems to form a companion-piece to The Musicians.The picture shows four boys in quasi-Classical costume, three playing various musical instruments or singing, the fourth dressed as Cupid and reaching towards a bunch of grapes.Caravaggio seems to have composed the painting from studies of two figures.[2] The central figure with the lute has been identified with Caravaggio's companion Mario Minniti, and the individual next to him and facing the viewer is possibly a self-portrait of the artist.[1] The cupid bears a strong resemblance to the boy in Boy Peeling Fruit, done a few years before, and also to the angel in Saint Francis of Assisi in Ecstasy.The manuscripts show that the boys are practicing madrigals celebrating love, and the eyes of the lutenist, the principal figure, are moist with tears—the songs presumably describe the sorrow of love rather than its pleasures. The violin in the foreground suggests a fifth participant, implicitly including the viewer in the tableau.[1]Scenes showing musicians were a popular theme at the time—the Church was supporting a revival of music and new styles and forms were being tried, especially by educated and progressive prelates such as Del Monte. This scene, however, is clearly secular rather than religious, and harks back to the long-established tradition of \"concert\" pictures, a genre originating in Venice and exemplified, in its earlier form, by Titian's Le concert champêtre.[3]This was Caravaggio's most ambitious and complex composition to date, and the artist has evidently had difficulties with painting the four figures separately—they don't relate to each other or to the picture-space, and the overall effect is somewhat clumsy. The painting is in poor condition, and the music in the manuscript has been badly damaged by past restorations, although a tenor and an alto part can be made out. Nevertheless, despite considerable paint loss, the work's originality remains undimmed."
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/leonardo-da-vinci/1474/225199.jpg",
                                        "width": 1024,
                                        "height": 1087
                                    }
                                },
                                "id": 10000003,
                                "title": {
                                    "default": "Portrait of Ginevra Benci",
                                    "en": "Portrait of Ginevra Benci",
                                    "zh": "吉內薇拉·班琪"
                                },
                                "artist": {
                                    "default": "Leonardo da Vinci",
                                    "en": "Leonardo da Vinci",
                                    "zh": "列奥纳多·达·芬奇"
                                },
                                "museum": {
                                    "default": "National Gallery of Art, Washington, DC, US",
                                    "en": "National Gallery of Art, Washington, DC, US",
                                    "zh": "国家美术馆 (华盛顿)"
                                },
                                "completion_year": 1474,
                                "genre": {
                                    "default": "portrait",
                                    "en": "portrait"
                                },
                                "style": {
                                    "default": "Early Renaissance",
                                    "en": "Early Renaissance",
                                    "zh": "早期文艺复兴"
                                },
                                "introduction": [
                                    {
                                        "en": "Ginevra de' Benci is a portrait painting by Leonardo da Vinci of the 15th-century Florentine aristocrat Ginevra de' Benci (born c. 1458). The oil-on-wood portrait was acquired by the National Gallery of Art in Washington, D.C. in 1967. The sum of US$5 million—an absolute record price at the time—came from the Ailsa Mellon Bruce Fund and was paid to the Princely House of Liechtenstein. It is the only painting by Leonardo on public view in the Americas."
                                    },
                                    {
                                        "zh": "一位着名的佛罗伦萨年轻女性，被普遍认为是肖像保姆。莱昂纳多在1474年至1478年之间在佛罗伦萨画了肖像画，可能是为了纪念Ginevra在16岁时与Luigi di Bernardo Niccolini的婚姻。围绕Ginevra头部并填充大部分背景的杜松灌木不仅仅是装饰用途。在意大利文艺复兴时期，杜松被认为是女性美德的象征，而意大利语中的杜松，ginepro，也是保姆的名字。面板背面的图像和文字进一步支持识别该图片。反向装饰有由花圈包围的杜松小枝桂树和棕榈，并被短语VIRTVTEM FORMA DECORAT（“美丽的装饰美德”）所纪念。"
                                    }
                                ]
                            },
                            {
                                "image": {
                                    "default": {
                                        "url": "https://s3.us-east-2.amazonaws.com/auramaze-test/images/rembrandt/1653/9223372032559808999.jpg",
                                        "width": 2500,
                                        "height": 2641
                                    }
                                },
                                "id": 10000002,
                                "title": {
                                    "default": "Aristotle with a Bust of Homer",
                                    "en": "Aristotle with a Bust of Homer"
                                },
                                "artist": {
                                    "default": "Rembrandt",
                                    "en": "Rembrandt",
                                    "zh": "伦勃朗"
                                },
                                "museum": {
                                    "default": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "en": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "zh": "大都会艺术博物馆"
                                },
                                "completion_year": 1653,
                                "genre": [
                                    {
                                        "default": "portrait",
                                        "en": "portrait"
                                    },
                                    {
                                        "default": "history painting",
                                        "en": "history painting",
                                        "zh": "历史画"
                                    }
                                ],
                                "style": {
                                    "default": "Baroque",
                                    "en": "Baroque",
                                    "zh": "巴洛克艺术"
                                },
                                "introduction": [
                                    {
                                        "en": "Aristotle with a Bust of Homer, also known as Aristotle Contemplating a Bust of Homer, is an oil-on-canvas painting by Rembrandt.It was painted in 1653, as a commission from Don Antonio Ruffo, from Messina in Sicily, who did not request a particular subject.Aristotle, world-weary, looks at the bust of blind, humble Homer, on which he rests one of his hands. This has variously been interpreted as the man of sound, methodical science deferring to Art, or as the wealthy and famous philosopher, wearing the jeweled belt given to him by Alexander the Great, envying the life of the poor blind bard.[1] It has also been suggested that this is Rembrandt's commentary on the power of portraiture.[1]The interpretation of methodical science deferring to art is discussed at length in Rembrandt's Aristotle and Other Rembrandt Studies.[1] The author notes that Aristotle's right hand (traditionally the favored hand), which rests on the bust of Homer, is both higher and painted in lighter shades than the left hand on the gold chain given to him by Alexander.The exact subject being portrayed in this portrait has been challenged in the book by Simon Schama titled Rembrandt's Eyes, applying the scholarship of Paul Crenshaw.[2] Schama presents a substantial argument that it was the famous ancient Greek painter Apelles who is depicted in contemplation by Rembrandt and not Aristotle.[3]It was purchased in 1961 for $2.3 million by the Metropolitan Museum of Art[4] in New York City, USA. At the time this was the highest amount ever paid for any picture at public or private sale.[5] During the renovation of the Rembrandt wing of the Metropolitan Museum, the painting was retitled in November 2013 as Aristotle with a Bust of Homer.The painting forms the central theme of Joseph Heller's 1988 novel Picture This."
                                    },
                                    {
                                        "zh": "世界疲惫的亚里士多德看着盲目的，卑微的荷马的半身像，他靠在他的一只手上。这已经被不同地解释为声音，有条理的科学推迟到艺术，或作为富有和着名的哲学家，穿着由亚历山大大帝给他的宝石腰带，嫉妒可怜的盲人吟游诗人的生活。[1]也有人认为这是伦勃朗对肖像画力量的评论。[1]"
                                    }
                                ]
                            }
                        ],
                        "artizen": [
                            {
                                "id": 1000186532,
                                "username": "caravaggio",
                                "name": {
                                    "default": "Caravaggio",
                                    "en": "Caravaggio",
                                    "zh": "卡拉瓦乔"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Caravaggio",
                                "wikiartId": 186532,
                                "introduction": [
                                    {
                                        "en": "Michelangelo Merisi (Michele Angelo Merigi or Amerighi) da Caravaggio (/ˌkærəˈvædʒioʊ/, US: /-ˈvɑːdʒ-/; Italian pronunciation: [mikeˈlandʒelo meˈriːzi da (k)karaˈvaddʒo]; 28 September 1571[2] – 18 July 1610) was an Italian painter active in Rome, Naples, Malta, and Sicily from the early 1590s to 1610. His paintings combine a realistic observation of the human state, both physical and emotional, with a dramatic use of lighting, and they had a formative influence on Baroque painting.[3][4][5]Caravaggio employed close physical observation with a dramatic use of chiaroscuro that came to be known as tenebrism. He made the technique a dominant stylistic element, darkening shadows and transfixing subjects in bright shafts of light. Caravaggio vividly expressed crucial moments and scenes, often featuring violent struggles, torture and death. He worked rapidly, with live models, preferring to forego drawings and work directly onto the canvas. His influence on the new Baroque style that emerged from Mannerism was profound. It can be seen directly or indirectly in the work of Peter Paul Rubens, Jusepe de Ribera, Gian Lorenzo Bernini, and Rembrandt, and artists in the following generation heavily under his influence were called the \"Caravaggisti\" or \"Caravagesques\", as well as tenebrists or tenebrosi (\"shadowists\").Caravaggio trained as a painter in Milan before moving in his twenties to Rome. He developed a considerable name as an artist, and as a violent, touchy and provocative man. A brawl led to a death sentence for murder and forced him to flee to Naples. There he again established himself as one of the most prominent Italian painters of his generation. He traveled in 1607 to Malta and on to Sicily, and pursued a papal pardon for his sentence. In 1609 he returned to Naples, where he was involved in a violent clash; his face was disfigured and rumours of his death circulated. Questions about his mental state arose from his erratic and bizarre behavior. He died in 1610 under uncertain circumstances while on his way from Naples to Rome. Reports stated that he died of a fever, but suggestions have been made that he was murdered or that he died of lead poisoning.Caravaggio's innovations inspired Baroque painting, but the Baroque incorporated the drama of his chiaroscuro without the psychological realism. The style evolved and fashions changed, and Caravaggio fell out of favor. In the 20th century interest in his work revived, and his importance to the development of Western art was reevaluated. The 20th-century art historian André Berne-Joffroy stated, \"What begins in the work of Caravaggio is, quite simply, modern painting.\"[6]"
                                    }
                                ]
                            },
                            {
                                "id": 1000196187,
                                "username": "jacques-louis-david",
                                "name": {
                                    "default": "Jacques-Louis David",
                                    "en": "Jacques-Louis David",
                                    "zh": "雅克-路易·大卫"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Jacques-Louis_David",
                                "wikiartId": 196187,
                                "introduction": [
                                    {
                                        "en": "Jacques-Louis David (French: [ʒaklwi david]; 30 August 1748 – 29 December 1825) was a French painter in the Neoclassical style, considered to be the preeminent painter of the era. In the 1780s his cerebral brand of history painting marked a change in taste away from Rococo frivolity toward classical austerity and severity and heightened feeling,[1] harmonizing with the moral climate of the final years of the Ancien Régime.David later became an active supporter of the French Revolution and friend of Maximilien Robespierre (1758–1794), and was effectively a dictator of the arts under the French Republic. Imprisoned after Robespierre's fall from power, he aligned himself with yet another political regime upon his release: that of Napoleon, The First Consul of France. At this time he developed his Empire style, notable for its use of warm Venetian colours. After Napoleon's fall from Imperial power and the Bourbon revival, David exiled himself to Brussels, then in the United Kingdom of the Netherlands, where he remained until his death. David had a large number of pupils, making him the strongest influence in French art of the early 19th century, especially academic Salon painting."
                                    }
                                ]
                            },
                            {
                                "id": 1000232329,
                                "username": "william-adolphe-bouguereau",
                                "name": {
                                    "default": "William-Adolphe Bouguereau",
                                    "en": "William-Adolphe Bouguereau",
                                    "zh": "威廉·阿道夫·布格罗"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/William-Adolphe_Bouguereau",
                                "wikiartId": 232329,
                                "introduction": [
                                    {
                                        "en": "William-Adolphe Bouguereau (French pronunciation: ​[wijam.adɔlf buɡ(ə)ʁo]; 30 November 1825 – 19 August 1905) was a French academic painter. In his realistic genre paintings he used mythological themes, making modern interpretations of classical subjects, with an emphasis on the female human body.[1] During his life he enjoyed significant popularity in France and the United States, was given numerous official honors, and received top prices for his work.[2] As the quintessential salon painter of his generation, he was reviled by the Impressionist avant-garde.[2] By the early twentieth century, Bouguereau and his art fell out of favor with the public, due in part to changing tastes.[2] In the 1980s, a revival of interest in figure painting led to a rediscovery of Bouguereau and his work.[2] Throughout the course of his life, Bouguereau executed 822 known finished paintings, although the whereabouts of many are still unknown.[3]"
                                    }
                                ]
                            },
                            {
                                "id": 1000000012,
                                "username": "nga",
                                "name": {
                                    "default": "National Gallery of Art, Washington, DC, US",
                                    "en": "National Gallery of Art, Washington, DC, US",
                                    "zh": "国家美术馆 (华盛顿)"
                                },
                                "image": "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/0016/9635/brand.gif?itok=fYfpmzY1",
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/National_Gallery_of_Art",
                                "introduction": [
                                    {
                                        "en": "The National Gallery of Art, and its attached Sculpture Garden, is a national art museum in Washington, D.C., located on the National Mall, between 3rd and 9th Streets, at Constitution Avenue NW. Open to the public and free of charge, the museum was privately established in 1937 for the American people by a joint resolution of the United States Congress. Andrew W. Mellon donated a substantial art collection and funds for construction. The core collection includes major works of art donated by Paul Mellon, Ailsa Mellon Bruce, Lessing J. Rosenwald, Samuel Henry Kress, Rush Harrison Kress, Peter Arrell Browne Widener, Joseph E. Widener, and Chester Dale. The Gallery's collection of paintings, drawings, prints, photographs, sculpture, medals, and decorative arts traces the development of Western Art from the Middle Ages to the present, including the only painting by Leonardo da Vinci in the Americas and the largest mobile created by Alexander Calder.\r\n\r\nThe Gallery's campus includes the original neoclassical West Building designed by John Russell Pope, which is linked underground to the modern East Building, designed by I. M. Pei, and the 6.1-acre (25,000 m2) Sculpture Garden. The Gallery often presents temporary special exhibitions spanning the world and the history of art. It is one of the largest museums in North America."
                                    }
                                ]
                            },
                            {
                                "id": 1000000019,
                                "username": "history-painting",
                                "name": {
                                    "default": "history painting",
                                    "en": "history painting",
                                    "zh": "历史画"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/History_painting",
                                "introduction": [
                                    {
                                        "en": "History painting is a genre in painting defined by its subject matter rather than artistic style. History paintings usually depict a moment in a narrative story, rather than a specific and static subject, as in a portrait. The term is derived from the wider senses of the word historia in Latin and Italian, meaning \"story\" or \"narrative\", and essentially means \"story painting\". Most history paintings are not of scenes from history, especially paintings from before about 1850.\r\n\r\nIn modern English, historical painting is sometimes used to describe the painting of scenes from history in its narrower sense, especially for 19th-century art, excluding religious, mythological and allegorical subjects, which are included in the broader term history painting, and before the 19th century were the most common subjects for history paintings.\r\n\r\nHistory paintings almost always contain a number of figures, often a large number, and normally show some type of action that is a moment in a narrative. The genre includes depictions of moments in religious narratives, above all the Life of Christ, as well as narrative scenes from mythology, and also allegorical scenes.[1] These groups were for long the most frequently painted; works such as Michelangelo's Sistine Chapel ceiling are therefore history paintings, as are most very large paintings before the 19th century. The term covers large paintings in oil on canvas or fresco produced between the Renaissance and the late 19th century, after which the term is generally not used even for the many works that still meet the basic definition.[2]\r\n\r\nHistory painting may be used interchangeably with historical painting, and was especially so used before the 20th century.[3] Where a distinction is made \"historical painting\" is the painting of scenes from secular history, whether specific episodes or generalized scenes. In the 19th century historical painting in this sense became a distinct genre. In phrases such as \"historical painting materials\", \"historical\" means in use before about 1900, or some earlier date.\r\n\r\nHistory paintings were traditionally regarded as the highest form of Western painting, occupying the most prestigious place in the hierarchy of genres, and considered the equivalent to the epic in literature. In his De Pictura of 1436, Leon Battista Alberti had argued that multi-figure history painting was the noblest form of art, as being the most difficult, which required mastery of all the others, because it was a visual form of history, and because it had the greatest potential to move the viewer. He placed emphasis on the ability to depict the interactions between the figures by gesture and expression.[4]\r\n\r\nThis view remained general until the 19th century, when artistic movements began to struggle against the establishment institutions of academic art, which continued to adhere to it. At the same time there was from the latter part of the 18th century an increased interest in depicting in the form of history painting moments of drama from recent or contemporary history, which had long largely been confined to battle-scenes and scenes of formal surrenders and the like. Scenes from ancient history had been popular in the early Renaissance, and once again became common in the Baroque and Rococo periods, and still more so with the rise of Neoclassicism. In some 19th or 20th century contexts, the term may refer specifically to paintings of scenes from secular history, rather than those from religious narratives, literature or mythology."
                                    }
                                ]
                            },
                            {
                                "id": 1000000029,
                                "username": "post-impressionism",
                                "name": {
                                    "default": "Post-Impressionism",
                                    "en": "Post-Impressionism",
                                    "zh": "后印象派"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Post-Impressionism",
                                "introduction": [
                                    {
                                        "en": "Post-Impressionism (also spelled Postimpressionism) is a predominantly French art movement that developed roughly between 1886 and 1905, from the last Impressionist exhibition to the birth of Fauvism. Post-Impressionism emerged as a reaction against Impressionists' concern for the naturalistic depiction of light and colour. Due to its broad emphasis on abstract qualities or symbolic content, Post-Impressionism encompasses Neo-Impressionism, Symbolism, Cloisonnism, Pont-Aven School, and Synthetism, along with some later Impressionists' work. The movement was led by Paul Cézanne (known as father of Post-impressionism), Paul Gauguin, Vincent van Gogh, and Georges Seurat.\r\n\r\nThe term Post-Impressionism was first used by art critic Roger Fry in 1906.[1][2] Critic Frank Rutter in a review of the Salon d'Automne published in Art News, 15 October 1910, described Othon Friesz as a \"post-impressionist leader\"; there was also an advert for the show The Post-Impressionists of France.[3] Three weeks later, Roger Fry used the term again when he organized the 1910 exhibition, Manet and the Post-Impressionists, defining it as the development of French art since Manet.\r\n\r\nPost-Impressionists extended Impressionism while rejecting its limitations: they continued using vivid colours, often thick application of paint, and real-life subject matter, but were more inclined to emphasize geometric forms, distort form for expressive effect, and use unnatural or arbitrary colour."
                                    }
                                ]
                            },
                            {
                                "id": 1000225091,
                                "username": "leonardo-da-vinci",
                                "name": {
                                    "default": "Leonardo da Vinci",
                                    "en": "Leonardo da Vinci",
                                    "zh": "列奥纳多·达·芬奇"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Leonardo_da_Vinci",
                                "wikiartId": 225091,
                                "introduction": [
                                    {
                                        "en": "Leonardo di ser Piero da Vinci (Italian: [leoˈnardo di ˌsɛr ˈpjɛːro da (v)ˈvintʃi] (About this sound listen); 15 April 1452 – 2 May 1519), more commonly Leonardo da Vinci or simply Leonardo, was an Italian polymath of the Renaissance, whose areas of interest included invention, painting, sculpting, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, writing, history, and cartography. He has been variously called the father of palaeontology, ichnology, and architecture, and is widely considered one of the greatest painters of all time. Sometimes credited with the inventions of the parachute, helicopter and tank,[1][2][3] he epitomised the Renaissance humanist ideal.Many historians and scholars regard Leonardo as the prime exemplar of the \"Universal Genius\" or \"Renaissance Man\", an individual of \"unquenchable curiosity\" and \"feverishly inventive imagination\",[4] and he is widely considered one of the most diversely talented individuals ever to have lived.[5] According to art historian Helen Gardner, the scope and depth of his interests were without precedent in recorded history, and \"his mind and personality seem to us superhuman, while the man himself mysterious and remote\".[4] Marco Rosci notes that while there is much speculation regarding his life and personality, his view of the world was logical rather than mysterious, and that the empirical methods he employed were unorthodox for his time.[6]Born out of wedlock to a notary, Piero da Vinci, and a peasant woman, Caterina, in Vinci in the region of Florence, Leonardo was educated in the studio of the renowned Florentine painter Andrea del Verrocchio. Much of his earlier working life was spent in the service of Ludovico il Moro in Milan. He later worked in Rome, Bologna and Venice, and he spent his last years in France at the home awarded to him by Francis I of France.Leonardo was, and is, renowned primarily as a painter. Among his works, the Mona Lisa is the most famous and most parodied portrait[7] and The Last Supper the most reproduced religious painting of all time.[4] Leonardo's drawing of the Vitruvian Man is also regarded as a cultural icon,[8] being reproduced on items as varied as the euro coin, textbooks, and T-shirts.A painting by Leonardo, Salvator Mundi, sold for a world record $450.3 million at a Christie's auction in New York, 15 November 2017, the highest price ever paid for a work of art.[9] Perhaps fifteen of his paintings have survived.[nb 1] Nevertheless, these few works, together with his notebooks, which contain drawings, scientific diagrams, and his thoughts on the nature of painting, compose a contribution to later generations of artists rivalled only by that of his contemporary, Michelangelo.Leonardo is revered for his technological ingenuity. He conceptualised flying machines, a type of armoured fighting vehicle, concentrated solar power, an adding machine,[10] and the double hull. Relatively few of his designs were constructed or even feasible during his lifetime, as the modern scientific approaches to metallurgy and engineering were only in their infancy during the Renaissance. Some of his smaller inventions, however, such as an automated bobbin winder and a machine for testing the tensile strength of wire, entered the world of manufacturing unheralded. A number of Leonardo's most practical inventions are nowadays displayed as working models at the Museum of Vinci. He made substantial discoveries in anatomy, civil engineering, geology, optics, and hydrodynamics, but he did not publish his findings and they had no direct influence on later science.[11]"
                                    }
                                ]
                            },
                            {
                                "id": 1000238672,
                                "username": "william-turner",
                                "name": {
                                    "default": "William Turner",
                                    "en": "William Turner",
                                    "zh": "约瑟夫·玛罗德·威廉·特纳"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/J._M._W._Turner",
                                "wikiartId": 238672,
                                "introduction": [
                                    {
                                        "en": "William Turner (29 November 1789 – 7 August 1862) was an English painter who specialised in watercolour landscapes. He was a contemporary of the more famous artist J. M. W. Turner and his style was not dissimilar. He is often known as William Turner of Oxford or just Turner of Oxford to distinguish him from his better known namesake. Many of Turner's paintings depicted the countryside around Oxford. One of his best known pictures is a view of the city of Oxford from Hinksey Hill.In 1898 the Ashmolean Museum in Oxford held a retrospective exhibition of his work. Some of his paintings are still on permanent display at the museum. In 1984 the Oxfordshire County Council presented his work in an exhibition at the Oxfordshire County Museum in Woodstock. His paintings are also held in national and international collections, for example at the Tate Gallery (London, UK), the Metropolitan Museum of Art (New York City, US) and the Dunedin Public Art Gallery (New Zealand)."
                                    }
                                ]
                            },
                            {
                                "id": 1000000011,
                                "username": "metmuseum",
                                "name": {
                                    "default": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "en": "Metropolitan Museum of Art (Met), New York City, NY, US",
                                    "zh": "大都会艺术博物馆"
                                },
                                "image": "https://static.dezeen.com/uploads/2016/02/new-metropolitan-art-museum-logo-wolff-olins_dezeen_1568_0.jpg",
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art",
                                "introduction": [
                                    {
                                        "en": "The Metropolitan Museum of Art of New York, colloquially \"the Met\",[a] is the largest art museum in the United States. With 7.06 million visitors in 2016, it was the third most visited art museum in the world, and the fifth most visited museum of any kind.[8] Its permanent collection contains over two million works,[9] divided among seventeen curatorial departments. The main building, on the eastern edge of Central Park along Manhattan's Museum Mile, is by area one of the world's largest art galleries. A much smaller second location, The Cloisters at Fort Tryon Park in Upper Manhattan, contains an extensive collection of art, architecture, and artifacts from Medieval Europe. On March 18, 2016, the museum opened the Met Breuer museum at Madison Avenue in the Upper East Side; it extends the museum's modern and contemporary art program.\r\n\r\nThe permanent collection consists of works of art from classical antiquity and ancient Egypt, paintings, and sculptures from nearly all the European masters, and an extensive collection of American and modern art. The Met maintains extensive holdings of African, Asian, Oceanian, Byzantine, and Islamic art. The museum is home to encyclopedic collections of musical instruments, costumes, and accessories, as well as antique weapons and armor from around the world. Several notable interiors, ranging from first-century Rome through modern American design, are installed in its galleries.\r\n\r\nThe Metropolitan Museum of Art was founded in 1870 for the purposes of opening a museum to bring art and art education to the American people. It opened on February 20, 1872, and was originally located at 681 Fifth Avenue."
                                    }
                                ]
                            },
                            {
                                "id": 1000000013,
                                "username": "artic",
                                "name": {
                                    "default": "Art Institute of Chicago, Chicago, IL, US",
                                    "en": "Art Institute of Chicago, Chicago, IL, US",
                                    "zh": "芝加哥艺术博物馆"
                                },
                                "image": "https://chicagoinnovation.com/wp-content/uploads/2017/05/Art-Institute.png",
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Art_Institute_of_Chicago",
                                "introduction": [
                                    {
                                        "en": "The Art Institute of Chicago, founded in 1879 and located in Chicago's Grant Park, is one of the oldest and largest art museums in the United States. Recognized for its curatorial efforts and popularity among visitors, the museum hosts approximately 1.5 million guests annually.[2] Its collection, stewarded by 11 curatorial departments, is encyclopedic, and includes iconic works such as Georges Seurat's A Sunday on La Grande Jatte, Pablo Picasso's The Old Guitarist, Edward Hopper's Nighthawks, and Grant Wood's American Gothic. Its permanent collection of nearly 300,000 works of art is augmented by more than 30 special exhibitions mounted yearly that illuminate aspects of the collection and present cutting-edge curatorial and scientific research.\r\n\r\nAs a research institution, the Art Institute also has a conservation and conservation science department, five conservation laboratories, and one of the largest art history and architecture libraries in the country—the Ryerson and Burnham Libraries.\r\n\r\nThe growth of the collection has warranted several additions to the museum's original 1893 building, which was constructed for the World's Columbian Exposition of the same year. The most recent expansion, the Modern Wing designed by Renzo Piano, opened in 2009 and increased the museum's footprint to nearly one million square feet, making it the second-largest art museum in the United States, after the Metropolitan Museum of Art.[3] The Art Institute is connected with the School of the Art Institute of Chicago, a leading art school, making it one of the few remaining unified arts institutions in the United States."
                                    }
                                ]
                            },
                            {
                                "id": 1000000015,
                                "username": "umma",
                                "name": {
                                    "default": "University of Michigan Museum of Art (UMMA), Ann Arbor, MI, US",
                                    "en": "University of Michigan Museum of Art (UMMA), Ann Arbor, MI, US"
                                },
                                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSLFiJ3mOTaE8zjDE63_GgoCCQbPbLq6jgvbuc2VlDRTN_2-iQ",
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/University_of_Michigan_Museum_of_Art",
                                "introduction": [
                                    {
                                        "en": "The University of Michigan Museum of Art, or UMMA in Ann Arbor, Michigan with 94,000 sq ft (8,700 m2) is one of the largest university art museums in the USA. Built as a war memorial in 1909 for the university's fallen alumni from the Civil War, Alumni Memorial Hall originally housed U-M's Alumni office along with the university's growing art collection.\r\n\r\nUMMA contains a comprehensive collection that represents more than 150 years at the university, with nearly 19,000 works of art that span cultures, eras, and media. The museum's displays works by James McNeill Whistler, Franz Kline, Helen Frankenthaler, Pablo Picasso, Joshua Reynolds, Claude Monet, Max Beckmann, Walker Evans, Randolph Rogers, and Kara Walker, among many others.[1]\r\n\r\nIn the spring of 2009, the museum reopened after a major $41.9 million expansion and renovation designed by Brad Cloepfil and Allied Works Architecture, which more than doubled the size of the museum. The museum comprises the renovated Alumni Memorial Hall with 41,000 sq ft (3,800 m2) and the new 53,000 sq ft (4,900 m2) Maxine and Stuart Frankel and the Frankel Family Wing. The museum's current director is Christina Olsen, who was appointed in 2017."
                                    }
                                ]
                            },
                            {
                                "id": 1000000023,
                                "username": "marina",
                                "name": {
                                    "default": "marina",
                                    "en": "marina"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Marine_art",
                                "introduction": null
                            },
                            {
                                "id": 1000000016,
                                "username": "mfa",
                                "name": {
                                    "default": "Museum of Fine Arts (MFA), Boston, MA, US",
                                    "en": "Museum of Fine Arts (MFA), Boston, MA, US",
                                    "zh": "波士顿美术馆"
                                },
                                "image": "https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-1/p200x200/12196345_10153154115197321_263888042162378683_n.jpg?_nc_cat=0&oh=04c9a0c1757b80f014111a1465a905f4&oe=5BE07DBF",
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Museum_of_Fine_Arts,_Boston",
                                "introduction": [
                                    {
                                        "en": "The Museum of Fine Arts in Boston, Massachusetts, is the fifth largest museum in the United States. It contains more than 450,000 works of art, making it one of the most comprehensive collections in the Americas. With more than one million visitors a year,[2] it is the 43rd most-visited art museum in the world as of 2016.\r\n\r\nFounded in 1870, the museum moved to its current location in 1909. The museum is affiliated with the School of the Museum of Fine Arts at Tufts."
                                    }
                                ]
                            },
                            {
                                "id": 1000000018,
                                "username": "religious-painting",
                                "name": {
                                    "default": "religious painting",
                                    "en": "religious painting"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Religious_art",
                                "introduction": [
                                    {
                                        "en": "Religious art or sacred art is artistic imagery using religious inspiration and motifs and is often intended to uplift the mind to the spiritual. Sacred art involves the ritual and cultic practices and practical and operative aspects of the path of the spiritual realization within the artist's religious tradition."
                                    }
                                ]
                            },
                            {
                                "id": 1000000020,
                                "username": "portrait",
                                "name": {
                                    "default": "portrait",
                                    "en": "portrait"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Portrait_painting",
                                "introduction": [
                                    {
                                        "en": "Portrait painting is a genre in painting, where the intent is to depict a human subject. The term 'portrait painting' can also describe the actual painted portrait. Portraitists may create their work by commission, for public and private persons, or they may be inspired by admiration or affection for the subject. Portraits are often important state and family records, as well as remembrances.\r\n\r\nHistorically, portrait paintings have primarily memorialized the rich and powerful. Over time, however, it became more common for middle-class patrons to commission portraits of their families and colleagues. Today, portrait paintings are still commissioned by governments, corporations, groups, clubs, and individuals. In addition to painting, portraits can also be made in other media such as etching, lithography, photography, video and digital media."
                                    }
                                ]
                            },
                            {
                                "id": 1000000021,
                                "username": "self-portrait",
                                "name": {
                                    "default": "self-portrait",
                                    "en": "self-portrait",
                                    "zh": "自画像"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Self-portrait",
                                "introduction": [
                                    {
                                        "en": "A self-portrait is a representation of an artist that is drawn, painted, photographed, or sculpted by that artist. Although self-portraits have been made since the earliest times, it is not until the Early Renaissance in the mid-15th century that artists can be frequently identified depicting themselves as either the main subject, or as important characters in their work. With better and cheaper mirrors, and the advent of the panel portrait, many painters, sculptors and printmakers tried some form of self-portraiture. Portrait of a Man in a Turban by Jan van Eyck of 1433 may well be the earliest known panel self-portrait.[1] He painted a separate portrait of his wife, and he belonged to the social group that had begun to commission portraits, already more common among wealthy Netherlanders than south of the Alps. The genre is venerable, but not until the Renaissance, with increased wealth and interest in the individual as a subject, did it become truly popular."
                                    }
                                ]
                            },
                            {
                                "id": 1000000026,
                                "username": "neoclassicism",
                                "name": {
                                    "default": "Neoclassicism",
                                    "en": "Neoclassicism",
                                    "zh": "新古典主义"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Neoclassicism",
                                "introduction": [
                                    {
                                        "en": "Neoclassicism (from Greek νέος nèos, \"new\" and Latin classicus, \"of the highest rank\")[1] is the name given to Western movements in the decorative and visual arts, literature, theatre, music, and architecture that draw inspiration from the \"classical\" art and culture of classical antiquity. Neoclassicism was born in Rome in the mid-18th century, at the time of the rediscovery of Pompeii and Herculaneum, but its popularity spread all over Europe as a generation of European art students finished their Grand Tour and returned from Italy to their home countries with newly rediscovered Greco-Roman ideals.[2][3] The main Neoclassical movement coincided with the 18th-century Age of Enlightenment, and continued into the early 19th century, laterally competing with Romanticism. In architecture, the style continued throughout the 19th, 20th and up to the 21st century.\r\n\r\nEuropean Neoclassicism in the visual arts began c. 1760 in opposition to the then-dominant Baroque and Rococo styles. Rococo architecture emphasizes grace, ornamentation and asymmetry; Neoclassical architecture is based on the principles of simplicity and symmetry, which were seen as virtues of the arts of Rome and Ancient Greece, and were more immediately drawn from 16th-century Renaissance Classicism. Each \"neo\"-classicism selects some models among the range of possible classics that are available to it, and ignores others. The Neoclassical writers and talkers, patrons and collectors, artists and sculptors of 1765–1830 paid homage to an idea of the generation of Phidias, but the sculpture examples they actually embraced were more likely to be Roman copies of Hellenistic sculptures. They ignored both Archaic Greek art and the works of Late Antiquity. The \"Rococo\" art of ancient Palmyra came as a revelation, through engravings in Wood's The Ruins of Palmyra. Even Greece was all-but-unvisited, a rough backwater of the Ottoman Empire, dangerous to explore, so Neoclassicists' appreciation of Greek architecture was mediated through drawings and engravings, which subtly smoothed and regularized, \"corrected\" and \"restored\" the monuments of Greece, not always consciously."
                                    }
                                ]
                            },
                            {
                                "id": 1000000028,
                                "username": "romanticism",
                                "name": {
                                    "default": "Romanticism",
                                    "en": "Romanticism",
                                    "zh": "浪漫主义"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Romanticism",
                                "introduction": [
                                    {
                                        "en": "Romanticism (also known as the Romantic era) was an artistic, literary, musical and intellectual movement that originated in Europe toward the end of the 18th century, and in most areas was at its peak in the approximate period from 1800 to 1850. Romanticism was characterized by its emphasis on emotion and individualism as well as glorification of all the past and nature, preferring the medieval rather than the classical. It was partly a reaction to the Industrial Revolution,[1] the aristocratic social and political norms of the Age of Enlightenment, and the scientific rationalization of nature—all components of modernity.[2] It was embodied most strongly in the visual arts, music, and literature, but had a major impact on historiography,[3] education,[4] the social sciences, and the natural sciences.[5][not in citation given] It had a significant and complex effect on politics, with romantic thinkers influencing liberalism, radicalism, conservatism and nationalism.[6]\r\n\r\nThe movement emphasized intense emotion as an authentic source of aesthetic experience, placing new emphasis on such emotions as apprehension, horror and terror, and awe—especially that experienced in confronting the new aesthetic categories of the sublimity and beauty of nature. It elevated folk art and ancient custom to something noble, but also spontaneity as a desirable characteristic (as in the musical impromptu). In contrast to the Rationalism and Classicism of the Enlightenment, Romanticism revived medievalism[7] and elements of art and narrative perceived as authentically medieval in an attempt to escape population growth, early urban sprawl, and industrialism.\r\n\r\nAlthough the movement was rooted in the German Sturm und Drang movement, which preferred intuition and emotion to the rationalism of the Enlightenment, the events and ideologies of the French Revolution were also proximate factors. Romanticism assigned a high value to the achievements of \"heroic\" individualists and artists, whose examples, it maintained, would raise the quality of society. It also promoted the individual imagination as a critical authority allowed of freedom from classical notions of form in art. There was a strong recourse to historical and natural inevitability, a Zeitgeist, in the representation of its ideas. In the second half of the 19th century, Realism was offered as a polar opposite to Romanticism.[8] The decline of Romanticism during this time was associated with multiple processes, including social and political changes and the spread of nationalism."
                                    }
                                ]
                            },
                            {
                                "id": 1000190970,
                                "username": "el-greco",
                                "name": {
                                    "default": "El Greco",
                                    "en": "El Greco",
                                    "zh": "埃尔·格雷考"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/El_Greco",
                                "wikiartId": 190970,
                                "introduction": [
                                    {
                                        "en": "Doménikos Theotokópoulos (Greek: Δομήνικος Θεοτοκόπουλος [ðoˈminikos θeotoˈkopulos]; October 1541 – 7 April 1614),[2] most widely known as El Greco (\"The Greek\"), was a painter, sculptor and architect of the Spanish Renaissance. \"El Greco\" was a nickname,[a][b] a reference to his Greek origin, and the artist normally signed his paintings with his full birth name in Greek letters, Δομήνικος Θεοτοκόπουλος, Doménikos Theotokópoulos, often adding the word Κρής Krēs, Cretan.El Greco was born in the Kingdom of Candia, which was at that time part of the Republic of Venice, and the center of Post-Byzantine art. He trained and became a master within that tradition before traveling at age 26 to Venice, as other Greek artists had done.[3] In 1570 he moved to Rome, where he opened a workshop and executed a series of works. During his stay in Italy, El Greco enriched his style with elements of Mannerism and of the Venetian Renaissance taken from a number of great artists of the time, notably Tintoretto. In 1577, he moved to Toledo, Spain, where he lived and worked until his death. In Toledo, El Greco received several major commissions and produced his best-known paintings.El Greco's dramatic and expressionistic style was met with puzzlement by his contemporaries but found appreciation in the 20th century. El Greco is regarded as a precursor of both Expressionism and Cubism, while his personality and works were a source of inspiration for poets and writers such as Rainer Maria Rilke and Nikos Kazantzakis. El Greco has been characterized by modern scholars as an artist so individual that he belongs to no conventional school.[4] He is best known for tortuously elongated figures and often fantastic or phantasmagorical pigmentation, marrying Byzantine traditions with those of Western painting.[5]"
                                    }
                                ]
                            },
                            {
                                "id": 1000219933,
                                "username": "rembrandt",
                                "name": {
                                    "default": "Rembrandt",
                                    "en": "Rembrandt",
                                    "zh": "伦勃朗"
                                },
                                "wikipediaUrl": "https://en.wikipedia.org/wiki/Rembrandt",
                                "wikiartId": 219933,
                                "introduction": [
                                    {
                                        "en": "Rembrandt Harmenszoon van Rijn (/ˈrɛmbrænt, -brɑːnt/;[2] Dutch: [ˈrɛmbrɑnt ˈɦɑrmə(n)soːn vɑn ˈrɛin] (About this sound listen); 15 July 1606[1] – 4 October 1669) was a Dutch draughtsman, painter, and printmaker. An innovative and prolific master in three media,[3] he is generally considered one of the greatest visual artists in the history of art and the most important in Dutch art history.[4] Unlike most Dutch masters of the 17th century, Rembrandt's works depict a wide range of style and subject matter, from portraits and self-portraits to landscapes, genre scenes, allegorical and historical scenes, biblical and mythological themes as well as animal studies. His contributions to art came in a period of great wealth and cultural achievement that historians call the Dutch Golden Age, when Dutch art (especially Dutch painting), although in many ways antithetical to the Baroque style that dominated Europe, was extremely prolific and innovative, and gave rise to important new genres. Like many artists of the Dutch Golden Age, such as Jan Vermeer of Delft, Rembrandt was also an avid art collector and dealer.Rembrandt never went abroad, but he was considerably influenced by the work of the Italian masters and Netherlandish artists who had studied in Italy, like Pieter Lastman, the Utrecht Caravaggists, and Flemish Baroque Peter Paul Rubens. Having achieved youthful success as a portrait painter, Rembrandt's later years were marked by personal tragedy and financial hardships. Yet his etchings and paintings were popular throughout his lifetime, his reputation as an artist remained high,[5] and for twenty years he taught many important Dutch painters.[6]Rembrandt's portraits of his contemporaries, self-portraits and illustrations of scenes from the Bible are regarded as his greatest creative triumphs. His self-portraits form a unique and intimate biography, in which the artist surveyed himself without vanity and with the utmost sincerity.[4] Rembrandt's foremost contribution in the history of printmaking was his transformation of the etching process from a relatively new reproductive technique into a true art form, along with Jacques Callot. His reputation as the greatest etcher in the history of the medium was established in his lifetime and never questioned since. Few of his paintings left the Dutch Republic whilst he lived, but his prints were circulated throughout Europe, and his wider reputation was initially based on them alone.In his works he exhibited knowledge of classical iconography, which he molded to fit the requirements of his own experience; thus, the depiction of a biblical scene was informed by Rembrandt's knowledge of the specific text, his assimilation of classical composition, and his observations of Amsterdam's Jewish population.[7] Because of his empathy for the human condition, he has been called \"one of the great prophets of civilization\".[8] The French sculptor Auguste Rodin said, \"Compare me with Rembrandt! What sacrilege! With Rembrandt, the colossus of Art! We should prostrate ourselves before Rembrandt and never compare anyone with him!\"[9] Francisco Goya, often considered to be among the last of the Old Masters, said \"I have had three masters: Nature, Velázquez, and Rembrandt.\"[10] Vincent van Gogh wrote, \"Rembrandt goes so deep into the mysterious that he says things for which there are no words in any language. It is with justice that they call Rembrandt—magician—that's no easy occupation.\"[11] The impressionist Max Liebermann said: \"Whenever I see a Frans Hals, I feel like painting; whenever I see a Rembrandt, I feel like giving up\"[12]."
                                    }
                                ]
                            }
                        ]
                    }
                });
            }
        });
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight
        });
    }

    render() {
        return (
            <div>
                <ItemList items={this.state.items} columns={parseInt(this.state.windowWidth / 500)}/>
            </div>
        );
    }
}

Search.propTypes = {
    location: PropTypes.object,
};

export default Search;
