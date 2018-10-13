import React, {Component} from 'react';
import ItemList from '../components/item-list';
import './search.css';

class Search extends Component {
    render() {
        return (
            <div>
                <ItemList items={{
                    "art": [
                        {
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
                            "completionYear": 1887,
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
                            "completionYear": 1887,
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
                        }
                    ],
                    "artizen": [
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
                            "id": 1000000027,
                            "username": "early-renaissance",
                            "name": {
                                "default": "Early Renaissance",
                                "en": "Early Renaissance",
                                "zh": "早期文艺复兴"
                            },
                            "wikipediaUrl": "https://en.wikipedia.org/wiki/Renaissance_art",
                            "introduction": [
                                {
                                    "en": "Renaissance art is the painting, sculpture and decorative arts of the period of European history, emerging as a distinct style in Italy in about 1400, in parallel with developments which occurred in philosophy, literature, music, and science. Renaissance art, perceived as the noblest of ancient traditions, took as its foundation the art of Classical antiquity, but transformed that tradition by absorbing recent developments in the art of Northern Europe and by applying contemporary scientific knowledge. Renaissance art, with Renaissance Humanist philosophy, spread throughout Europe, affecting both artists and their patrons with the development of new techniques and new artistic sensibilities. Renaissance art marks the transition of Europe from the medieval period to the Early Modern age.\r\n\r\n\r\nSandro Botticelli, The Birth of Venus, c. 1485. Uffizi, Florence\r\nIn many parts of Europe, Early Renaissance art was created in parallel with Late Medieval art.\r\n\r\nThe influences upon the development of Renaissance men and women in the early 15th century are those that also affected Philosophy, Literature, Architecture, Theology, Science, Government, and other aspects of society. The following list presents a summary, dealt with more fully in the main articles that are cited above.\r\n\r\nClassical texts, lost to European scholars for centuries, became available. These included Philosophy, Prose, Poetry, Drama, Science, a thesis on the Arts, and Early Christian Theology.\r\nSimultaneously, Europe gained access to advanced mathematics which had its provenance in the works of Islamic scholars.\r\nThe advent of movable type printing in the 15th century meant that ideas could be disseminated easily, and an increasing number of books were written for a broad public.\r\nThe establishment of the Medici Bank and the subsequent trade it generated brought unprecedented wealth to a single Italian city, Florence.\r\nCosimo de' Medici set a new standard for patronage of the arts, not associated with the church or monarchy.\r\nHumanist philosophy meant that man's relationship with humanity, the universe and with God was no longer the exclusive province of the Church.\r\nA revived interest in the Classics brought about the first archaeological study of Roman remains by the architect Brunelleschi and sculptor Donatello. The revival of a style of architecture based on classical precedents inspired a corresponding classicism in painting and sculpture, which manifested itself as early as the 1420s in the paintings of Masaccio and Uccello.\r\nThe improvement of oil paint and developments in oil-painting technique by Dutch artists such as Jan van Eyck, Rogier van der Weyden and Hugo van der Goes led to its adoption in Italy from about 1475 and had ultimately lasting effects on painting practices, worldwide.\r\nThe serendipitous presence within the region of Florence in the early 15th century of certain individuals of artistic genius, most notably Masaccio, Brunelleschi, Ghiberti, Piero della Francesca, Donatello and Michelozzo formed an ethos out of which sprang the great masters of the High Renaissance, as well as supporting and encouraging many lesser artists to achieve work of extraordinary quality.[1]\r\nA similar heritage of artistic achievement occurred in Venice through the talented Bellini family, their influential in-law Mantegna, Giorgione, Titian and Tintoretto.[1][2][3]\r\nThe publication of two treatises by Leone Battista Alberti, De Pitura (On Painting), 1435, and De re aedificatoria (Ten Books on Architecture), 1452."
                                }
                            ]
                        },
                        {
                            "id": 1000204915,
                            "username": "vincent-van-gogh",
                            "name": {
                                "default": "Vincent van Gogh",
                                "en": "Vincent van Gogh",
                                "zh": "文森特·梵高"
                            },
                            "wikipediaUrl": "https://en.wikipedia.org/wiki/Vincent_van_Gogh",
                            "wikiartId": 204915,
                            "introduction": [
                                {
                                    "en": "Vincent Willem van Gogh (Dutch: [ˈvɪnsɛnt ˈʋɪləm vɑŋ ˈɣɔx] (About this sound listen);[note 1] 30 March 1853 – 29 July 1890) was a Dutch Post-Impressionist painter who is among the most famous and influential figures in the history of Western art. In just over a decade he created about 2,100 artworks, including around 860 oil paintings, most of them in the last two years of his life. They include landscapes, still lifes, portraits and self-portraits, and are characterised by bold colours and dramatic, impulsive and expressive brushwork that contributed to the foundations of modern art. His suicide at 37 followed years of mental illness and poverty.Born into an upper-middle-class family, Van Gogh drew as a child and was serious, quiet and thoughtful. As a young man he worked as an art dealer, often travelling, but became depressed after he was transferred to London. He turned to religion, and spent time as a Protestant missionary in southern Belgium. He drifted in ill health and solitude before taking up painting in 1881, having moved back home with his parents. His younger brother Theo supported him financially, and the two kept up a long correspondence by letter. His early works, mostly still lifes and depictions of peasant labourers, contain few signs of the vivid colour that distinguished his later work. In 1886, he moved to Paris, where he met members of the avant-garde, including Émile Bernard and Paul Gauguin, who were reacting against the Impressionist sensibility. As his work developed he created a new approach to still lifes and local landscapes. His paintings grew brighter in colour as he developed a style that became fully realised during his stay in Arles in the south of France in 1888. During this period he broadened his subject matter to include series of olive trees, wheat fields and sunflowers.Van Gogh suffered from psychotic episodes and delusions and though he worried about his mental stability, he often neglected his physical health, did not eat properly and drank heavily. His friendship with Gauguin ended after a confrontation with a razor, when in a rage, he severed part of his own left ear. He spent time in psychiatric hospitals, including a period at Saint-Rémy. After he discharged himself and moved to the Auberge Ravoux in Auvers-sur-Oise near Paris, he came under the care of the homoeopathic doctor Paul Gachet. His depression continued and on 27 July 1890, Van Gogh shot himself in the chest with a revolver. He died from his injuries two days later.Van Gogh was unsuccessful during his lifetime, and was considered a madman and a failure. He became famous after his suicide, and exists in the public imagination as the quintessential misunderstood genius, the artist \"where discourses on madness and creativity converge\".[6] His reputation began to grow in the early 20th century as elements of his painting style came to be incorporated by the Fauves and German Expressionists. He attained widespread critical, commercial and popular success over the ensuing decades, and is remembered as an important but tragic painter, whose troubled personality typifies the romantic ideal of the tortured artist."
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
                }}/>
            </div>
        );
    }
}

export default Search;
