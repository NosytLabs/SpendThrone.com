import { RoyalIconProps } from '@/components/ui/RoyalIcon';

export type StatusType = 'architecture' | 'luxury' | 'events' | 'art' | 'technology';

export interface HistoryCardData {
    id: string;
    year: string;
    title: string;
    description: string; // We'll use a string with HTML-like markers in component
    icon: RoyalIconProps['variant'];
    iconColor: string;
    borderColor: string;
    tags: { label: string; colorClass: string }[];
    links: { label: string; url: string }[];
    statusType: StatusType;
    highlightText?: string[]; // Text to bold
    imageUrl?: string;
    cost?: string;
    type?: string;
    extraContent?: {
        title: string;
        items: { icon: RoyalIconProps['variant']; text: string; iconColor: string }[];
        borderColor: string;
    };
}

export interface HistoryEraData {
    id: string;
    title: string;
    yearRange: string;
    dateRange?: string; // For compatibility
    icon: RoyalIconProps['variant'];
    iconColor: string; // e.g. "text-accent-secondary"
    colorClass: string; // e.g. "accent-secondary" for borders
    cards: HistoryCardData[];
}

export const historyPageData: { eras: HistoryEraData[] } = {
    eras: [
    {
        id: 'ancient',
        title: 'Ancient World',
        yearRange: '3000 BC - 500 AD',
        icon: 'pyramid',
        iconColor: 'text-accent-secondary',
        colorClass: 'accent-secondary',
        cards: [
            {
                id: 'cleopatra-pearl',
                year: '41 BC',
                title: "Cleopatra's Pearl Cocktail",
                description: "To win a wager with Marc Antony that she could spend 10 million sesterces on a single meal, Cleopatra dissolved a massive natural pearl earring in vinegar and drank it. She literally consumed a fortune in seconds.",
                icon: 'wine',
                iconColor: 'text-rose-500',
                borderColor: 'border-rose-600',
                statusType: 'luxury',
                highlightText: ['dissolved a massive natural pearl', '10 million sesterces'],
                cost: '10M Sesterces',
                tags: [
                    { label: 'Cost: 10M Sesterces', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Method: Drank it', colorClass: 'bg-rose-500/20 text-rose-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/biography/Cleopatra-queen-of-Egypt' },
                    { label: 'History Channel', url: 'https://www.history.com/news/10-little-known-facts-about-cleopatra' }
                ]
            },
            {
                id: 'crassus-fire-brigade',
                year: '70 BC',
                title: 'Crassus\'s Fire Brigade',
                description: "Marcus Licinius Crassus, the richest man in Rome, owned a 500-man fire brigade. When a house caught fire, he'd arrive and offer to buy it for pennies. If the owner refused, he let it burn. If they agreed, his men put it out. The original predatory capitalist.",
                icon: 'fire',
                iconColor: 'text-orange-600',
                borderColor: 'border-orange-700',
                statusType: 'technology', // Using technology (service) innovation
                highlightText: ['buy it for pennies', 'let it burn'],
                cost: 'Rome\'s Real Estate',
                tags: [
                    { label: 'Net Worth: ~200M Sesterces', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Method: Extortion', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/biography/Marcus-Licinius-Crassus' },
                    { label: 'University of Chicago', url: 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Crassus*.html' }
                ]
            },
            {
                id: 'nero-palace',
                year: '64 AD',
                title: 'Nero\'s Golden House',
                description: "After the Great Fire of Rome, Nero built the Domus Aurea, a massive palace covering three hills. It featured a rotating dining room powered by water, walls covered in gold and gems, and a 120-foot statue of himself.",
                icon: 'home',
                iconColor: 'text-yellow-500',
                borderColor: 'border-yellow-600',
                statusType: 'architecture',
                highlightText: ['walls covered in gold', 'rotating dining room'],
                cost: '2.5 Billion Sesterces',
                tags: [
                    { label: 'Size: 300 acres', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Ego: 120ft Statue', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/Golden-House-of-Nero' },
                    { label: 'Archaeology.org', url: 'https://www.archaeology.org/issues/147-1409/features/2370-nero-golden-house-domus-aurea' }
                ]
            },
            {
                id: 'hanging-gardens',
                year: '600 BC',
                title: 'Hanging Gardens of Babylon',
                description: 'King Nebuchadnezzar II built elaborate terraced gardens for his wife, featuring advanced irrigation systems. 75 feet high with exotic plants imported from distant lands. Pure architectural flex to demonstrate Babylonian engineering supremacy.',
                icon: 'crown',
                iconColor: 'text-indigo-500',
                borderColor: 'border-indigo-600',
                statusType: 'architecture',
                highlightText: ['75 feet high'],
                cost: 'Unknown (Incalculable)',
                tags: [
                    { label: 'Height: 75 feet', colorClass: 'bg-indigo-500/20 text-indigo-400' },
                    { label: 'Exotic imports', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/place/Hanging-Gardens-of-Babylon' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Hanging_Gardens_of_Babylon/' }
                ]
            },
            {
                id: 'roman-triumphs',
                year: '200 BC',
                title: 'Roman Triumphs',
                description: 'Victorious generals would stage massive parades through Rome, displaying looted treasures, exotic animals, and captives. A public spectacle to burn the memory of their power into the minds of the populace. The ultimate "victory lap."',
                icon: 'flag',
                iconColor: 'text-red-500',
                borderColor: 'border-red-600',
                statusType: 'events',
                highlightText: ['massive parades', 'looted treasures'],
                cost: 'Priceless War Loot',
                tags: [
                    { label: 'Spectacle: Public Parade', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Cost: War Loot', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/triumph-Roman-honor' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Roman_Triumph/' }
                ]
            },
            {
                id: 'terracotta-army',
                year: '210 BC',
                title: 'Terracotta Army',
                description: 'Emperor Qin Shi Huang commissioned 8,000 life-sized soldiers for his tomb. Each figure unique, with elaborate armor and weapons. Status through massive underground military display for the afterlife.',
                icon: 'shield',
                iconColor: 'text-teal-500',
                borderColor: 'border-teal-600',
                statusType: 'art',
                highlightText: ['8,000 life-sized soldiers'],
                cost: 'Decades of Labor',
                tags: [
                    { label: 'Army: 8,000 soldiers', colorClass: 'bg-teal-500/20 text-teal-400' },
                    { label: 'Unique figures', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/place/Xian-Terra-Cotta-Warriors' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Terracotta_Army/' }
                ]
            },
            {
                id: 'pyramids-giza',
                year: '2580 BC',
                title: 'Pyramids of Giza',
                description: 'Pharaoh Khufu mobilized 100,000 workers to move 2.3 million stone blocks. Why? To have the biggest tomb on the block. Tutankhamun was buried with a 110 kg solid gold coffin underground. Peak conspicuous waste.',
                icon: 'pyramid',
                iconColor: 'text-accent-secondary',
                borderColor: 'border-accent-secondary',
                statusType: 'architecture',
                highlightText: ['100,000 workers', '110 kg solid gold coffin'],
                cost: 'National Economy',
                tags: [
                    { label: 'Labor: 100,000 workers', colorClass: 'bg-accent-secondary/20 text-accent-secondary' },
                    { label: 'Gold: 110kg coffin', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/place/pyramids-of-Giza' },
                    { label: 'Met Museum', url: 'https://www.metmuseum.org/toah/hd/mumm/hd_mumm.htm' }
                ]
            },
            {
                id: 'caesar-triumph',
                year: '46 BC',
                title: "Caesar's Four-Day Triumph",
                description: "Julius Caesar's triumph lasted four days with unprecedented spectacle. He paraded elephants, gold, and captured kings through Rome. These spectacles cost a fortune and had one purpose: signal dominance and buy political favor.",
                icon: 'crown',
                iconColor: 'text-amber-500',
                borderColor: 'border-amber-600',
                statusType: 'events',
                highlightText: ['four days', 'elephants'],
                cost: 'War Spoils',
                tags: [
                    { label: 'Duration: 4 days', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Elephants & Gold', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Roman-triumph' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Roman_Triumph/' }
                ]
            },
            {
                id: 'potlatch',
                year: '1000 BC',
                title: 'Potlatch Ceremonies',
                description: 'Pacific Northwest indigenous peoples held competitive gift-giving festivals. Chiefs would burn canoes, copper shields, and food to shame rivals. The more you destroyed, the higher your status. Pure conspicuous consumption.',
                icon: 'coins',
                iconColor: 'text-orange-500',
                borderColor: 'border-orange-600',
                statusType: 'events',
                highlightText: ['burn canoes, copper shields, and food'],
                cost: 'Entire Fortune',
                tags: [
                    { label: 'Location: Pacific Northwest', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Destroyed: Canoes & Copper', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/potlatch' },
                    { label: 'Canadian Museum', url: 'https://www.canadianmuseum.ca/history/hall-of-fame/potlatch-ceremony' }
                ]
            },
            {
                id: 'roman-gladiators',
                year: '264 BC',
                title: 'Roman Gladiatorial Games',
                description: "Emperors funded elaborate gladiatorial games to gain popularity. Trajan's games lasted 117 days with 10,000 gladiators and 11,000 animals. Political status bought with blood and gold.",
                icon: 'shield',
                iconColor: 'text-red-500',
                borderColor: 'border-red-600',
                statusType: 'events',
                highlightText: ["Trajan's games lasted 117 days"],
                tags: [
                    { label: 'Duration: 117 days', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Cost: 10,000 fighters', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/sports/gladiator' },
                    { label: 'Met Museum', url: 'https://www.metmuseum.org/toah/hd/glad/hd_glad.htm' }
                ]
            },
            {
                id: 'egyptian-obelisks',
                year: '1400 BC',
                title: 'Egyptian Obelisks',
                description: 'Pharaohs commissioned massive single-stone monuments capped with electrum (gold/silver alloy). Transporting a 300-ton granite block hundreds of miles was a supreme display of logistical power and wealth.',
                icon: 'pyramid',
                iconColor: 'text-amber-500',
                borderColor: 'border-amber-500',
                statusType: 'architecture',
                highlightText: ['electrum (gold/silver alloy)'],
                tags: [
                    { label: 'Weight: 300+ tons', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Material: Granite & Gold', colorClass: 'bg-yellow-500/20 text-yellow-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/technology/obelisk' },
                    { label: 'PBS Nova', url: 'https://www.pbs.org/wgbh/nova/egypt/raising/obelisk.html' }
                ]
            },
            {
                id: 'athenian-mines',
                year: '483 BC',
                title: 'Athenian Silver Mines',
                description: 'When Athens struck a massive silver vein, Themistocles convinced the assembly to spend it all on 200 triremes (warships). Instead of distributing the cash, they bought naval supremacy—the ultimate city-state flex.',
                icon: 'coins',
                iconColor: 'text-slate-400',
                borderColor: 'border-slate-400',
                statusType: 'technology',
                highlightText: ['200 triremes (warships)'],
                tags: [
                    { label: 'Cost: Entire treasury', colorClass: 'bg-slate-500/20 text-slate-300' },
                    { label: 'Result: 200 Warships', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/biography/Themistocles' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Themistocles/' }
                ]
            },
            {
                id: 'exotic-pets',
                year: '100 AD',
                title: 'Imperial Menageries',
                description: 'Roman Emperors kept lions, tigers, and elephants as pets. Pompey the Great tried to have his chariot pulled by elephants (they didn\'t fit through the gates). Owning dangerous, exotic nature was the ultimate power move.',
                icon: 'paw',
                iconColor: 'text-orange-600',
                borderColor: 'border-orange-700',
                statusType: 'luxury',
                highlightText: ['chariot pulled by elephants'],
                tags: [
                    { label: 'Pet: Lion/Tiger', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Risk: High', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'History Extra', url: 'https://www.historyextra.com/period/roman/romans-pets-animals-dogs-cats-exotic/' },
                    { label: 'Getty Museum', url: 'https://www.getty.edu/art/exhibitions/roman_mosaics/animals.html' }
                ]
            },
            {
                id: 'roman-baths',
                year: '216 AD',
                title: 'Baths of Caracalla',
                description: 'A massive 33-acre complex capable of holding 1,600 bathers at once. Covered in marble, mosaics, and statues. Emperors built these free public luxuries to display their benevolence and infinite wealth to the masses.',
                icon: 'waves',
                iconColor: 'text-cyan-500',
                borderColor: 'border-cyan-600',
                statusType: 'architecture',
                highlightText: ['33-acre complex'],
                tags: [
                    { label: 'Capacity: 1,600 people', colorClass: 'bg-cyan-500/20 text-cyan-400' },
                    { label: 'Cost: Imperial Treasury', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/Baths-of-Caracalla' },
                    { label: 'History Today', url: 'https://www.historytoday.com/archive/baths-caracalla' }
                ]
            },
            {
                id: 'tyrian-purple',
                year: '1200 BC',
                title: 'Tyrian Purple Dye',
                description: 'Extracted from predatory sea snails, this dye was worth more than its weight in gold. It took 12,000 snails to produce 1.4 grams of dye. Wearing purple wasn\'t just a fashion choice; it was a capital offense for non-royalty.',
                icon: 'gem',
                iconColor: 'text-fuchsia-600',
                borderColor: 'border-fuchsia-700',
                statusType: 'luxury',
                highlightText: ['worth more than its weight in gold'],
                tags: [
                    { label: 'Source: 12,000 Snails', colorClass: 'bg-fuchsia-500/20 text-fuchsia-400' },
                    { label: 'Restriction: Royals Only', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Smithsonian', url: 'https://www.smithsonianmag.com/history/tyrian-purple-color-royalty-180982165/' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Tyrian_Purple/' }
                ]
            },
            {
                id: 'mausoleum-halicarnassus',
                year: '350 BC',
                title: 'Mausoleum at Halicarnassus',
                description: 'Mausolus built a tomb so magnificent that his name became the word for all grand tombs. Standing 148 feet tall and covered in Greek statuary, it was one of the Seven Wonders. Death is the final status check.',
                icon: 'monument',
                iconColor: 'text-slate-300',
                borderColor: 'border-slate-400',
                statusType: 'architecture',
                highlightText: ['Seven Wonders', 'name became the word'],
                tags: [
                    { label: 'Height: 148 ft', colorClass: 'bg-slate-500/20 text-slate-300' },
                    { label: 'Legacy: "Mausoleum"', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/Mausoleum-of-Halicarnassus' },
                    { label: 'World History', url: 'https://www.worldhistory.org/Mausoleum_at_Halicarnassus/' }
                ]
            },
            {
                id: 'roman-dining',
                year: '1st Century AD',
                title: 'Exotic Roman Feasts',
                description: 'Roman elites served dishes like flamingo tongues, peacock brains, and ostrich pies. Not because they tasted good, but because they were difficult to get. The flavor was irrelevant; the expense was the point.',
                icon: 'wine',
                iconColor: 'text-rose-400',
                borderColor: 'border-rose-500',
                statusType: 'luxury',
                highlightText: ['flamingo tongues', 'peacock brains'],
                tags: [
                    { label: 'Menu: Exotic Animals', colorClass: 'bg-rose-500/20 text-rose-400' },
                    { label: 'Taste: Irrelevant', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'NPR', url: 'https://www.npr.org/sections/thesalt/2019/05/20/724493497/eat-like-a-roman-emperor-with-flamingo-tongue-and-dormouse' },
                    { label: 'Getty', url: 'https://blogs.getty.edu/iris/dining-with-the-ancient-romans/' }
                ]
            }
        ]
    },
    {
        id: 'medieval',
        title: 'Medieval & Renaissance',
        yearRange: '500 AD - 1800 AD',
        icon: 'swords',
        iconColor: 'text-accent-primary',
        colorClass: 'accent-primary',
        cards: [
            {
                id: 'taj-mahal',
                year: '1632',
                title: 'The Taj Mahal',
                description: 'Emperor Shah Jahan spent ~32 million rupees (over $1 billion today) to build a mausoleum for his favorite wife. 20,000 artisans, 1,000 elephants. It bankrupted the empire and led to his own son overthrowing him. The cost of eternal love (and status).',
                icon: 'building',
                iconColor: 'text-emerald-400',
                borderColor: 'border-emerald-500',
                statusType: 'architecture',
                highlightText: ['over $1 billion today', 'bankrupted the empire'],
                tags: [
                    { label: 'Cost: $1 Billion+', colorClass: 'bg-emerald-500/20 text-emerald-400' },
                    { label: 'Labor: 20,000 artisans', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'UNESCO', url: 'https://whc.unesco.org/en/list/252/' },
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/Taj-Mahal' }
                ]
            },
            {
                id: 'forbidden-city',
                year: '1406',
                title: 'The Forbidden City',
                description: 'The Yongle Emperor built a 980-building palace complex in Beijing. It required 100,000 artisans and 1 million laborers. Commoners were forbidden entry on pain of death. Absolute power manifested in architecture.',
                icon: 'lock',
                iconColor: 'text-red-500',
                borderColor: 'border-red-600',
                statusType: 'architecture',
                highlightText: ['1 million laborers', 'pain of death'],
                tags: [
                    { label: 'Scale: 980 buildings', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Access: Forbidden', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'UNESCO', url: 'https://whc.unesco.org/en/list/439/' },
                    { label: 'Palace Museum', url: 'https://en.dpm.org.cn/' }
                ]
            },
            {
                id: 'viking-ship-burial',
                year: '800-1050 AD',
                title: 'Viking Ship Burials',
                description: "Wealthy Vikings weren't just buried in coffins; they were buried in entire ships filled with weapons, gold, horses, and sometimes sacrificed servants. They literally took their wealth (and transportation) with them to Valhalla.",
                icon: 'ship',
                iconColor: 'text-slate-400',
                borderColor: 'border-slate-500',
                statusType: 'events',
                highlightText: ['buried in entire ships', 'took their wealth'],
                tags: [
                    { label: 'Cost: A whole ship', colorClass: 'bg-slate-500/20 text-slate-300' },
                    { label: 'Destruction: Total', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'History.com', url: 'https://www.history.com/news/what-was-life-like-for-a-viking-woman' },
                    { label: 'Museum of Oslo', url: 'https://www.khm.uio.no/english/visit-us/viking-ship-museum/' }
                ]
            },
            {
                id: 'court-jester',
                year: '1200-1600 AD',
                title: 'The Court Jester',
                description: 'Professional fools held a unique position in medieval courts: they could mock kings without losing their heads. Triboulet, jester to French kings, once slapped Francis I on the backside and lived to tell the tale. The only person allowed to speak truth to absolute power—through comedy.',
                icon: 'star',
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-600',
                statusType: 'events',
                highlightText: ['mock kings without losing their heads', 'speak truth to absolute power'],
                tags: [
                    { label: 'Role: Professional Fool', colorClass: 'bg-purple-500/20 text-purple-400' },
                    { label: 'Privilege: Mock the King', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/art/court-jester' },
                    { label: 'History Extra', url: 'https://www.historyextra.com/period/medieval/history-of-the-court-jester/' }
                ]
            },
            {
                id: 'peasant-revolt',
                year: '1381',
                title: 'Wat Tyler\'s Peasant Revolt',
                description: 'When English peasants rose up against poll taxes, 60,000 commoners marched on London, beheaded the Archbishop of Canterbury, and briefly held the capital. Their leader Wat Tyler was killed during peace negotiations. The ultimate "bank run" against the crown—it failed, but the fear lingered.',
                icon: 'swords',
                iconColor: 'text-red-600',
                borderColor: 'border-red-700',
                statusType: 'events',
                highlightText: ['60,000 commoners marched on London', 'beheaded the Archbishop'],
                tags: [
                    { label: 'Participants: 60,000', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Result: Suppressed', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Peasants-Revolt' },
                    { label: 'History.com', url: 'https://www.history.com/topics/middle-ages/peasants-revolt' }
                ]
            },
            {
                id: 'kings-ransom',
                year: '1192',
                title: 'Richard I\'s Ransom',
                description: 'When Richard the Lionheart was captured by the Holy Roman Emperor, England had to pay 150,000 marks of silver to free him—roughly three times the annual income of the entire English crown. The term "King\'s Ransom" was born. England was literally taxed into poverty to buy back one man.',
                icon: 'coins',
                iconColor: 'text-amber-400',
                borderColor: 'border-amber-500',
                statusType: 'luxury',
                highlightText: ['150,000 marks of silver', 'taxed into poverty'],
                tags: [
                    { label: 'Cost: 150,000 Marks', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Impact: National Debt', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/biography/Richard-I-king-of-England' },
                    { label: 'History Extra', url: 'https://www.historyextra.com/period/medieval/richard-i-the-lionheart-life-death-facts/' }
                ]
            },
            {
                id: 'pineapple-craze',
                year: '1700s',
                title: 'The Rental Pineapple',
                description: "In 18th century England, pineapples were so rare they cost the equivalent of $8,000 today. People didn't eat them; they rented them for parties to carry around as a status symbol. Eating one was the ultimate flex.",
                icon: 'crown',
                iconColor: 'text-yellow-400',
                borderColor: 'border-yellow-500',
                statusType: 'luxury',
                highlightText: ['$8,000 today', 'rented them for parties'],
                tags: [
                    { label: 'Price: $8,000/fruit', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Usage: Carry only', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'BBC', url: 'https://www.bbc.com/news/uk-england-47746964' },
                    { label: 'Mental Floss', url: 'https://www.mentalfloss.com/article/65506/super-luxe-history-pineapples' }
                ]
            },
            {
                id: 'capability-brown',
                year: '1750s',
                title: 'Terraforming for Views',
                description: 'British aristocrats hired Lancelot "Capability" Brown to move entire hills, divert rivers, and demolish villages just to improve the view from their window. Literal terraforming of the English countryside for aesthetic status.',
                icon: 'tree',
                iconColor: 'text-green-600',
                borderColor: 'border-green-700',
                statusType: 'architecture',
                highlightText: ['demolish villages', 'move entire hills'],
                tags: [
                    { label: 'Scale: Landscape', colorClass: 'bg-green-500/20 text-green-400' },
                    { label: 'Cost: Infinite', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'National Trust', url: 'https://www.nationaltrust.org.uk/features/who-was-capability-brown' },
                    { label: 'Britannica', url: 'https://www.britannica.com/biography/Lancelot-Brown' }
                ]
            },
            {
                id: 'mansa-musa',
                year: '1324',
                title: 'Mansa Musa\'s Pilgrimage',
                description: 'The Emperor of Mali traveled to Mecca with 60,000 men and 12,000 slaves, each carrying gold bars. He spent so much gold in Cairo that he caused hyperinflation and crashed the economy for a decade. The only man in history to control the price of gold personally.',
                icon: 'coins',
                iconColor: 'text-yellow-400',
                borderColor: 'border-yellow-500',
                statusType: 'luxury',
                highlightText: ['crashed the economy', 'carrying gold bars'],
                tags: [
                    { label: 'Net Worth: $400B+', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Impact: Hyperinflation', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'BBC', url: 'https://www.bbc.com/news/world-africa-47379458' },
                    { label: 'National Geographic', url: 'https://education.nationalgeographic.org/resource/mansa-musa-musa-i-mali/' }
                ]
            },
            {
                id: 'poulaines',
                year: '1300s',
                title: 'Poulaines (Long Shoes)',
                description: 'Shoes with ridiculously long toes became the ultimate status flex. The longer the toe, the higher your status. Kings had toes up to 24 inches long, reinforced with whalebone. Impracticality was the point—it proved you didn\'t need to do manual labor.',
                icon: 'footprints',
                iconColor: 'text-orange-400',
                borderColor: 'border-orange-500',
                statusType: 'luxury',
                highlightText: ['longer the toe, the higher your status'],
                tags: [
                    { label: 'Length: Up to 24"', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Signaling: No Labor', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'Atlas Obscura', url: 'https://www.atlasobscura.com/articles/medieval-long-toed-shoes-poulaines' },
                    { label: 'V&A Museum', url: 'http://www.vam.ac.uk/content/articles/s/shoes-poulaines/' }
                ]
            },
            {
                id: 'medici-patronage',
                year: '1400s',
                title: 'Medici Art Patronage',
                description: 'The Medici family didn\'t just buy art; they bought the artists. By sponsoring Michelangelo and Botticelli, they converted banking wealth into cultural immortality. Status washing at its finest.',
                icon: 'palette',
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-600',
                statusType: 'art',
                highlightText: ['cultural immortality'],
                tags: [
                    { label: 'Sponsors: Michelangelo', colorClass: 'bg-purple-500/20 text-purple-400' },
                    { label: 'Goal: Legitimacy', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'History.com', url: 'https://www.history.com/topics/renaissance/medici-family' },
                    { label: 'Artsy', url: 'https://www.artsy.net/article/artsy-editorial-how-the-medici-family-shaped-the-renaissance' }
                ]
            },
            {
                id: 'indulgences',
                year: '1517',
                title: 'The Sale of Indulgences',
                description: 'The Catholic Church monetized Salvation. Pope Leo X sold "Indulgences" (certificates reducing time in Purgatory) to fund St. Peter\'s Basilica. Rich merchants bought their way into Heaven—the first pay-to-win mechanic.',
                icon: 'scroll',
                iconColor: 'text-accent-primary',
                borderColor: 'border-accent-primary',
                statusType: 'luxury',
                highlightText: ['Salvation', 'pay-to-win mechanic'],
                tags: [
                    { label: 'Cost: Salvation', colorClass: 'bg-accent-primary/20 text-accent-primary' },
                    { label: 'Purpose: Fund Basilica', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Reformation' },
                    { label: 'Library of Congress', url: 'https://www.loc.gov/exhibits/vatican/vatican-reformation.html' }
                ]
            },
            {
                id: 'king-james-titles',
                year: '1611',
                title: 'King James Sells Titles',
                description: 'King James I created the rank of "Baronet" specifically to sell it for £1,095. No land, no power, just a title. It was an Early Access Pass to the aristocracy.',
                icon: 'user',
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-600',
                statusType: 'luxury',
                highlightText: ['Early Access Pass'],
                tags: [
                    { label: 'Price: £1,095', colorClass: 'bg-purple-500/20 text-purple-400' },
                    { label: 'Value: Just a title', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/biography/James-I-king-of-Great-Britain' },
                    { label: 'Royal UK', url: 'https://www.royal.uk/james-vi-and-i' }
                ]
            },
            {
                id: 'versailles',
                year: '1682',
                title: 'Palace of Versailles',
                description: "Louis XIV spent ~20% of France's budget building Versailles. 700 rooms, 1,400 fountains. Nobles were forced to live there and spend fortunes on clothes just to be seen. Costly signaling that eventually bankrupted the monarchy.",
                icon: 'home',
                iconColor: 'text-pink-500',
                borderColor: 'border-pink-600',
                statusType: 'architecture',
                highlightText: ['700 rooms, 1,400 fountains.'],
                tags: [
                    { label: 'Budget: 20% of France', colorClass: 'bg-pink-500/20 text-pink-400' },
                    { label: 'Scale: 700 rooms', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'Versailles', url: 'https://en.chateauversailles.fr/' },
                    { label: 'Britannica', url: 'https://www.britannica.com/place/Versailles-Palace' }
                ]
            },
            {
                id: 'tournaments',
                year: '1200s',
                title: 'Tournament Culture',
                description: "Knights spent fortunes on armor, horses, and elaborate tournaments. A single tournament could cost a knight's entire annual income. Status through competitive display and martial prowess.",
                icon: 'trophy',
                iconColor: 'text-indigo-500',
                borderColor: 'border-indigo-600',
                statusType: 'events',
                highlightText: ["a knight's entire annual income"],
                tags: [
                    { label: 'Cost: Annual income', colorClass: 'bg-indigo-500/20 text-indigo-400' },
                    { label: 'Display: Armor & Horses', colorClass: 'bg-silver-500/20 text-gray-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/sports/tournament-medieval-military' },
                    { label: 'Met Museum', url: 'https://www.metmuseum.org/toah/hd/trnr/hd_trnr.htm' }
                ]
            },
            {
                id: 'sumptuary-laws',
                year: '1300s',
                title: 'Sumptuary Laws',
                description: 'Laws restricted luxury goods to nobility only. Merchants who grew wealthy couldn\'t wear silk or gold—unless they bought titles. Status symbols were literally legislated and monetized.',
                icon: 'star',
                iconColor: 'text-emerald-500',
                borderColor: 'border-emerald-600',
                statusType: 'luxury',
                highlightText: ['unless they bought titles'],
                tags: [
                    { label: 'Restriction: Silk & Gold', colorClass: 'bg-emerald-500/20 text-emerald-400' },
                    { label: 'Solution: Buy titles', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/sumptuary-law' },
                    { label: 'Medievalists', url: 'https://www.medievalists.net/2017/06/sumptuary-laws-medieval-europe/' }
                ]
            },
            {
                id: 'medieval-feast',
                year: '1100s',
                title: 'Medieval Feast Culture',
                description: "Nobles hosted 12-course meals with exotic spices from Asia. A single feast could cost a peasant's lifetime earnings. Social hierarchy displayed through food waste and imported delicacies.",
                icon: 'wine',
                iconColor: 'text-amber-600',
                borderColor: 'border-amber-700',
                statusType: 'luxury',
                highlightText: ['12-course meals', "a peasant's lifetime earnings"],
                tags: [
                    { label: 'Courses: 12+', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Spices: Asian imports', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/medieval-cuisine' },
                    { label: 'Met Museum', url: 'https://www.metmuseum.org/toah/hd/mfoo/hd_mfoo.htm' }
                ]
            },
            {
                id: 'crusades',
                year: '1095',
                title: 'Crusades as Status Symbols',
                description: "Knights spent fortunes equipping themselves for Crusades. $50,000+ in today's money for armor, horses, and retinue. Religious warfare became a status competition among European nobility.",
                icon: 'cross',
                iconColor: 'text-rose-600',
                borderColor: 'border-rose-700',
                statusType: 'events',
                highlightText: ["$50,000+ in today's money"],
                tags: [
                    { label: 'Cost: $50K+ equivalent', colorClass: 'bg-rose-500/20 text-rose-400' },
                    { label: 'Status: Holy warrior', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Crusades' },
                    { label: 'Met Museum', url: 'https://www.metmuseum.org/toah/hd/crus/hd_crus.htm' }
                ]
            },
            {
                id: 'field-cloth-gold',
                year: '1520',
                title: 'Field of the Cloth of Gold',
                description: 'King Henry VIII and Francis I met for a diplomatic summit that turned into a spending war. They built temporary palaces, fountains flowing with wine, and wore outfits made of real gold thread. It nearly bankrupted both treasuries just to show who was richer.',
                icon: 'crown',
                iconColor: 'text-accent-primary',
                borderColor: 'border-accent-primary',
                statusType: 'events',
                highlightText: ['fountains flowing with wine', 'bankrupted both treasuries'],
                tags: [
                    { label: 'Cost: National Treasuries', colorClass: 'bg-accent-primary/20 text-accent-primary' },
                    { label: 'Duration: 2.5 weeks', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Field-of-the-Cloth-of-Gold' },
                    { label: 'Historic UK', url: 'https://www.historic-uk.com/HistoryUK/HistoryofEngland/Field-of-the-Cloth-of-Gold/' }
                ]
            },
            {
                id: 'sugar-sculptures',
                year: '1500s',
                title: 'Sugar Subtleties',
                description: 'Before sugar was cheap, it was "white gold." Renaissance feasts featured massive edible sculptures (castles, ships, mythological beasts) made of pure sugar. Guests admired them, then ate them. Literal wealth consumption.',
                icon: 'sparkles',
                iconColor: 'text-white',
                borderColor: 'border-slate-300',
                statusType: 'luxury',
                highlightText: ['white gold', 'Literal wealth consumption'],
                tags: [
                    { label: 'Material: Pure Sugar', colorClass: 'bg-white/20 text-white' },
                    { label: 'Status: Edible Art', colorClass: 'bg-pink-500/20 text-pink-400' }
                ],
                links: [
                    { label: 'NPR History', url: 'https://www.npr.org/sections/thesalt/2015/01/07/370492225/the-sweet-history-of-sugar-sculpture' },
                    { label: 'Atlas Obscura', url: 'https://www.atlasobscura.com/articles/sugar-sculpture-history' }
                ]
            },
            {
                id: 'pepper-trade',
                year: '1400s',
                title: 'Black Gold (Pepper)',
                description: 'Spices were once so valuable they were used as currency. Alaric the Goth demanded 3,000 pounds of pepper as ransom for Rome. Serving heavily spiced food wasn\'t about flavor—it was about burning money in your guests\' mouths.',
                icon: 'fire',
                iconColor: 'text-red-500',
                borderColor: 'border-red-600',
                statusType: 'luxury',
                highlightText: ['ransom for Rome'],
                tags: [
                    { label: 'Value: Gold equivalent', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Usage: Conspicuous Flavor', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'History.com', url: 'https://www.history.com/news/spice-trade-history-saffron-pepper' },
                    { label: 'Yale', url: 'https://yaleglobal.yale.edu/history-spice-trade' }
                ]
            },
            {
                id: 'relic-trade',
                year: '1200s',
                title: 'Holy Relic Collecting',
                description: 'Wealthy nobles and churches competed to buy "authentic" religious relics. Splinters of the True Cross, vials of Holy Blood. King Louis IX bought the Crown of Thorns for 135,000 livres (half the annual budget of France).',
                icon: 'star',
                iconColor: 'text-yellow-400',
                borderColor: 'border-yellow-500',
                statusType: 'luxury',
                highlightText: ['Crown of Thorns', '135,000 livres'],
                tags: [
                    { label: 'Cost: 50% National Budget', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Item: Holy Relics', colorClass: 'bg-yellow-500/20 text-yellow-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/relic' },
                    { label: 'Met Museum', url: 'https://www.metmuseum.org/toah/hd/relc/hd_relc.htm' }
                ]
            },
            {
                id: 'chambord',
                year: '1519',
                title: 'Château de Chambord',
                description: 'King Francis I built this massive 440-room castle not as a home, but as a "hunting lodge" to show off to the Holy Roman Emperor. It was so impractical it was barely used, standing empty for centuries as a stone monument to royal ego.',
                icon: 'home',
                iconColor: 'text-blue-400',
                borderColor: 'border-blue-500',
                statusType: 'architecture',
                highlightText: ['hunting lodge', 'barely used'],
                tags: [
                    { label: 'Rooms: 440', colorClass: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Utility: Near Zero', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Chambord.org', url: 'https://www.chambord.org/en/' },
                    { label: 'UNESCO', url: 'https://whc.unesco.org/en/list/933' }
                ]
            },
            {
                id: 'amber-room',
                year: '1701',
                title: 'The Amber Room',
                description: 'Constructed for the King of Prussia and gifted to Peter the Great. An entire chamber lined with 6 tons of amber, gold leaf, and mirrors. Known as the "Eighth Wonder of the World" until it was looted and lost in WWII.',
                icon: 'gem',
                iconColor: 'text-amber-500',
                borderColor: 'border-amber-600',
                statusType: 'art',
                highlightText: ['6 tons of amber', 'Eighth Wonder'],
                tags: [
                    { label: 'Material: Amber & Gold', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Status: Lost Treasure', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'Smithsonian', url: 'https://www.smithsonianmag.com/history/a-brief-history-of-the-amber-room-160940121/' },
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/Amber-Room' }
                ]
            },
            {
                id: 'tulip-mania',
                year: '1637',
                title: 'Tulip Mania',
                description: 'In the Dutch Golden Age, a single Semper Augustus tulip bulb sold for the price of a mansion. Merchants traded fortunes for flowers that would die in a week. The first recorded speculative asset bubble driven purely by hype and status.',
                icon: 'sparkles',
                iconColor: 'text-pink-500',
                borderColor: 'border-pink-500',
                statusType: 'luxury',
                highlightText: ['speculative asset bubble'],
                tags: [
                    { label: 'Price: Cost of a mansion', colorClass: 'bg-pink-500/20 text-pink-400' },
                    { label: 'Asset: Flower bulb', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Tulip-Mania' },
                    { label: 'History.com', url: 'https://www.history.com/news/tulip-mania-financial-crash-holland' }
                ]
            },
            {
                id: 'hope-diamond',
                year: '1666',
                title: 'The Hope Diamond',
                description: 'The 45.52-carat Hope Diamond passed through kings, queens, and socialites. $250 million estimated value for a rock with a "curse." Status through ownership of legendary objects with fabricated backstories.',
                icon: 'diamond',
                iconColor: 'text-rose-500',
                borderColor: 'border-rose-600',
                statusType: 'luxury',
                highlightText: ['$250 million estimated value'],
                tags: [
                    { label: 'Size: 45.52 carats', colorClass: 'bg-rose-500/20 text-rose-400' },
                    { label: 'Value: $250M', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Smithsonian', url: 'https://www.si.edu/exhibitions/hope-diamond' },
                    { label: 'National Geographic', url: 'https://www.nationalgeographic.com/history/article/hope-diamond-curse-history' }
                ]
            }
        ]
    },
    {
        id: 'modern',
        title: 'The Age of Excess',
        yearRange: '1800 AD - Present Day',
        icon: 'rocket',
        iconColor: 'text-blue-500',
        colorClass: 'blue-500',
        cards: [
            {
                id: 'birkin-bag',
                year: '1984',
                title: 'The Birkin Bag',
                description: 'Hermès created the ultimate Veblen good. You can\'t just buy one; you have to "build a relationship" (spend thousands on other stuff) to get on a list. Artificial scarcity at its finest.',
                icon: 'shoppingBag',
                iconColor: 'text-orange-400',
                borderColor: 'border-orange-500',
                statusType: 'luxury',
                highlightText: ['Artificial scarcity'],
                tags: [
                    { label: 'Price: $10k - $500k', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Waitlist: Years', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Vogue', url: 'https://www.vogue.co.uk/fashion/article/hermes-birkin-bag-history' },
                    { label: 'Sotheby\'s', url: 'https://www.sothebys.com/en/articles/the-history-of-the-hermes-birkin-bag' }
                ]
            },
            {
                id: 'sneaker-culture',
                year: '1985',
                title: 'Sneakerhead Culture',
                description: 'Air Jordans launched a global obsession. Limited drops, resale markets, and shoes kept in boxes forever. "StockX" turned footwear into a speculative asset class. Status you walk on (or don\'t).',
                icon: 'footprints',
                iconColor: 'text-red-500',
                borderColor: 'border-red-600',
                statusType: 'luxury',
                highlightText: ['speculative asset class'],
                tags: [
                    { label: 'Resale: 1000% markup', colorClass: 'bg-green-500/20 text-green-400' },
                    { label: 'Utility: Footwear', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'Complex', url: 'https://www.complex.com/sneakers/a-history-of-sneaker-culture' },
                    { label: 'Business Insider', url: 'https://www.businessinsider.com/sneaker-resale-market-value-2019-8' }
                ]
            },
            {
                id: 'vertu-phones',
                year: '2002',
                title: 'Vertu Luxury Phones',
                description: 'Nokia created a subsidiary to sell $20,000 phones with outdated technology but cases made of gold, sapphire, and ruby. They featured a dedicated "Concierge" button. Proof that materials matter more than specs to the ultra-rich.',
                icon: 'mobile',
                iconColor: 'text-slate-400',
                borderColor: 'border-slate-500',
                statusType: 'technology',
                highlightText: ['outdated technology'],
                tags: [
                    { label: 'Price: $20k - $300k', colorClass: 'bg-slate-500/20 text-slate-400' },
                    { label: 'Tech: Obsolete', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'The Verge', url: 'https://www.theverge.com/2017/7/13/15968200/vertu-luxury-phone-company-collapse-liquidation' },
                    { label: 'Wired', url: 'https://www.wired.com/2002/01/vertu/' }
                ]
            },
            {
                id: 'i-am-rich',
                year: '2008',
                title: 'The "I Am Rich" App',
                description: 'An iOS app that cost $999.99 (the maximum allowed). It did absolutely nothing except display a glowing red gem and a mantra. 8 people bought it before Apple removed it. The first purely digital flex.',
                icon: 'diamond',
                iconColor: 'text-red-500',
                borderColor: 'border-red-600',
                statusType: 'technology',
                highlightText: ['$999.99', 'did absolutely nothing'],
                tags: [
                    { label: 'Cost: $999.99', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Utility: Zero', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'TechCrunch', url: 'https://techcrunch.com/2008/08/05/i-am-rich-iphone-app-costs-999-is-a-joke/' },
                    { label: 'LA Times', url: 'https://www.latimes.com/archives/blogs/technology-blog/story/2008-08-07/iphone-app-i-am-rich-costs-999-does-nothing' }
                ]
            },
            {
                id: 'supreme-brick',
                year: '2016',
                title: 'Supreme Clay Brick',
                description: 'Streetwear brand Supreme sold a literal clay brick with their logo for $30. It sold out instantly and resold for $1,000+. A masterclass in hype: proving fans will buy literally construction materials if the brand is cool enough.',
                icon: 'cube',
                iconColor: 'text-red-600',
                borderColor: 'border-red-700',
                statusType: 'luxury',
                highlightText: ['literal clay brick', 'resold for $1,000+'],
                tags: [
                    { label: 'Retail: $30', colorClass: 'bg-green-500/20 text-green-400' },
                    { label: 'Resale: $1000+', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'GQ', url: 'https://www.gq.com/story/supreme-brick-ebay-resale' },
                    { label: 'The Guardian', url: 'https://www.theguardian.com/fashion/2016/sep/30/supreme-brick-sold-out-ebay-resale' }
                ]
            },
            {
                id: 'private-islands',
                year: '2000s',
                title: 'Private Islands',
                description: 'From Richard Branson to Larry Ellison (who bought 98% of Lanai for $300M). Owning land is normal; owning a sovereign-like territory is the ultimate privacy flex. It says "I don\'t just live in the world, I own a piece of it apart from you."',
                icon: 'waves',
                iconColor: 'text-cyan-400',
                borderColor: 'border-cyan-500',
                statusType: 'luxury',
                highlightText: ['bought 98% of Lanai for $300M'],
                tags: [
                    { label: 'Cost: $10M - $300M+', colorClass: 'bg-cyan-500/20 text-cyan-400' },
                    { label: 'Status: Sovereign', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'Forbes', url: 'https://www.forbes.com/sites/jimdobson/2020/06/24/the-billionaire-guide-to-buying-a-private-island-retreat/' },
                    { label: 'Business Insider', url: 'https://www.businessinsider.com/billionaires-who-own-private-islands-richard-branson-larry-ellison-2019-7' }
                ]
            },
            {
                id: 'space-tourism',
                year: '2021',
                title: 'Billionaire Space Race',
                description: 'Jeff Bezos and Richard Branson racing to the edge of space. Tickets cost $450,000+ for a few minutes of weightlessness. Burning tons of rocket fuel for a sub-orbital joyride is the peak of modern resource consumption.',
                icon: 'rocket',
                iconColor: 'text-orange-500',
                borderColor: 'border-orange-600',
                statusType: 'technology',
                highlightText: ['$450,000+ for a few minutes'],
                tags: [
                    { label: 'Cost: $450k/seat', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Duration: 10 mins', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'BBC News', url: 'https://www.bbc.com/news/science-environment-57797297' },
                    { label: 'Reuters', url: 'https://www.reuters.com/lifestyle/science/virgin-galactic-reopens-ticket-sales-space-flights-starting-450000-2021-08-05/' }
                ]
            },
            {
                id: 'vanderbilt-ball',
                year: '1883',
                title: 'The Vanderbilt Ball',
                description: 'Alva Vanderbilt spent $3 million (today\'s money) on a single night\'s costume party. Guests dressed as electric lights and phonographs. It cemented the Vanderbilts as New York\'s social leaders by forcing the old guard to attend.',
                icon: 'users',
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-600',
                statusType: 'events',
                highlightText: ['$3 million (today\'s money)'],
                tags: [
                    { label: 'Cost: $3M / night', colorClass: 'bg-purple-500/20 text-purple-400' },
                    { label: 'Goal: Social Domination', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Museum of City of NY', url: 'https://www.mcny.org/story/vanderbilt-ball-1883' },
                    { label: 'History.com', url: 'https://www.history.com/news/gilded-age-vanderbilt-ball' }
                ]
            },
            {
                id: 'ice-trade',
                year: '1800s',
                title: 'The Frozen Water Flex',
                description: 'Before refrigeration, "Ice Kings" shipped frozen pond water from New England to India and the Caribbean. Serving ice water in the tropics was the ultimate status symbol—literally melting money to show you could.',
                icon: 'snowflake',
                iconColor: 'text-cyan-300',
                borderColor: 'border-cyan-400',
                statusType: 'luxury',
                highlightText: ['melting money', 'shipped frozen pond water'],
                tags: [
                    { label: 'Product: Frozen Water', colorClass: 'bg-cyan-500/20 text-cyan-400' },
                    { label: 'Logistics: Global', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'Mental Floss', url: 'https://www.mentalfloss.com/article/22407/surprisingly-cool-history-ice' },
                    { label: 'History.com', url: 'https://www.history.com/news/the-man-who-shipped-new-england-ice-around-the-world' }
                ]
            },
            {
                id: 'black-amex',
                year: '1999',
                title: 'The Centurion Card',
                description: 'The "Black Card" from American Express. Invite-only. $5,000 initiation fee, $2,500 annual fee. It offers no real financial advantage over other cards, but flashing it signals you are in the top 0.1%.',
                icon: 'creditCard',
                iconColor: 'text-slate-300',
                borderColor: 'border-slate-400',
                statusType: 'luxury',
                highlightText: ['Invite-only'],
                tags: [
                    { label: 'Fee: $5,000 + $2,500/yr', colorClass: 'bg-slate-500/20 text-slate-300' },
                    { label: 'Material: Titanium', colorClass: 'bg-gray-500/20 text-gray-400' }
                ],
                links: [
                    { label: 'Forbes', url: 'https://www.forbes.com/advisor/credit-cards/reviews/american-express-centurion-black-card/' },
                    { label: 'Amex', url: 'https://www.americanexpress.com/' }
                ]
            },
            {
                id: 'concorde',
                year: '1976',
                title: 'The Concorde',
                description: 'Flying at Mach 2.04 across the Atlantic. Tickets cost 30x more than economy. It was cramped and loud, but it was the fastest way to travel and the ultimate status symbol for the jet set.',
                icon: 'rocket',
                iconColor: 'text-indigo-400',
                borderColor: 'border-indigo-500',
                statusType: 'technology',
                highlightText: ['Mach 2.04'],
                tags: [
                    { label: 'Speed: 1,354 mph', colorClass: 'bg-indigo-500/20 text-indigo-400' },
                    { label: 'Price: $12,000 roundtrip', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Museum of Flight', url: 'https://www.museumofflight.org/aircraft/concorde-visual-history' },
                    { label: 'Britannica', url: 'https://www.britannica.com/technology/Concorde' }
                ]
            },
            {
                id: 'faberge-eggs',
                year: '1885',
                title: 'Fabergé Eggs',
                description: 'Russian Tsars commissioned 50 Imperial Easter Eggs made of gold, diamonds, and precious stones. The ultimate useless object—fragile, expensive, and serving no purpose other than to say "I can afford this."',
                icon: 'diamond',
                iconColor: 'text-rose-400',
                borderColor: 'border-rose-500',
                statusType: 'art',
                highlightText: ['50 Imperial Easter Eggs'],
                tags: [
                    { label: 'Material: Gold & Gems', colorClass: 'bg-rose-500/20 text-rose-400' },
                    { label: 'Surviving: 43', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'Fabergé Museum', url: 'https://fabergemuseum.ru/en/' },
                    { label: 'Britannica', url: 'https://www.britannica.com/art/Faberge-egg' }
                ]
            },


            {
                id: 'railroad-tycoons',
                year: '1880s',
                title: 'Private Rail Cars',
                description: 'Before private jets, there were private rail cars. Tycoons like Vanderbilt and Pullman built rolling palaces with marble baths and pipe organs. The only way to travel if you owned the railroad.',
                icon: 'train',
                iconColor: 'text-slate-500',
                borderColor: 'border-slate-600',
                statusType: 'luxury',
                highlightText: ['rolling palaces'],
                tags: [
                    { label: 'Cost: $500k ($15M today)', colorClass: 'bg-slate-500/20 text-slate-400' },
                    { label: 'Feature: Marble baths', colorClass: 'bg-amber-500/20 text-amber-400' }
                ],
                links: [
                    { label: 'History.com', url: 'https://www.history.com/news/gilded-age-mansions-railroad-barons' },
                    { label: 'Atlas Obscura', url: 'https://www.atlasobscura.com/articles/private-rail-cars' }
                ]
            },
            {
                id: 'yachting',
                year: '1900s',
                title: 'The Golden Age of Yachting',
                description: 'J.P. Morgan famously said, "If you have to ask how much it costs, you can\'t afford it." Steam yachts required crews of 50+ men just to leave the harbor. The ultimate floating status symbol.',
                icon: 'ship',
                iconColor: 'text-blue-400',
                borderColor: 'border-blue-500',
                statusType: 'luxury',
                highlightText: ['crews of 50+ men'],
                tags: [
                    { label: 'Quote: J.P. Morgan', colorClass: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Cost: Infinite', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Classic Yacht Info', url: 'https://classicyachtinfo.com/yacht-history/' },
                    { label: 'Forbes', url: 'https://www.forbes.com/sites/billspringer/2018/07/26/the-golden-age-of-yachting/' }
                ]
            },
            {
                id: 'vanity-plates',
                year: '2000s',
                title: 'Multi-Million Dollar Plates',
                description: 'In Dubai, the license plate "1" sold for $14 million. In the UK, "F1" sold for £440k. A piece of metal with a number, priced higher than the hypercar it\'s attached to. The ultimate useless signal.',
                icon: 'text',
                iconColor: 'text-slate-400',
                borderColor: 'border-slate-500',
                statusType: 'luxury',
                highlightText: ['$14 million'],
                tags: [
                    { label: 'Plate "1": $14M', colorClass: 'bg-slate-500/20 text-slate-300' },
                    { label: 'Utility: None', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Guinness World Records', url: 'https://www.guinnessworldrecords.com/world-records/most-expensive-licence-plate' },
                    { label: 'Top Gear', url: 'https://www.topgear.com/car-news/supercars/someone-just-paid-ps12m-number-plate' }
                ]
            },
            {
                id: 'virtual-real-estate',
                year: '2021',
                title: 'Metaverse Land Rush',
                description: 'Investors spent millions on virtual land in Decentraland and The Sandbox. Plots next to Snoop Dogg\'s virtual house sold for $450,000. Digital dirt with artificial scarcity—the precursor to SpendThrone.',
                icon: 'map',
                iconColor: 'text-fuchsia-500',
                borderColor: 'border-fuchsia-600',
                statusType: 'technology',
                highlightText: ['$450,000'],
                tags: [
                    { label: 'Item: Virtual Land', colorClass: 'bg-fuchsia-500/20 text-fuchsia-400' },
                    { label: 'Neighbor: Snoop Dogg', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'CNBC', url: 'https://www.cnbc.com/2021/12/03/metaverse-land-rush-virtual-real-estate-sales-top-100-million-in-a-week.html' },
                    { label: 'Rolling Stone', url: 'https://www.rollingstone.com/culture/culture-news/snoop-dogg-sandbox-metaverse-land-sale-1268247/' }
                ]
            },
            {
                id: 'musk-twitter',
                year: '2022',
                title: 'The $44 Billion Tweet',
                description: "Elon spent $44 billion to buy a losing social media platform. It wasn't for profit—it was for status: controlling the global town square. The ultimate Emperor move.",
                icon: 'twitter',
                iconColor: 'text-blue-400',
                borderColor: 'border-blue-600',
                statusType: 'technology',
                highlightText: ['$44 billion'],
                tags: [
                    { label: 'Cost: $44B', colorClass: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Purpose: Status', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'NY Times', url: 'https://www.nytimes.com/2022/10/27/technology/elon-musk-twitter-deal-complete.html' },
                    { label: 'Washington Post', url: 'https://www.washingtonpost.com/technology/2022/10/28/musk-twitter-deal/' }
                ]
            },

            {
                id: 'tesla-space',
                year: '2018',
                title: 'Tesla Roadster in Space',
                description: 'Elon Musk launched his personal Tesla Roadster into space via Falcon Heavy. $90 million rocket launch to send a car to Mars orbit. The ultimate flex: turning space exploration into personal billboard.',
                icon: 'rocket',
                iconColor: 'text-yellow-500',
                borderColor: 'border-yellow-600',
                statusType: 'technology',
                highlightText: ['$90 million rocket launch'],
                tags: [
                    { label: 'Cost: $90M', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Payload: Personal car', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Space.com', url: 'https://www.space.com/39656-spacex-falcon-heavy-tesla-roadster-starman-facts.html' },
                    { label: 'CNN', url: 'https://www.cnn.com/2018/02/06/tech/falcon-heavy-launch/index.html' }
                ]
            },

            {
                id: 'dot-com',
                year: '1999',
                title: 'Dot-com Bubble Parties',
                description: 'Tech companies burned venture capital on extravagant launch parties. $10 million parties for startups with no revenue. Status through conspicuous waste of investor money before the crash.',
                icon: 'barChart',
                iconColor: 'text-cyan-500',
                borderColor: 'border-cyan-600',
                statusType: 'technology',
                highlightText: ['$10 million parties'],
                tags: [
                    { label: 'Cost: $10M parties', colorClass: 'bg-cyan-500/20 text-cyan-400' },
                    { label: 'Result: Bubble burst', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Wired', url: 'https://www.wired.com/2000/04/dot-com-excess/' },
                    { label: 'CNN', url: 'https://www.cnn.com/2000/TECH/computing/04/14/dot.com.lavish.idg/' }
                ]
            },
            {
                id: 'myspace',
                year: '2005',
                title: 'MySpace Top 8',
                description: "Social status through digital real estate. Being in someone's Top 8 friends was social currency. People paid for premium features just to customize their status display—early digital flexing.",
                icon: 'users',
                iconColor: 'text-lime-500',
                borderColor: 'border-lime-600',
                statusType: 'technology',
                highlightText: ['Top 8 friends'],
                tags: [
                    { label: 'Feature: Top 8', colorClass: 'bg-lime-500/20 text-lime-400' },
                    { label: 'Value: Social currency', colorClass: 'bg-purple-500/20 text-purple-400' }
                ],
                links: [
                    { label: 'Vox', url: 'https://www.vox.com/2015/8/3/9096827/myspace-top-8' },
                    { label: 'The Verge', url: 'https://www.theverge.com/2018/3/16/17124662/myspace-top-friends-social-media-history' }
                ]
            },
            {
                id: 'prohibition',
                year: '1920s',
                title: 'Prohibition Era Speakeasies',
                description: 'During alcohol prohibition, wealthy Americans paid $500 per bottle for imported whiskey. Underground clubs became status symbols—paying more for illegal liquor proved you could afford to break laws.',
                icon: 'wine',
                iconColor: 'text-orange-500',
                borderColor: 'border-orange-600',
                statusType: 'luxury',
                highlightText: ['$500 per bottle'],
                tags: [
                    { label: 'Price: $500/bottle', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Status: Lawbreaker', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Prohibition-United-States-history' },
                    { label: 'Library of Congress', url: 'https://www.loc.gov/classroom-materials/prohibition-era/' }
                ]
            },
            {
                id: 'studio-54',
                year: '1977',
                title: 'Studio 54 VIP Culture',
                description: "New York's Studio 54 charged $500-$1000 for VIP tables while rejecting celebrities at the door. Being seen there became more valuable than the entertainment—exclusive access as the ultimate status symbol.",
                icon: 'crown',
                iconColor: 'text-violet-500',
                borderColor: 'border-violet-600',
                statusType: 'events',
                highlightText: ['$500-$1000 for VIP tables'],
                tags: [
                    { label: 'VIP: $500-$1000', colorClass: 'bg-violet-500/20 text-violet-400' },
                    { label: 'Access: Exclusive', colorClass: 'bg-pink-500/20 text-pink-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/topic/Studio-54' },
                    { label: 'NY Times', url: 'https://www.nytimes.com/2020/10/15/arts/music/studio-54-documentary.html' }
                ]
            },
            {
                id: 'y2k-luxury',
                year: '1999',
                title: 'Y2K Luxury Boom',
                description: 'Pre-millennium anxiety drove $20,000 designer handbags and luxury car sales. People spent fortunes on status symbols before the supposed apocalypse—fear driving conspicuous consumption to new heights.',
                icon: 'diamond',
                iconColor: 'text-red-500',
                borderColor: 'border-red-700',
                statusType: 'luxury',
                highlightText: ['$20,000 designer handbags'],
                tags: [
                    { label: 'Bags: $20K+', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Fear: Y2K', colorClass: 'bg-yellow-500/20 text-yellow-400' }
                ],
                links: [
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Y2K-bug' },
                    { label: 'NY Times', url: 'https://www.nytimes.com/1999/12/31/business/y2k-anxiety-drives-luxury-sales.html' }
                ]
            },
            {
                id: 'nft-mania',
                year: '2021',
                title: 'NFT Mania',
                description: 'Digital images of monkeys sold for millions. "Bored Apes" became the new Rolex. People bought them not to look at, but to use as Twitter profile pictures to signal membership in an exclusive digital club.',
                icon: 'image',
                iconColor: 'text-purple-400',
                borderColor: 'border-purple-500',
                statusType: 'technology',
                highlightText: ['new Rolex'],
                tags: [
                    { label: 'Price: $300k+ floor', colorClass: 'bg-purple-500/20 text-purple-400' },
                    { label: 'Utility: Profile Pic', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'The Verge', url: 'https://www.theverge.com/22310188/nft-explainer-what-is-blockchain-crypto-art-faq' },
                    { label: 'OpenSea', url: 'https://opensea.io/collection/boredapeyachtclub' }
                ]
            },
            {
                id: 'ico-craze',
                year: '2017',
                title: 'The ICO Craze',
                description: 'Startups raised billions with just a whitepaper. Investors threw money at anything with "blockchain" in the name. Status was measured in how early you got into the presale of a token that didn\'t exist yet.',
                icon: 'coins',
                iconColor: 'text-orange-400',
                borderColor: 'border-orange-500',
                statusType: 'technology',
                highlightText: ['raised billions'],
                tags: [
                    { label: 'Raised: $4B (EOS)', colorClass: 'bg-green-500/20 text-green-400' },
                    { label: 'Product: None', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Investopedia', url: 'https://www.investopedia.com/terms/i/initial-coin-offering-ico.asp' },
                    { label: 'TechCrunch', url: 'https://techcrunch.com/2017/05/23/the-ico-craze/' }
                ]
            },
            {
                id: 'gilded-age',
                year: '1890s',
                title: 'Gilded Age Mansions',
                description: 'The Vanderbilts built "summer cottages" like The Breakers with platinum wall panels. Costing hundreds of millions (adjusted) for homes used only 6 weeks a year. Architectural warfare between America\'s wealthiest families.',
                icon: 'building',
                iconColor: 'text-emerald-500',
                borderColor: 'border-emerald-700',
                statusType: 'architecture',
                highlightText: ['platinum wall panels'],
                tags: [
                    { label: 'Usage: 6 weeks/year', colorClass: 'bg-emerald-500/20 text-emerald-400' },
                    { label: 'Cost: $300M+ today', colorClass: 'bg-yellow-500/20 text-yellow-400' }
                ],
                links: [
                    { label: 'Newport Mansions', url: 'https://www.newportmansions.org/gilded-age/history-of-the-gilded-age' },
                    { label: 'Britannica', url: 'https://www.britannica.com/event/Gilded-Age' }
                ]
            },
            {
                id: 'salvator-mundi',
                year: '2017',
                title: 'The $450 Million Painting',
                description: 'Leonardo da Vinci\'s "Salvator Mundi" sold for $450.3 million to a Saudi prince. It disappeared into a private yacht or vault. Owning a masterpiece isn\'t about viewing art; it\'s about depriving the world of it to prove you can.',
                icon: 'palette',
                iconColor: 'text-amber-600',
                borderColor: 'border-amber-700',
                statusType: 'art',
                highlightText: ['$450.3 million'],
                tags: [
                    { label: 'Price: $450.3M', colorClass: 'bg-amber-500/20 text-amber-400' },
                    { label: 'Location: Unknown', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'Christie\'s', url: 'https://www.christies.com/features/Leonardo-da-Vinci-Salvator-Mundi-8597-3.aspx' },
                    { label: 'The Guardian', url: 'https://www.theguardian.com/artanddesign/2021/apr/12/salvator-mundi-the-mystery-of-the-lost-da-vinci-painting' }
                ]
            },
            {
                id: 'sports-teams',
                year: '2000s',
                title: 'Sports Team Ownership',
                description: 'For modern billionaires, buying a superyacht is entry-level. Buying a Premier League or NBA team is the real flex. Billions spent on player transfers not for profit, but for the glory of holding the trophy.',
                icon: 'trophy',
                iconColor: 'text-blue-500',
                borderColor: 'border-blue-600',
                statusType: 'events',
                highlightText: ['Buying a Premier League or NBA team'],
                tags: [
                    { label: 'Cost: $2B - $6B', colorClass: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Status: Global Fame', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'Forbes', url: 'https://www.forbes.com/lists/worlds-most-valuable-sports-teams/' },
                    { label: 'The Athletic', url: 'https://theathletic.com/4618869/2023/06/19/premier-league-owners-wealth-ranking/' }
                ]
            },
            {
                id: 'mega-mansions',
                year: '2022',
                title: 'The Giga-Mansion',
                description: 'Properties like "The One" in Bel Air listed for $500 million. 105,000 square feet, 21 bedrooms, 42 bathrooms, a moat, and a nightclub. Houses so large they require a full-time staff of 50 just to keep the dust off.',
                icon: 'home',
                iconColor: 'text-emerald-400',
                borderColor: 'border-emerald-500',
                statusType: 'architecture',
                highlightText: ['$500 million', '42 bathrooms'],
                tags: [
                    { label: 'Size: 105,000 sq ft', colorClass: 'bg-emerald-500/20 text-emerald-400' },
                    { label: 'Staff: 50+', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'Arch Digest', url: 'https://www.architecturaldigest.com/story/the-one-bel-air-mega-mansion' },
                    { label: 'CNBC', url: 'https://www.cnbc.com/2022/03/04/the-one-mega-mansion-sells-for-141-million-at-bankruptcy-auction.html' }
                ]
            },
            {
                id: 'reddit-gold',
                year: '2010',
                title: 'Reddit Gold & Awards',
                description: 'Paying to give "Gold" or "Platinum" awards to Reddit posts. Zero utility beyond signaling generosity and membership in an exclusive club. Early Web2 status-as-a-service model.',
                icon: 'star',
                iconColor: 'text-yellow-500',
                borderColor: 'border-yellow-600',
                statusType: 'technology',
                highlightText: ['status-as-a-service model'],
                tags: [
                    { label: 'Cost: $5-$20/award', colorClass: 'bg-yellow-500/20 text-yellow-400' },
                    { label: 'Utility: None', colorClass: 'bg-red-500/20 text-red-400' }
                ],
                links: [
                    { label: 'Reddit Help', url: 'https://www.reddithelp.com/hc/en-us/articles/205240905-What-is-Reddit-Gold-' },
                    { label: 'The Verge', url: 'https://www.theverge.com/2020/10/15/21518340/reddit-community-points-ethereum-blockchain-nfts' }
                ]
            },
            {
                id: 'csgo-skins',
                year: '2013',
                title: 'CS:GO Skins Economy',
                description: 'Digital weapon camouflages selling for $100,000+. "Dragon Lore" AWPs and "Blue Gem" Karambits created a massive secondary market where pixels held more value than real estate. The birth of digital asset trading.',
                icon: 'swords',
                iconColor: 'text-blue-500',
                borderColor: 'border-blue-600',
                statusType: 'technology',
                highlightText: ['pixels held more value'],
                tags: [
                    { label: 'Price: $100k+', colorClass: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Market: Steam', colorClass: 'bg-slate-500/20 text-slate-400' }
                ],
                links: [
                    { label: 'PC Gamer', url: 'https://www.pcgamer.com/csgo-skin-most-expensive/' },
                    { label: 'Dexerto', url: 'https://www.dexerto.com/csgo/most-expensive-csgo-skins-1342652/' }
                ]
            },
            {
                id: 'paid-verification',
                year: '2022',
                title: 'Paid Verification (Blue Checks)',
                description: 'Twitter (X) and Meta began selling the "verified" badge for a monthly fee. What was once a symbol of notability became a receipt of payment. Status shifted from "who you are" to "what you pay."',
                icon: 'check',
                iconColor: 'text-blue-400',
                borderColor: 'border-blue-500',
                statusType: 'technology',
                highlightText: ['receipt of payment'],
                tags: [
                    { label: 'Cost: $8/month', colorClass: 'bg-blue-500/20 text-blue-400' },
                    { label: 'Status: Subscriber', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'The Verge', url: 'https://www.theverge.com/2022/11/5/23441982/twitter-blue-check-mark-paid-verification-ios-update' },
                    { label: 'BBC', url: 'https://www.bbc.com/news/technology-64707735' }
                ]
            }
        ]
    },
    {
        id: 'future',
        title: 'The On-Chain Era',
        yearRange: '2025 and Beyond',
        icon: 'zap',
        iconColor: 'text-green-500',
        colorClass: 'green-500',
        cards: [
            {
                id: 'digital-potlatch',
                year: '2025',
                title: 'The Digital Potlatch',
                description: 'In 2025, status isn\'t about what you <em>have</em>, it\'s about what you can <em>prove you wasted</em>. On Solana, the "Memo Program" allows us to permanently etch messages onto the blockchain. When you pay for the Throne, you are performing a cryptographic Potlatch.',
                icon: 'lock',
                iconColor: 'text-green-500',
                borderColor: 'border-green-500',
                statusType: 'technology',
                highlightText: ['cryptographic Potlatch'],
                tags: [
                    { label: 'Immutable: Cannot be seized', colorClass: 'bg-green-500/20 text-green-400' },
                    { label: 'Verifiable: Proof of wealth', colorClass: 'bg-green-500/20 text-green-400' }
                ],
                links: [
                    { label: 'Solana Docs', url: 'https://docs.solana.com/developing/runtime-facilities/programs#memo-program' },
                    { label: 'Memo Program', url: 'https://explorer.solana.com/address/MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr' }
                ],
                extraContent: {
                    title: 'Why It Matters',
                    borderColor: 'border-green-500/20',
                    items: [
                        { icon: 'check', text: 'Immutable: Cannot be seized or decayed.', iconColor: 'text-green-500' },
                        { icon: 'check', text: 'Verifiable: Proof of wealth on-chain.', iconColor: 'text-green-500' },
                        { icon: 'check', text: 'Global: Visible to the entire world instantly.', iconColor: 'text-green-500' }
                    ]
                }
            },
            {
                id: 'on-chain-status',
                year: '2025+',
                title: 'On-Chain Status Verification',
                description: 'Traditional status symbols can be faked—blockchain receipts cannot. Every tribute payment creates permanent, verifiable proof of wealth sacrifice. No more fake flexing, only cryptographic truth.',
                icon: 'zap',
                iconColor: 'text-teal-500',
                borderColor: 'border-teal-500',
                statusType: 'technology',
                highlightText: ['permanent, verifiable proof'],
                tags: [
                    { label: 'Fraud-proof: Impossible to counterfeit', colorClass: 'bg-teal-500/20 text-teal-400' },
                    { label: 'Borderless: Global', colorClass: 'bg-teal-500/20 text-teal-400' }
                ],
                links: [
                    { label: 'Solana Docs', url: 'https://docs.solana.com/' },
                    { label: 'Vitalik on Signaling', url: 'https://vitalik.ca/general/2022/01/26/soulbound.html' }
                ],
                extraContent: {
                    title: 'Revolutionary Aspects',
                    borderColor: 'border-teal-500/20',
                    items: [
                        { icon: 'shield', text: 'Fraud-proof: Impossible to counterfeit.', iconColor: 'text-teal-500' },
                        { icon: 'globe', text: 'Borderless: Works across all nations.', iconColor: 'text-teal-500' },
                        { icon: 'clock', text: 'Timeless: Persists as long as blockchain exists.', iconColor: 'text-teal-500' }
                    ]
                }
            },
            {
                id: 'ai-status',
                year: '2026',
                title: 'AI-Generated Status',
                description: "Future status won't be about owning things, but about owning attention. Blockchain-based status systems will compete with AI-generated influencers. Real wealth sacrifice vs. synthetic popularity—only one is verifiable.",
                icon: 'brain',
                iconColor: 'text-violet-500',
                borderColor: 'border-violet-500',
                statusType: 'technology',
                highlightText: ['owning attention'],
                tags: [
                    { label: 'AI: Infinite synthetic status', colorClass: 'bg-violet-500/20 text-violet-400' },
                    { label: 'Blockchain: Finite signals', colorClass: 'bg-violet-500/20 text-violet-400' }
                ],
                links: [
                    { label: 'HBR: AI Influencers', url: 'https://hbr.org/2022/11/how-brands-can-leverage-virtual-influencers' },
                    { label: 'The Atlantic', url: 'https://www.theatlantic.com/technology/archive/2019/05/how-virtual-influencers-are-taking-over-instagram/590435/' }
                ],
                extraContent: {
                    title: 'The Coming Battle',
                    borderColor: 'border-violet-500/20',
                    items: [
                        { icon: 'robot', text: 'AI: Infinite synthetic status generation.', iconColor: 'text-violet-500' },
                        { icon: 'coins', text: 'Blockchain: Finite, costly signals.', iconColor: 'text-violet-500' },
                        { icon: 'trend', text: 'Winner: Whatever humans value more.', iconColor: 'text-violet-500' }
                    ]
                }
            },
            {
                id: 'longevity-status',
                year: '2024+',
                title: 'The Rejuvenation Olympics',
                description: 'Tech centimillionaires spending $2M+ per year on bio-hacking protocols to reverse their "biological age." Public leaderboards track who is aging the slowest. The ultimate status flex: buying time itself.',
                icon: 'heart',
                iconColor: 'text-rose-500',
                borderColor: 'border-rose-500',
                statusType: 'technology',
                highlightText: ['buying time itself'],
                tags: [
                    { label: 'Cost: $2M/year', colorClass: 'bg-rose-500/20 text-rose-400' },
                    { label: 'Goal: Immortality', colorClass: 'bg-blue-500/20 text-blue-400' }
                ],
                links: [
                    { label: 'Rejuvenation Olympics', url: 'https://rejuvenationolympics.com/' },
                    { label: 'Time', url: 'https://time.com/6315607/bryan-johnson-blueprint-longevity/' }
                ],
                extraContent: {
                    title: 'Biological Inequality',
                    borderColor: 'border-rose-500/20',
                    items: [
                        { icon: 'activity', text: 'Metrics: HRV, lung capacity, skin age.', iconColor: 'text-rose-500' },
                        { icon: 'trendDown', text: 'Goal: Lower your age score.', iconColor: 'text-rose-500' },
                        { icon: 'dollar-sign', text: 'Barrier: Extreme wealth required.', iconColor: 'text-rose-500' }
                    ]
                }
            },
            {
                id: 'interplanetary',
                year: '2030+',
                title: 'Interplanetary Status',
                description: "As humanity expands beyond Earth, blockchain-based status will be the only system that works across planets. Your Martian mansion won't impress Earthlings, but your on-chain tribute record will be universally recognized.",
                icon: 'rocket',
                iconColor: 'text-orange-500',
                borderColor: 'border-orange-500',
                statusType: 'technology',
                highlightText: ['blockchain-based status'],
                tags: [
                    { label: 'Universal: Works on any planet', colorClass: 'bg-orange-500/20 text-orange-400' },
                    { label: 'Permanent: Outlasts civilizations', colorClass: 'bg-orange-500/20 text-orange-400' }
                ],
                links: [
                    { label: 'SpaceX', url: 'https://www.spacex.com/human-spaceflight/mars/' },
                    { label: 'NASA', url: 'https://mars.nasa.gov/' }
                ],
                extraContent: {
                    title: 'Space-Age Implications',
                    borderColor: 'border-orange-500/20',
                    items: [
                        { icon: 'globe', text: 'Universal: Works on any planet.', iconColor: 'text-orange-500' },
                        { icon: 'zap', text: 'Instant: No light-speed delays.', iconColor: 'text-orange-500' },
                        { icon: 'history', text: 'Permanent: Outlasts civilizations.', iconColor: 'text-orange-500' }
                    ]
                }
            },
            {
                id: 'soulbound',
                year: '2025',
                title: 'Soulbound Tokens (SBTs)',
                description: 'Non-transferable digital tokens that represent your identity and achievements. Unlike NFTs, you can\'t sell them. They prove you actually <em>did</em> the thing, rather than just bought the badge. The ultimate proof of merit.',
                icon: 'user',
                iconColor: 'text-indigo-400',
                borderColor: 'border-indigo-500',
                statusType: 'technology',
                highlightText: ['Non-transferable', 'proof of merit'],
                tags: [
                    { label: 'Transferable: No', colorClass: 'bg-red-500/20 text-red-400' },
                    { label: 'Value: Reputation', colorClass: 'bg-indigo-500/20 text-indigo-400' }
                ],
                links: [
                    { label: 'Vitalik.ca', url: 'https://vitalik.ca/general/2022/01/26/soulbound.html' },
                    { label: 'CoinDesk', url: 'https://www.coindesk.com/learn/what-are-soulbound-tokens-sbts-and-how-do-they-work/' }
                ]
            }
        ]
    }
  ]
};
